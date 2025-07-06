import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabaseClient.auth.getUser(token)

    if (error || !user) {
      throw new Error('Invalid token')
    }

    // Get the Unified API key from secrets
    const unifiedApiKey = Deno.env.get('UNIFIED_API_KEY')
    
    if (!unifiedApiKey) {
      throw new Error('Unified API key not configured')
    }

    return new Response(
      JSON.stringify({ 
        apiKey: unifiedApiKey,
        success: true 
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error getting Unified API key:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500,
      }
    )
  }
})