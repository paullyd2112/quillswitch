import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyTOTPCode } from '../_shared/totp.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { secret, code, backupCodes } = await req.json();

    if (!secret || !code || !backupCodes) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: secret, code, backupCodes' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the TOTP code
    const isValidCode = await verifyTOTPCode(secret, code);
    if (!isValidCode) {
      return new Response(
        JSON.stringify({ error: 'Invalid verification code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the encryption key from vault
    const { data: encryptionKey, error: keyError } = await supabase
      .from('vault.secrets')
      .select('secret')
      .eq('name', 'service_credentials_encryption_key')
      .single();

    if (keyError || !encryptionKey?.secret) {
      console.error('Failed to get encryption key:', keyError);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store encrypted TOTP secret and backup codes
    const { error: insertError } = await supabase
      .from('user_security_settings')
      .upsert({
        user_id: user.id,
        two_factor_enabled: true,
        totp_secret: secret, // This will be encrypted by the trigger
        backup_codes: backupCodes,
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Failed to store 2FA settings:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to enable 2FA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('2FA enabled successfully for user:', user.id);

    return new Response(
      JSON.stringify({ success: true, message: '2FA enabled successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})