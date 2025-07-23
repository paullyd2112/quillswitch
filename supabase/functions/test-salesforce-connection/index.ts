
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

    // Get the decrypted credential
    const { data: credentials, error: credError } = await supabase
      .rpc('get_decrypted_credential_with_logging', {
        p_credential_id: credentialId
      });

    if (credError || !credentials || credentials.length === 0) {
      throw new Error('Failed to retrieve Salesforce credentials')
    }

    const credentialData = JSON.parse(credentials[0].credential_value)

    // Test the connection by making a simple API call to Salesforce
    const response = await fetch(`${credentialData.instance_url}/services/data/v59.0/sobjects/Organization/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${credentialData.access_token}`,
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
      const orgResponse = await fetch(`${credentialData.instance_url}/services/data/v59.0/query/?q=SELECT+Name+FROM+Organization+LIMIT+1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${credentialData.access_token}`,
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
