import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    if (!unifiedApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "UNIFIED_API_KEY not found in environment" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    // Test basic API connection by fetching integrations
    const response = await fetch('https://api.unified.to/unified/integrations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${unifiedApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Unified.to API error: ${response.status} ${errorText}`,
          status: response.status
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Unified.to API connection successful!",
        availableIntegrations: data?.length || 0,
        sampleIntegrations: data?.slice(0, 3)?.map((integration: any) => ({
          name: integration.name,
          category: integration.category,
          type: integration.type
        })) || []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error testing Unified.to connection:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});