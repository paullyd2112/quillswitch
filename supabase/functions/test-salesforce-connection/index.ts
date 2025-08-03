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

    console.log('Retrieved credential:', {
      id: credential.id,
      service_name: credential.service_name,
      credential_type: credential.credential_type,
      metadata: credential.metadata
    })

    // For OAuth connections managed by Nango
    if (credential.credential_type === 'oauth_token') {
      const nangoConnectionId = credential.metadata?.nango_connection_id;
      const providerConfigKey = credential.metadata?.provider_config_key || credential.service_name;
      
      if (!nangoConnectionId) {
        throw new Error('Missing Nango connection ID in credential metadata')
      }

      console.log('Using Nango connection ID:', nangoConnectionId)
      console.log('Provider config key:', providerConfigKey)

      // Get the OAuth token from Nango using the correct API format
      const nangoUrl = `https://api.nango.dev/connection/${nangoConnectionId}?provider_config_key=${encodeURIComponent(providerConfigKey)}`;
      console.log('Calling Nango API at:', nangoUrl)
      
      const nangoResponse = await fetch(nangoUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('NANGO_SECRET_KEY')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Nango API response status:', nangoResponse.status);

      if (!nangoResponse.ok) {
        const errorText = await nangoResponse.text();
        console.error('Nango API error:', errorText);
        throw new Error(`Failed to get OAuth token from Nango: ${nangoResponse.status} - ${errorText}`)
      }

      const nangoData = await nangoResponse.json();
      console.log('=== FULL NANGO RESPONSE ===');
      console.log('Nango response data:', JSON.stringify(nangoData, null, 2));
      console.log('Nango response keys:', Object.keys(nangoData || {}));
      
      // Nango might return credentials in different formats
      let accessToken, instanceUrl;
      
      // Log all possible credential structures
      if (nangoData.credentials) {
        console.log('Found credentials object:', JSON.stringify(nangoData.credentials, null, 2));
        accessToken = nangoData.credentials.access_token;
        instanceUrl = nangoData.credentials.instance_url;
      } else {
        console.log('No credentials object, checking root level');
        accessToken = nangoData.access_token;
        instanceUrl = nangoData.instance_url;
      }
      
      console.log('Extracted values:');
      console.log('- accessToken:', accessToken ? '[PRESENT]' : '[MISSING]');
      console.log('- instanceUrl:', instanceUrl || '[MISSING]');

      if (!accessToken) {
        console.error('No access token in Nango response:', nangoData);
        throw new Error('No access token received from Nango')
      }

      console.log('Got access token from Nango, instance URL:', instanceUrl);

      // Test the connection by making a simple API call to Salesforce
      const testUrl = `${instanceUrl}/services/data/v59.0/sobjects/Organization/`;
      console.log('Testing Salesforce connection at:', testUrl);
      
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
    console.error('Salesforce connection test error:', error)
    
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