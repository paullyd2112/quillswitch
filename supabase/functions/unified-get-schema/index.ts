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

    const { connection_id, object_type } = await req.json();
    
    if (!connection_id || !object_type) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required parameters: connection_id, object_type" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    console.log(`Getting schema for ${object_type} from connection ${connection_id}`);

    try {
      // Get schema information from Unified.to API
      const unifiedResponse = await fetch(`https://api.unified.to/unified/connection/${connection_id}/schema/${object_type}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${unifiedApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!unifiedResponse.ok) {
        console.log('Schema endpoint not available, falling back to sample data');
        
        // If schema endpoint isn't available, return sample fields based on object type
        const sampleFields = getSampleFieldsForObjectType(object_type);
        
        return new Response(
          JSON.stringify({
            success: true,
            fields: sampleFields,
            source: 'sample'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const schemaData = await unifiedResponse.json();
      console.log('Schema retrieved successfully');

      // Extract field names from schema
      const fields = extractFieldsFromSchema(schemaData, object_type);

      return new Response(
        JSON.stringify({
          success: true,
          fields: fields,
          source: 'api',
          raw_schema: schemaData
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (error) {
      console.error('Error fetching schema from API:', error);
      
      // Fallback to sample fields
      const sampleFields = getSampleFieldsForObjectType(object_type);
      
      return new Response(
        JSON.stringify({
          success: true,
          fields: sampleFields,
          source: 'fallback',
          warning: 'Could not fetch schema from API, using sample fields'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Schema retrieval error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred during schema retrieval" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

function getSampleFieldsForObjectType(objectType: string): string[] {
  const fieldMap: Record<string, string[]> = {
    contact: ['id', 'first_name', 'last_name', 'email', 'phone', 'company', 'title', 'created_at', 'updated_at'],
    contacts: ['id', 'first_name', 'last_name', 'email', 'phone', 'company', 'title', 'created_at', 'updated_at'],
    account: ['id', 'name', 'domain', 'industry', 'size', 'phone', 'address', 'created_at', 'updated_at'],
    accounts: ['id', 'name', 'domain', 'industry', 'size', 'phone', 'address', 'created_at', 'updated_at'],
    company: ['id', 'name', 'domain', 'industry', 'size', 'phone', 'address', 'created_at', 'updated_at'],
    companies: ['id', 'name', 'domain', 'industry', 'size', 'phone', 'address', 'created_at', 'updated_at'],
    deal: ['id', 'name', 'amount', 'stage', 'probability', 'close_date', 'contact_id', 'company_id', 'created_at', 'updated_at'],
    deals: ['id', 'name', 'amount', 'stage', 'probability', 'close_date', 'contact_id', 'company_id', 'created_at', 'updated_at'],
    opportunity: ['id', 'name', 'amount', 'stage', 'probability', 'close_date', 'account_id', 'contact_id', 'created_at', 'updated_at'],
    opportunities: ['id', 'name', 'amount', 'stage', 'probability', 'close_date', 'account_id', 'contact_id', 'created_at', 'updated_at'],
    lead: ['id', 'first_name', 'last_name', 'email', 'phone', 'company', 'source', 'status', 'created_at', 'updated_at'],
    leads: ['id', 'first_name', 'last_name', 'email', 'phone', 'company', 'source', 'status', 'created_at', 'updated_at']
  };
  
  return fieldMap[objectType.toLowerCase()] || ['id', 'name', 'created_at', 'updated_at'];
}

function extractFieldsFromSchema(schemaData: any, objectType: string): string[] {
  try {
    // Different CRM APIs may return schema in different formats
    // Handle various possible schema structures
    
    if (schemaData.properties) {
      // OpenAPI-style schema
      return Object.keys(schemaData.properties);
    }
    
    if (schemaData.fields && Array.isArray(schemaData.fields)) {
      // Array of field objects
      return schemaData.fields.map((field: any) => 
        field.name || field.key || field.field_name || field.id
      ).filter(Boolean);
    }
    
    if (schemaData.schema && schemaData.schema.properties) {
      // Nested schema structure
      return Object.keys(schemaData.schema.properties);
    }
    
    if (Array.isArray(schemaData)) {
      // Array of field names or field objects
      return schemaData.map((item: any) => 
        typeof item === 'string' ? item : (item.name || item.key || item.field_name)
      ).filter(Boolean);
    }
    
    // If we can't parse the schema, return sample fields
    console.warn('Could not parse schema structure, using sample fields');
    return getSampleFieldsForObjectType(objectType);
    
  } catch (error) {
    console.error('Error extracting fields from schema:', error);
    return getSampleFieldsForObjectType(objectType);
  }
}