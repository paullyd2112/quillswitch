
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
const mockAccounts = [
  {
    id: "acc_123456",
    name: "Acme Inc.",
    industry: "Technology",
    website: "https://acme.example.com",
    annualRevenue: 1500000,
    employeeCount: 250,
    createdAt: "2022-03-10T14:20:00Z",
    updatedAt: "2023-05-12T09:15:00Z"
  },
  {
    id: "acc_789012",
    name: "Global Industries",
    industry: "Manufacturing",
    website: "https://globalind.example.com",
    annualRevenue: 5200000,
    employeeCount: 580,
    createdAt: "2021-11-05T10:45:00Z",
    updatedAt: "2023-04-18T16:30:00Z"
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

    // List accounts endpoint
    if (path === 'accounts' && req.method === 'GET') {
      // Get query params
      const source = url.searchParams.get('source') || 'salesforce';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      
      return new Response(
        JSON.stringify(baseResponse(true, mockAccounts, {
          page,
          limit,
          total: 87 // Mock total count
        })),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Migrate accounts endpoint
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
          totalRecords: 42,
          estimatedTimeMinutes: 3
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
