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

    const { integrationId } = await req.json()
    
    console.log(`Creating Nango Connect session for user ${user.id} and integration ${integrationId}`)

    const nangoSecretKey = Deno.env.get('NANGO_SECRET_KEY')
    if (!nangoSecretKey) {
      throw new Error('Nango secret key not configured')
    }

    // Create Connect session with Nango
    const sessionResponse = await fetch('https://api.nango.dev/connect/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nangoSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        allowed_integrations: [integrationId],
        user_id: user.id,
        user_email: user.email,
        end_user_organization_id: user.id, // Using user ID as org ID for simplicity
        end_user_organization_display_name: user.email?.split('@')[0] || 'User'
      })
    })

    if (!sessionResponse.ok) {
      const errorData = await sessionResponse.json()
      console.error('Nango session creation error:', errorData)
      throw new Error(`Failed to create Nango session: ${errorData.message || 'Unknown error'}`)
    }

    const sessionData = await sessionResponse.json()
    
    console.log('Nango Connect session created successfully')

    return new Response(
      JSON.stringify({
        sessionToken: sessionData.token,
        expiresAt: sessionData.expires_at
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )

  } catch (error) {
    console.error('Nango session creation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      },
    )
  }
})