
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
    
    console.log("=== Unified.to OAuth Callback ===");
    console.log("Code:", code ? "present" : "missing");
    console.log("State:", state ? "present" : "missing");
    
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
    
    const { provider, workspaceId } = stateData;
    console.log("Processing callback for provider:", provider, "workspace:", workspaceId);

    // Get Unified.to API key from Supabase secrets
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const unifiedApiKey = Deno.env.get('UNIFIED_API_KEY');
    if (!unifiedApiKey) {
      console.error("ERROR: UNIFIED_API_KEY not found in environment");
      return new Response(
        JSON.stringify({ error: "Unified API key not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Exchange authorization code for connection using Unified.to API
    const redirectUri = `${url.origin}/oauth/callback`;
    
    const unifiedResponse = await fetch(`https://api.unified.to/unified/connections`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${unifiedApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workspace_id: workspaceId,
        integration_type: provider,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!unifiedResponse.ok) {
      const errorData = await unifiedResponse.text();
      console.error("Unified.to connection creation error:", errorData);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create connection",
          details: errorData
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const connectionData = await unifiedResponse.json();
    console.log("Connection created successfully:", connectionData.id);

    // Store connection info in Supabase for the user
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      const { data: { user }, error } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      
      if (!error && user) {
        userId = user.id;
        
        // Store the connection in our database
        const { error: insertError } = await supabase
          .from('service_credentials')
          .insert({
            user_id: userId,
            service_name: provider,
            credential_name: `${provider}_connection`,
            credential_type: 'oauth_connection',
            credential_value: JSON.stringify({
              connection_id: connectionData.id,
              workspace_id: workspaceId,
              integration_type: provider,
              created_at: new Date().toISOString()
            }),
            environment: 'production'
          });

        if (insertError) {
          console.error("Error storing connection:", insertError);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        connectionId: connectionData.id,
        provider: provider,
        workspaceId: workspaceId,
        message: "Connection created successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("=== OAuth Callback Error ===");
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process authentication" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
