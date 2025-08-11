import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== GET NANGO CONFIG FUNCTION STARTED ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Returning CORS preflight response');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const nangoPublicKey = Deno.env.get('NANGO_PUBLIC_KEY')
    const nangoSecretKey = Deno.env.get('NANGO_SECRET_KEY')
    
    console.log('=== NANGO CONFIG CHECK ===');
    console.log('NANGO_PUBLIC_KEY exists:', !!nangoPublicKey);
    console.log('NANGO_PUBLIC_KEY length:', nangoPublicKey?.length || 0);
    console.log('NANGO_SECRET_KEY exists:', !!nangoSecretKey);
    console.log('NANGO_SECRET_KEY length:', nangoSecretKey?.length || 0);
    console.log('All env vars:', Object.keys(Deno.env.toObject()));

    if (!nangoPublicKey) {
      throw new Error('Nango public key not configured')
    }

    return new Response(
      JSON.stringify({ 
        publicKey: nangoPublicKey,
        hasSecretKey: !!nangoSecretKey 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )

  } catch (error) {
    console.error('Get Nango config error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      },
    )
  }
})