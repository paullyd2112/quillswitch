import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!unifiedApiKey || !supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required environment variables" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    const { project_id, connection_id, object_types } = await req.json();
    
    if (!project_id || !connection_id || !object_types) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required parameters: project_id, connection_id, object_types" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    console.log(`Starting data extraction for project ${project_id}`);

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing authorization header" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Failed to authenticate user" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }

    // Update project status to extracting
    await supabase
      .from('migration_projects')
      .update({ status: 'extracting' })
      .eq('id', project_id)
      .eq('user_id', user.id);

    const extractionResults = [];

    // Extract data for each object type
    for (const objectType of object_types) {
      console.log(`Extracting ${objectType} data...`);
      
      try {
        // Get data from Unified.to API
        const unifiedResponse = await fetch(`https://api.unified.to/crm/${connection_id}/${objectType}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${unifiedApiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!unifiedResponse.ok) {
          const errorText = await unifiedResponse.text();
          console.error(`Failed to extract ${objectType}:`, errorText);
          continue;
        }

        const crmData = await unifiedResponse.json();
        console.log(`Extracted ${crmData.length} ${objectType} records`);

        // Store extracted data in migration_records
        const recordsToInsert = crmData.map((record: any) => ({
          project_id: project_id,
          user_id: user.id,
          object_type: objectType,
          external_id: record.id || record.external_id,
          source_system: 'unified',
          data: record,
          status: 'extracted'
        }));

        const { error: insertError } = await supabase
          .from('migration_records')
          .insert(recordsToInsert);

        if (insertError) {
          console.error(`Error storing ${objectType} records:`, insertError);
          continue;
        }

        // Update object type status
        await supabase
          .from('migration_object_types')
          .upsert({
            project_id: project_id,
            name: objectType,
            total_records: crmData.length,
            processed_records: crmData.length,
            status: 'extracted'
          });

        extractionResults.push({
          object_type: objectType,
          records_extracted: crmData.length,
          status: 'success'
        });

      } catch (error) {
        console.error(`Error extracting ${objectType}:`, error);
        extractionResults.push({
          object_type: objectType,
          records_extracted: 0,
          status: 'error',
          error: error.message
        });
      }
    }

    // Update project status
    const allSuccessful = extractionResults.every(result => result.status === 'success');
    await supabase
      .from('migration_projects')
      .update({ 
        status: allSuccessful ? 'extracted' : 'extraction_partial',
        updated_at: new Date().toISOString()
      })
      .eq('id', project_id)
      .eq('user_id', user.id);

    // Log activity
    await supabase
      .from('user_activities')
      .insert({
        project_id: project_id,
        user_id: user.id,
        activity_type: 'data_extraction',
        activity_description: `Data extraction completed for ${object_types.join(', ')}`,
        activity_details: { extraction_results: extractionResults }
      });

    console.log('Data extraction completed:', extractionResults);

    return new Response(
      JSON.stringify({
        success: true,
        extraction_results: extractionResults,
        total_records: extractionResults.reduce((sum, result) => sum + result.records_extracted, 0)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Data extraction error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred during data extraction" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});