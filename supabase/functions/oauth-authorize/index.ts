
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const providerParam = url.searchParams.get("provider");
    
    console.log("OAuth authorize request received for provider:", providerParam);
    
    if (!providerParam) {
      console.error("No provider parameter provided");
      return new Response(
        JSON.stringify({ error: "Provider parameter is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    const provider = providerParam.toLowerCase();
    console.log("Processing OAuth for provider:", provider);
    
    // Get WorkOS credentials from environment
    const workosClientId = Deno.env.get("WORKOS_CLIENT_ID");
    const workosApiKey = Deno.env.get("WORKOS_API_KEY");
    
    console.log("WorkOS Client ID present:", !!workosClientId);
    console.log("WorkOS API Key present:", !!workosApiKey);
    
    if (!workosClientId || !workosApiKey) {
      console.error("WorkOS credentials not configured");
      return new Response(
        JSON.stringify({ error: "OAuth service not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Map CRM providers to their OAuth configurations
    const providerConfigs: Record<string, { connection: string }> = {
      "salesforce": {
        connection: "SalesforceOAuth"
      },
      "hubspot": {
        connection: "HubSpotOAuth"
      },
      "zoho": {
        connection: "ZohoCrmOAuth"
      },
      "pipedrive": {
        connection: "PipedriveOAuth"
      }
    };
    
    const config = providerConfigs[provider];
    console.log("Provider config found:", !!config, config);
    
    if (!config) {
      console.error(`Unsupported provider: ${provider}`);
      return new Response(
        JSON.stringify({ error: `Unsupported provider: ${provider}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Generate state parameter for CSRF protection
    const state = crypto.randomUUID();
    console.log("Generated state:", state);
    
    // Use the current app URL for the redirect
    const redirectUri = `${url.origin}/app/oauth/callback`;
    console.log("Redirect URI:", redirectUri);
    
    // Build WorkOS authorization URL
    const authorizationUrl = new URL("https://api.workos.com/user_management/authorize");
    authorizationUrl.searchParams.set("client_id", workosClientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("state", JSON.stringify({ provider, csrfToken: state }));
    authorizationUrl.searchParams.set("connection", config.connection);
    
    console.log("Generated OAuth URL:", authorizationUrl.toString());
    
    // Return the authorization URL
    return new Response(
      JSON.stringify({ 
        url: authorizationUrl.toString(),
        state: state,
        provider: provider
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing OAuth authorization request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
