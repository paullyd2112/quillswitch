
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

    // For OAuth connections, get the credential and use Nango to get the actual token
    const { data: credential, error: credError } = await supabase
      .from('service_credentials')
      .select('*')
      .eq('id', credentialId)
      .eq('user_id', user.id)
      .single();

    if (credError || !credential) {
      throw new Error('Failed to retrieve Salesforce credentials')
    }

    // If this is an OAuth token, we need to get the actual access token from Nango
    if (credential.credential_type === 'oauth_token') {
      const nangoConnectionId = credential.metadata?.nango_connection_id;
      if (!nangoConnectionId) {
        throw new Error('Missing Nango connection ID')
      }

      // Make a request to Nango to get the current access token
      const nangoResponse = await fetch(`https://api.nango.dev/connection/${nangoConnectionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('NANGO_SECRET_KEY')}`,
          'Provider-Config-Key': credential.service_name,
          'Content-Type': 'application/json'
        }
      });

      if (!nangoResponse.ok) {
        throw new Error('Failed to get OAuth token from Nango')
      }

      const nangoData = await nangoResponse.json();
      const accessToken = nangoData.credentials.access_token;
      const instanceUrl = nangoData.credentials.instance_url;

      if (!accessToken || !instanceUrl) {
        throw new Error('Invalid OAuth credentials from Nango')
      }

      // Test the connection by making a simple API call to Salesforce
      const response = await fetch(`${instanceUrl}/services/data/v59.0/sobjects/Organization/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        // If the request fails, the token might be expired
        if (response.status === 401) {
          throw new Error('Access token expired. Please reconnect your Salesforce account.')
        }
        throw new Error(`Salesforce API error: ${response.status} ${response.statusText}`)
      }

      const orgData = await response.json()
      
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
    } else {
      throw new Error('Only OAuth connections are supported for testing')
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        organizationName,
        message: 'Connection test successful'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

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
