import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== NANGO PROXY FUNCTION STARTED ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Returning CORS preflight response');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { provider, endpoint, method = 'GET', data: requestData, connectionId } = await req.json()
    
    console.log('=== NANGO PROXY DEBUG START ===')
    console.log('Request method:', method)
    console.log('Provider:', provider)
    console.log('Raw endpoint received:', JSON.stringify(endpoint))
    console.log('Connection ID from request:', connectionId)
    console.log('Request data:', requestData)

    const nangoSecretKey = Deno.env.get('NANGO_SECRET_KEY')
    if (!nangoSecretKey) {
      throw new Error('Nango secret key not configured')
    }
    console.log('Nango secret key present:', !!nangoSecretKey)

    // Resolve connection ID: prefer explicit id from caller (e.g., Nango Connect), fallback to provider_userId
    const resolvedConnectionId = connectionId || `${provider}_${user.id}`
    console.log('Resolved connection ID:', resolvedConnectionId)
    
    // Make request to Nango API - add required query parameters
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const url = new URL(`https://api.nango.dev/${cleanEndpoint}`)
    
    // Add required query parameters for Nango API
    url.searchParams.set('provider_config_key', provider)
    url.searchParams.set('connection_id', resolvedConnectionId)
    
    const nangoUrl = url.toString()
    console.log('Clean endpoint:', cleanEndpoint)
    console.log('Provider config key:', provider)
    console.log('Connection ID:', resolvedConnectionId)
    console.log('Final Nango URL with query params:', nangoUrl)
    
    const nangoHeaders = {
      'Authorization': `Bearer ${nangoSecretKey}`,
      'Content-Type': 'application/json',
    }
    console.log('Nango headers:', JSON.stringify(nangoHeaders, null, 2))

    const nangoOptions: RequestInit = {
      method,
      headers: nangoHeaders,
    }

    if (requestData && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      nangoOptions.body = JSON.stringify(requestData)
      console.log('Request body:', nangoOptions.body)
    }

    console.log('Making request to Nango...')
    const nangoResponse = await fetch(nangoUrl, nangoOptions)
    console.log('Nango response status:', nangoResponse.status)
    console.log('Nango response headers:', Object.fromEntries(nangoResponse.headers.entries()))
    
    const responseData = await nangoResponse.json()
    console.log('Nango response data:', JSON.stringify(responseData, null, 2))

    if (!nangoResponse.ok) {
      console.error('=== NANGO API ERROR ===')
      console.error('Status:', nangoResponse.status)
      console.error('Response:', responseData)
      throw new Error(responseData.message || 'Nango API request failed')
    }

    console.log('=== NANGO PROXY SUCCESS ===')
    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )

  } catch (error) {
    console.error('Nango proxy error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      },
    )
  }
})