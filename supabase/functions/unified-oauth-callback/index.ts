import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const unifiedApiKey = Deno.env.get('UNIFIED_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!unifiedApiKey || !supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required environment variables" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    const { code, state, connection_id, error: oauth_error } = await req.json();
    
    if (oauth_error) {
      console.error('OAuth error from provider:', oauth_error);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `OAuth error: ${oauth_error}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    if (!code || !connection_id) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required parameters: code and connection_id" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    console.log(`Processing OAuth callback for connection ${connection_id}`);

    // Complete the OAuth flow with Unified.to
    const tokenResponse = await fetch(`https://api.unified.to/unified/connection/${connection_id}/auth`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${unifiedApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        state: state
      })
    });

    console.log('Token exchange response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange error:', errorText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to exchange token: ${tokenResponse.status} ${errorText}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    const connectionData = await tokenResponse.json();
    console.log('Connection established:', { id: connectionData.id, integration_type: connectionData.integration_type });

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing authorization header" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Failed to authenticate user" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }

    // Store the connection in our database
    const { error: dbError } = await supabase
      .from('service_credentials')
      .insert({
        user_id: user.id,
        service_name: connectionData.integration_type,
        credential_name: `${connectionData.integration_type} Connection`,
        credential_type: 'unified_connection',
        credential_value: JSON.stringify({
          connection_id: connectionData.id,
          workspace_id: connectionData.workspace_id,
          integration_type: connectionData.integration_type,
          auth_token: connectionData.auth?.access_token || 'stored_in_unified',
          created_at: connectionData.created_at
        }),
        metadata: {
          unified_connection_id: connectionData.id,
          integration_type: connectionData.integration_type,
          workspace_id: connectionData.workspace_id,
          auth_type: 'oauth2',
          status: 'active'
        }
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Failed to store connection" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    console.log('Connection stored successfully for user:', user.id);

    return new Response(
      JSON.stringify({
        success: true,
        connection: {
          id: connectionData.id,
          integration_type: connectionData.integration_type,
          workspace_id: connectionData.workspace_id,
          status: 'connected'
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred during OAuth callback" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});