
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

// Mock data for demo purposes
const mockOpportunities = [
  {
    id: "opp_123456",
    name: "Enterprise License Deal",
    accountId: "acc_123456",
    stage: "Negotiation",
    amount: 75000,
    probability: 80,
    expectedCloseDate: "2023-08-30",
    createdAt: "2023-04-15T11:20:00Z",
    updatedAt: "2023-06-22T13:45:00Z"
  },
  {
    id: "opp_789012",
    name: "Software Implementation",
    accountId: "acc_789012",
    stage: "Proposal",
    amount: 120000,
    probability: 60,
    expectedCloseDate: "2023-09-15",
    createdAt: "2023-05-10T09:30:00Z",
    updatedAt: "2023-06-18T14:15:00Z"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    // Authentication check
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

    // List opportunities endpoint
    if (path === 'opportunities' && req.method === 'GET') {
      // Get query params
      const source = url.searchParams.get('source') || 'salesforce';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      
      return new Response(
        JSON.stringify(baseResponse(true, mockOpportunities, {
          page,
          limit,
          total: 58 // Mock total count
        })),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Migrate opportunities endpoint
    if (path === 'migrate' && req.method === 'POST') {
      const body = await req.json();
      
      // Validate required fields
      if (!body.source || !body.destination || !body.fieldMapping) {
        return new Response(
          JSON.stringify(baseResponse(false, null, null, {
            code: 'invalid_request',
            message: 'Missing required fields: source, destination, and fieldMapping are required',
          })),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Create migration job entry in database and return status
      return new Response(
        JSON.stringify(baseResponse(true, {
          migrationId: `mig_${Math.floor(Math.random() * 1000000)}`,
          status: "in_progress",
          totalRecords: 35,
          estimatedTimeMinutes: 4
        })),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
