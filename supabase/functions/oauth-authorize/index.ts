
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
    
    if (!providerParam) {
      return new Response(
        JSON.stringify({ error: "Provider parameter is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    const provider = providerParam.toLowerCase();
    
    // Get WorkOS credentials from environment
    const workosClientId = Deno.env.get("WORKOS_CLIENT_ID");
    const workosApiKey = Deno.env.get("WORKOS_API_KEY");
    
    if (!workosClientId || !workosApiKey) {
      console.error("WorkOS credentials not configured");
      return new Response(
        JSON.stringify({ error: "OAuth service not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Map CRM providers to their OAuth configurations
    const providerConfigs: Record<string, { domain: string; connection: string }> = {
      "salesforce": {
        domain: "login.salesforce.com",
        connection: "salesforce"
      },
      "hubspot": {
        domain: "app.hubspot.com",
        connection: "hubspot"
      },
      "zoho": {
        domain: "accounts.zoho.com",
        connection: "zoho"
      },
      "pipedrive": {
        domain: "oauth.pipedrive.com",
        connection: "pipedrive"
      }
    };
    
    const config = providerConfigs[provider];
    if (!config) {
      return new Response(
        JSON.stringify({ error: `Unsupported provider: ${provider}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Generate state parameter for CSRF protection
    const state = crypto.randomUUID();
    
    // Use WorkOS User Management for OAuth
    const redirectUri = `${url.origin}/app/oauth/callback`;
    
    // Build WorkOS authorization URL
    const authorizationUrl = new URL("https://api.workos.com/user_management/authorize");
    authorizationUrl.searchParams.set("client_id", workosClientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("state", JSON.stringify({ provider, csrfToken: state }));
    authorizationUrl.searchParams.set("provider", config.connection);
    
    console.log(`Generated OAuth URL for ${provider}:`, authorizationUrl.toString());
    
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
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
