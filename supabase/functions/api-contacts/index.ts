
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
const mockContacts = [
  {
    id: "con_123456",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    company: "Acme Inc.",
    title: "CEO",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-06-22T15:45:00Z"
  },
  {
    id: "con_789012",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+0987654321",
    company: "Tech Solutions",
    title: "CTO",
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2023-05-18T14:20:00Z"
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

    // List contacts endpoint
    if (path === 'contacts' && req.method === 'GET') {
      // Get query params
      const source = url.searchParams.get('source') || 'salesforce';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      
      return new Response(
        JSON.stringify(baseResponse(true, mockContacts, {
          page,
          limit,
          total: 142 // Mock total count
        })),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Migrate contacts endpoint
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
          totalRecords: 215,
          estimatedTimeMinutes: 5
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
