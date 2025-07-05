import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const providerParam = url.searchParams.get("provider");
    const workspaceId = url.searchParams.get("workspace_id");
    
    console.log("=== Unified.to OAuth Authorize ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Provider param:", providerParam);
    console.log("Workspace ID:", workspaceId);
    
    if (!providerParam) {
      console.error("ERROR: No provider parameter provided");
      return new Response(
        JSON.stringify({ error: "Provider parameter is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!workspaceId) {
      console.error("ERROR: No workspace_id parameter provided");
      return new Response(
        JSON.stringify({ error: "Workspace ID parameter is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    const provider = providerParam.toLowerCase();
    console.log("Processing provider:", provider);

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

    // Create authorization URL using Unified.to API
    const redirectUri = `${url.origin}/oauth/callback`;
    const state = JSON.stringify({ provider, workspaceId });

    // Call Unified.to API to get authorization URL
    const unifiedResponse = await fetch(`https://api.unified.to/unified/integrations/auth/${provider}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${unifiedApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workspace_id: workspaceId,
        redirect_uri: redirectUri,
        state: state,
      }),
    });

    if (!unifiedResponse.ok) {
      const errorData = await unifiedResponse.text();
      console.error("Unified.to API error:", errorData);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create authorization URL",
          details: errorData
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const authData = await unifiedResponse.json();
    console.log("Authorization URL created:", authData.auth_url);

    return new Response(
      JSON.stringify({ 
        authUrl: authData.auth_url,
        provider: provider,
        workspaceId: workspaceId
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("=== OAuth Authorize Error ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message,
        debug: {
          errorType: error.constructor.name,
          timestamp: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
