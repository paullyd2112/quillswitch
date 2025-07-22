import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { connection_id, object_type } = await req.json();

    // Get connection details
    const { data: credentials } = await supabase
      .rpc('get_decrypted_credential_with_logging', {
        p_credential_id: connection_id
      });

    if (!credentials || credentials.length === 0) {
      throw new Error('Connection not found');
    }

    const connectionDetails = credentials[0];

    // Get native engine credentials
    const nativeEngineUrl = Deno.env.get('NATIVE_CRM_ENGINE_URL');
    const nativeEngineKey = Deno.env.get('NATIVE_CRM_ENGINE_KEY');

    if (!nativeEngineUrl || !nativeEngineKey) {
      throw new Error('Native CRM Engine credentials not configured');
    }

    // Get schema from native CRM engine
    const response = await fetch(`${nativeEngineUrl}/schema/${connectionDetails.service_name}/${object_type}`, {
      headers: {
        'Authorization': `Bearer ${nativeEngineKey}`,
        'Content-Type': 'application/json',
        'X-Connection-ID': connection_id
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get schema: ${response.statusText}`);
    }

    const schemaData = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        fields: schemaData.fields || [],
        schema: schemaData.schema || {}
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Schema fetch error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});