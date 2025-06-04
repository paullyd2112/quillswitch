import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    // TODO: Replace with your chosen Unified API service
    // This function will need to be updated once you select your unified API provider
    
    return new Response(
      JSON.stringify({ 
        error: "OAuth service not yet configured", 
        message: "Please configure your unified API service for OAuth authentication",
        provider: provider
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 501 }
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
