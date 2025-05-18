
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
    
    // This would be replaced with actual OAuth configuration for each provider
    const oauthConfig: Record<string, { authUrl: string, clientId: string }> = {
      "salesforce": {
        authUrl: "https://login.salesforce.com/services/oauth2/authorize",
        clientId: "your_salesforce_client_id" // Would be retrieved from environment variables
      },
      "hubspot": {
        authUrl: "https://app.hubspot.com/oauth/authorize",
        clientId: "your_hubspot_client_id"
      },
      // Add other providers as needed
    };
    
    const config = oauthConfig[provider];
    if (!config) {
      return new Response(
        JSON.stringify({ error: `Unsupported provider: ${provider}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // In a real implementation, we would generate a state parameter for CSRF protection
    const state = crypto.randomUUID();
    
    // In a real implementation, this would be a URL to your OAuth callback endpoint
    const redirectUri = `${url.origin}/oauth/callback`;
    
    // Build the authorization URL
    const authorizationUrl = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;
    
    // Return the authorization URL
    return new Response(
      JSON.stringify({ url: authorizationUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
