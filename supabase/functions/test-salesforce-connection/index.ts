import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Invalid token')
    }

    const { credentialId } = await req.json()

    if (!credentialId) {
      throw new Error('Credential ID is required')
    }

    console.log('=== STARTING SALESFORCE CONNECTION TEST ===');
    console.log('User ID:', user.id);
    console.log('Credential ID:', credentialId);

    // Get the credential record to find the Nango connection ID
    const { data: credential, error: credError } = await supabase
      .from('service_credentials')
      .select('*')
      .eq('id', credentialId)
      .eq('user_id', user.id)
      .single();

    if (credError || !credential) {
      console.error('Failed to retrieve credential:', credError)
      throw new Error('Failed to retrieve credential from database')
    }

    console.log('=== CREDENTIAL INFO ===');
    console.log('Service name:', credential.service_name);
    console.log('Credential type:', credential.credential_type);
    console.log('Metadata:', JSON.stringify(credential.metadata, null, 2));

    // For OAuth connections managed by Nango
    if (credential.credential_type === 'oauth_token') {
      const nangoConnectionId = credential.metadata?.nango_connection_id;
      const providerConfigKey = credential.metadata?.provider_config_key || credential.service_name;
      
      if (!nangoConnectionId) {
        throw new Error('Missing Nango connection ID in credential metadata')
      }

      console.log('=== NANGO CONNECTION INFO ===');
      console.log('Connection ID:', nangoConnectionId);
      console.log('Provider config key:', providerConfigKey);

      // Instead of calling Nango directly, use the nango-proxy edge function
      // This is the same approach your app uses for connections
      console.log('=== CALLING NANGO PROXY ===');
      
      const nangoProxyResponse = await supabase.functions.invoke('nango-proxy', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          provider: providerConfigKey,
          endpoint: `/connection/${nangoConnectionId}`,
          method: 'GET',
          connectionId: nangoConnectionId,
        }
      });

      console.log('Nango proxy response:', JSON.stringify(nangoProxyResponse, null, 2));

      if (nangoProxyResponse.error) {
        console.error('Nango proxy error:', nangoProxyResponse.error);
        throw new Error(`Failed to get OAuth token via proxy: ${nangoProxyResponse.error.message}`);
      }

      const nangoData = nangoProxyResponse.data;
      console.log('=== NANGO DATA STRUCTURE ===');
      console.log('Keys:', Object.keys(nangoData || {}));
      console.log('Full data:', JSON.stringify(nangoData, null, 2));

      // Extract credentials from Nango response
      let accessToken, instanceUrl;
      
      if (nangoData?.credentials) {
        console.log('Using credentials object');
        accessToken = nangoData.credentials.access_token;
        instanceUrl = nangoData.credentials.instance_url;
      } else if (nangoData?.access_token) {
        console.log('Using root level tokens');
        accessToken = nangoData.access_token;
        instanceUrl = nangoData.instance_url;
      }

      console.log('=== EXTRACTED VALUES ===');
      console.log('Access token present:', !!accessToken);
      console.log('Instance URL:', instanceUrl || '[MISSING]');

      if (!accessToken) {
        console.error('No access token found in Nango response');
        throw new Error('No access token received from Nango')
      }

      if (!instanceUrl) {
        console.error('No instance URL found in Nango response');
        throw new Error('No Salesforce instance URL received from Nango')
      }

      // Test the connection by making a simple API call to Salesforce
      const testUrl = `${instanceUrl}/services/data/v59.0/sobjects/Organization/`;
      console.log('=== TESTING SALESFORCE CONNECTION ===');
      console.log('Test URL:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Salesforce API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Salesforce API error:', errorText);
        
        // If the request fails, the token might be expired
        if (response.status === 401) {
          throw new Error('Access token expired. Please reconnect your Salesforce account.')
        }
        throw new Error(`Salesforce API error: ${response.status} ${response.statusText}`)
      }

      // Try to get organization details
      let organizationName = 'Connected Organization'
      
      try {
        const orgResponse = await fetch(`${instanceUrl}/services/data/v59.0/query/?q=SELECT+Name+FROM+Organization+LIMIT+1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (orgResponse.ok) {
          const orgQueryResult = await orgResponse.json()
          if (orgQueryResult.records && orgQueryResult.records.length > 0) {
            organizationName = orgQueryResult.records[0].Name
          }
        }
      } catch (error) {
        console.log('Could not fetch organization name:', error)
      }

      console.log('=== CONNECTION TEST SUCCESSFUL ===');
      console.log('Organization:', organizationName);

      return new Response(
        JSON.stringify({ 
          success: true,
          organizationName,
          message: 'Connection test successful - OAuth via Nango'
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    } else {
      throw new Error('Only OAuth connections via Nango are supported for testing')
    }

  } catch (error) {
    console.error('=== SALESFORCE CONNECTION TEST ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})