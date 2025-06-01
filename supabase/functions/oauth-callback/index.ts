
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    
    if (!code || !state) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Parse state parameter
    let stateData;
    try {
      stateData = JSON.parse(state);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid state parameter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    const { provider, csrfToken } = stateData;
    
    // Get WorkOS credentials
    const workosClientId = Deno.env.get("WORKOS_CLIENT_ID");
    const workosApiKey = Deno.env.get("WORKOS_API_KEY");
    
    if (!workosClientId || !workosApiKey) {
      console.error("WorkOS credentials not configured");
      return new Response(
        JSON.stringify({ error: "OAuth service not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Exchange authorization code for access token with WorkOS
    const tokenResponse = await fetch("https://api.workos.com/user_management/authenticate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${workosApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: workosClientId,
        code: code,
        grant_type: "authorization_code",
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("WorkOS token exchange failed:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to exchange authorization code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    const tokenData = await tokenResponse.json();
    console.log("WorkOS authentication successful for provider:", provider);
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Get the authenticated user from the request
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    // Store the OAuth tokens securely using the encrypt_and_store_credential function
    const { data: credentialId, error: storeError } = await supabase.rpc('encrypt_and_store_credential', {
      p_service_name: provider,
      p_credential_name: `${provider}_oauth_token`,
      p_credential_type: 'oauth_token',
      p_credential_value: JSON.stringify({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in,
        scope: tokenData.scope
      }),
      p_environment: 'production',
      p_expires_at: tokenData.expires_in ? 
        new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString() : 
        null,
      p_metadata: {
        provider: provider,
        workos_user_id: tokenData.user?.id,
        connection_type: 'oauth'
      },
      p_tags: ['oauth', 'crm', provider]
    });
    
    if (storeError) {
      console.error("Failed to store OAuth credentials:", storeError);
      return new Response(
        JSON.stringify({ error: "Failed to store credentials securely" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    console.log(`OAuth credentials stored successfully for ${provider} with ID:`, credentialId);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        provider,
        credential_id: credentialId,
        message: `Successfully connected to ${provider}! Your OAuth credentials have been securely stored.`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing OAuth callback:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process authentication" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
