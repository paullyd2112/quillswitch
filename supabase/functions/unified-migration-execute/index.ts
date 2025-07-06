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

    const { project_id, destination_connection_id, object_type, batch_size = 50 } = await req.json();
    
    if (!project_id || !destination_connection_id || !object_type) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required parameters: project_id, destination_connection_id, object_type" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    console.log(`Starting migration execution for project ${project_id}, object type: ${object_type}`);

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

    // Get field mappings for this object type
    const { data: fieldMappings, error: mappingError } = await supabase
      .from('field_mappings')
      .select('*')
      .eq('project_id', project_id)
      .eq('object_type_id', object_type);

    if (mappingError) {
      console.error('Error fetching field mappings:', mappingError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Failed to fetch field mappings" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    // Get extracted records to migrate
    const { data: records, error: recordsError } = await supabase
      .from('migration_records')
      .select('*')
      .eq('project_id', project_id)
      .eq('user_id', user.id)
      .eq('object_type', object_type)
      .eq('status', 'extracted')
      .limit(batch_size);

    if (recordsError) {
      console.error('Error fetching records:', recordsError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Failed to fetch records to migrate" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    if (!records || records.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "No records found to migrate",
          migrated_count: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Found ${records.length} records to migrate`);

    // Update project status to migrating
    await supabase
      .from('migration_projects')
      .update({ status: 'migrating' })
      .eq('id', project_id)
      .eq('user_id', user.id);

    const migrationResults = [];
    let successCount = 0;
    let errorCount = 0;

    // Process records in batches
    for (const record of records) {
      try {
        console.log(`Migrating record ${record.external_id}`);

        // Transform record data based on field mappings
        const transformedData = transformRecord(record.data, fieldMappings);
        
        // Push data to destination CRM via Unified.to
        const unifiedResponse = await fetch(`https://api.unified.to/crm/${destination_connection_id}/${object_type}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${unifiedApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transformedData)
        });

        if (!unifiedResponse.ok) {
          const errorText = await unifiedResponse.text();
          console.error(`Failed to migrate record ${record.external_id}:`, errorText);
          
          // Update record status to failed
          await supabase
            .from('migration_records')
            .update({ 
              status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('id', record.id);

          // Log error
          await supabase
            .from('migration_errors')
            .insert({
              project_id: project_id,
              object_type_id: object_type,
              record_id: record.external_id,
              error_type: 'migration_failed',
              error_message: errorText,
              error_details: { record_data: record.data, transformed_data: transformedData }
            });

          errorCount++;
          migrationResults.push({
            record_id: record.external_id,
            status: 'failed',
            error: errorText
          });
          continue;
        }

        const migratedRecord = await unifiedResponse.json();
        console.log(`Successfully migrated record ${record.external_id}`);

        // Update record status to migrated
        await supabase
          .from('migration_records')
          .update({ 
            status: 'migrated',
            destination_system: 'unified',
            updated_at: new Date().toISOString()
          })
          .eq('id', record.id);

        successCount++;
        migrationResults.push({
          record_id: record.external_id,
          destination_id: migratedRecord.id,
          status: 'success'
        });

      } catch (error) {
        console.error(`Error migrating record ${record.external_id}:`, error);
        
        // Update record status to failed
        await supabase
          .from('migration_records')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', record.id);

        // Log error
        await supabase
          .from('migration_errors')
          .insert({
            project_id: project_id,
            object_type_id: object_type,
            record_id: record.external_id,
            error_type: 'migration_error',
            error_message: error.message,
            error_details: { record_data: record.data }
          });

        errorCount++;
        migrationResults.push({
          record_id: record.external_id,
          status: 'failed',
          error: error.message
        });
      }
    }

    // Update object type progress
    await supabase
      .from('migration_object_types')
      .update({
        processed_records: successCount,
        failed_records: errorCount,
        status: errorCount === 0 ? 'completed' : 'partial'
      })
      .eq('project_id', project_id)
      .eq('name', object_type);

    // Update project progress
    const { data: allObjectTypes } = await supabase
      .from('migration_object_types')
      .select('*')
      .eq('project_id', project_id);

    const totalProcessed = allObjectTypes?.reduce((sum, obj) => sum + (obj.processed_records || 0), 0) || 0;
    const totalFailed = allObjectTypes?.reduce((sum, obj) => sum + (obj.failed_records || 0), 0) || 0;
    const allCompleted = allObjectTypes?.every(obj => obj.status === 'completed') || false;

    await supabase
      .from('migration_projects')
      .update({ 
        migrated_objects: totalProcessed,
        failed_objects: totalFailed,
        status: allCompleted ? 'completed' : 'migrating',
        updated_at: new Date().toISOString(),
        completed_at: allCompleted ? new Date().toISOString() : null
      })
      .eq('id', project_id)
      .eq('user_id', user.id);

    // Log activity
    await supabase
      .from('user_activities')
      .insert({
        project_id: project_id,
        user_id: user.id,
        activity_type: 'migration_execution',
        activity_description: `Migrated ${successCount} ${object_type} records (${errorCount} failed)`,
        activity_details: { 
          object_type,
          success_count: successCount,
          error_count: errorCount,
          results: migrationResults
        }
      });

    console.log(`Migration completed: ${successCount} success, ${errorCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        migrated_count: successCount,
        failed_count: errorCount,
        results: migrationResults,
        has_more: records.length === batch_size
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Migration execution error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred during migration execution" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

// Transform record data based on field mappings
function transformRecord(sourceData: any, fieldMappings: any[]): any {
  const transformedData: any = {};
  
  for (const mapping of fieldMappings) {
    const sourceValue = sourceData[mapping.source_field];
    
    if (sourceValue !== undefined && sourceValue !== null) {
      let transformedValue = sourceValue;
      
      // Apply transformation rule if specified
      if (mapping.transformation_rule) {
        try {
          // Simple transformations - can be extended with more complex logic
          switch (mapping.transformation_rule) {
            case 'uppercase':
              transformedValue = String(sourceValue).toUpperCase();
              break;
            case 'lowercase':
              transformedValue = String(sourceValue).toLowerCase();
              break;
            case 'trim':
              transformedValue = String(sourceValue).trim();
              break;
            case 'date_format':
              transformedValue = new Date(sourceValue).toISOString();
              break;
            default:
              // Keep original value if transformation not recognized
              transformedValue = sourceValue;
          }
        } catch (error) {
          console.warn(`Failed to apply transformation ${mapping.transformation_rule} to field ${mapping.source_field}:`, error);
          transformedValue = sourceValue;
        }
      }
      
      transformedData[mapping.destination_field] = transformedValue;
    }
  }
  
  return transformedData;
}
