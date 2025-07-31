import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyTOTPCode, generateBackupCodes } from '../_shared/totp.ts'

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

    const { verificationCode } = await req.json();

    if (!verificationCode) {
      return new Response(
        JSON.stringify({ error: 'Missing verification code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get current 2FA settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_security_settings')
      .select('totp_secret, backup_codes, two_factor_enabled')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !settings || !settings.two_factor_enabled) {
      console.error('Failed to get 2FA settings:', settingsError);
      return new Response(
        JSON.stringify({ error: '2FA not enabled' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let isValid = false;

    // Check if it's a backup code
    if (settings.backup_codes?.includes(verificationCode)) {
      isValid = true;
    } else if (settings.totp_secret) {
      // Check TOTP code
      isValid = await verifyTOTPCode(settings.totp_secret.toString(), verificationCode);
    }

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid verification code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate new backup codes
    const newBackupCodes = generateBackupCodes();

    // Update backup codes
    const { error: updateError } = await supabase
      .from('user_security_settings')
      .update({
        backup_codes: newBackupCodes,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to regenerate backup codes:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to regenerate backup codes' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Backup codes regenerated successfully for user:', user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Backup codes regenerated successfully',
        backupCodes: newBackupCodes
      }),
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