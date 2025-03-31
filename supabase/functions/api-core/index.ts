
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const baseResponse = (success: boolean, data: any, meta?: any, error?: any) => {
  if (success) {
    return { success, data, meta: meta || {} };
  }
  return { success, error };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Basic API information
    if (path === 'sources' && req.method === 'GET') {
      return new Response(
        JSON.stringify(baseResponse(true, [
          { id: 'salesforce', name: 'Salesforce' },
          { id: 'hubspot', name: 'HubSpot' },
          { id: 'zoho', name: 'Zoho CRM' },
          { id: 'dynamics', name: 'Microsoft Dynamics 365' },
          { id: 'pipedrive', name: 'Pipedrive' }
        ])),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === 'destinations' && req.method === 'GET') {
      return new Response(
        JSON.stringify(baseResponse(true, [
          { id: 'salesforce', name: 'Salesforce' },
          { id: 'hubspot', name: 'HubSpot' },
          { id: 'zoho', name: 'Zoho CRM' },
          { id: 'dynamics', name: 'Microsoft Dynamics 365' },
          { id: 'pipedrive', name: 'Pipedrive' }
        ])),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Authentication check - very simple for demo purposes
    // In a real implementation, this would validate JWT tokens
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify(baseResponse(false, null, null, {
          code: 'invalid_auth',
          message: 'Invalid authentication credentials',
        })),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return 404 for other paths
    return new Response(
      JSON.stringify(baseResponse(false, null, null, {
        code: 'not_found',
        message: 'Endpoint not found',
      })),
      { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify(baseResponse(false, null, null, {
        code: 'server_error',
        message: error.message,
      })),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
