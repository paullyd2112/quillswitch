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
    
    console.log(`🔍 Creating Nango Connect session:`, {
      userId: user.id,
      userEmail: user.email,
      integrationId
    })

    const nangoSecretKey = Deno.env.get('NANGO_SECRET_KEY')
    if (!nangoSecretKey) {
      throw new Error('Nango secret key not configured')
    }

    // Create Connect session with Nango using the correct API format
    const sessionResponse = await fetch('https://api.nango.dev/connect/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nangoSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        end_user: {
          id: user.id,
          email: user.email,
          display_name: user.email?.split('@')[0] || 'User'
        },
        organization: {
          id: user.id, // Using user ID as org ID for simplicity
          display_name: user.email?.split('@')[1] || 'Organization'
        },
        allowed_integrations: [integrationId],
        integrations_config_defaults: {}
      })
    })

    if (!sessionResponse.ok) {
      const errorData = await sessionResponse.json()
      console.error('Nango session creation error:', JSON.stringify(errorData, null, 2))
      console.error('Request body was:', JSON.stringify({
        end_user: { id: user.id, email: user.email, display_name: user.email?.split('@')[0] || 'User' },
        organization: { id: user.id, display_name: user.email?.split('@')[1] || 'Organization' },
        allowed_integrations: [integrationId],
        integrations_config_defaults: {}
      }, null, 2))
      throw new Error(`Failed to create Nango session: ${errorData.error?.message || errorData.message || JSON.stringify(errorData)}`)
    }

    const sessionData = await sessionResponse.json()
    
    console.log('Nango Connect session created successfully:', sessionData)

    // Nango returns data in nested format: { data: { token, expires_at } }
    return new Response(
      JSON.stringify({
        sessionToken: sessionData.data.token,
        expiresAt: sessionData.data.expires_at
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