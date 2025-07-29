import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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

    const { provider, endpoint, method = 'GET', data: requestData } = await req.json()
    
    console.log(`Nango proxy request: ${method} ${endpoint} for ${provider}`)

    const nangoSecretKey = Deno.env.get('NANGO_SECRET_KEY')
    if (!nangoSecretKey) {
      throw new Error('Nango secret key not configured')
    }

    // Connection ID format: provider_userId
    const connectionId = `${provider}_${user.id}`
    
    // Make request to Nango API
    const nangoUrl = `https://api.nango.dev/v1/${endpoint}`
    const nangoHeaders = {
      'Authorization': `Bearer ${nangoSecretKey}`,
      'Content-Type': 'application/json',
      'Provider-Config-Key': provider,
      'Connection-Id': connectionId,
    }

    const nangoOptions: RequestInit = {
      method,
      headers: nangoHeaders,
    }

    if (requestData && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      nangoOptions.body = JSON.stringify(requestData)
    }

    const nangoResponse = await fetch(nangoUrl, nangoOptions)
    const responseData = await nangoResponse.json()

    if (!nangoResponse.ok) {
      console.error('Nango API error:', responseData)
      throw new Error(responseData.message || 'Nango API request failed')
    }

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