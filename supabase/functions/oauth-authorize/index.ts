
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
    
    console.log("=== OAuth Authorize Debug ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Provider param:", providerParam);
    console.log("All search params:", Object.fromEntries(url.searchParams.entries()));
    
    if (!providerParam) {
      console.error("ERROR: No provider parameter provided");
      return new Response(
        JSON.stringify({ error: "Provider parameter is required", debug: "No provider in URL params" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    const provider = providerParam.toLowerCase();
    console.log("Processing provider:", provider);
    
    // Get WorkOS credentials from environment
    const workosClientId = Deno.env.get("WORKOS_CLIENT_ID");
    const workosApiKey = Deno.env.get("WORKOS_API_KEY");
    
    console.log("WorkOS Client ID exists:", !!workosClientId);
    console.log("WorkOS API Key exists:", !!workosApiKey);
    console.log("WorkOS Client ID value:", workosClientId ? `${workosClientId.substring(0, 10)}...` : "null");
    
    if (!workosClientId || !workosApiKey) {
      console.error("ERROR: WorkOS credentials missing");
      return new Response(
        JSON.stringify({ 
          error: "OAuth service not configured", 
          debug: {
            hasClientId: !!workosClientId,
            hasApiKey: !!workosApiKey
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Map CRM providers to their OAuth configurations
    const providerConfigs: Record<string, { connection: string }> = {
      "salesforce": {
        connection: "conn_salesforce"
      },
      "hubspot": {
        connection: "conn_hubspot"
      },
      "zoho": {
        connection: "conn_zoho"
      },
      "pipedrive": {
        connection: "conn_pipedrive"
      }
    };
    
    const config = providerConfigs[provider];
    console.log("Provider config lookup result:", config);
    console.log("Available providers:", Object.keys(providerConfigs));
    
    if (!config) {
      console.error(`ERROR: Unsupported provider: ${provider}`);
      return new Response(
        JSON.stringify({ 
          error: `Unsupported provider: ${provider}`, 
          debug: {
            requestedProvider: provider,
            availableProviders: Object.keys(providerConfigs)
          }
        }),
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
    console.log("OAuth URL params:", Object.fromEntries(authorizationUrl.searchParams.entries()));
    
    // Test WorkOS API connectivity
    console.log("Testing WorkOS API connectivity...");
    try {
      const testResponse = await fetch("https://api.workos.com/user_management/authenticate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${workosApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: workosClientId,
          code: "test",
          grant_type: "authorization_code",
        }),
      });
      
      console.log("WorkOS API test response status:", testResponse.status);
      const testData = await testResponse.text();
      console.log("WorkOS API test response (first 200 chars):", testData.substring(0, 200));
    } catch (testError) {
      console.error("WorkOS API test failed:", testError);
    }
    
    // Return the authorization URL
    const response = {
      success: true,
      url: authorizationUrl.toString(),
      state: state,
      provider: provider,
      debug: {
        redirectUri,
        connection: config.connection,
        workosClientIdPrefix: workosClientId.substring(0, 10)
      }
    };
    
    console.log("Returning successful response:", JSON.stringify(response, null, 2));
    
    return new Response(
      JSON.stringify(response),
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
