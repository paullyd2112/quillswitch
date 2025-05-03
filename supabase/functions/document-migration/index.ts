
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract token from the Bearer prefix
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the user's JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { operation, ...params } = await req.json();

    // Route to appropriate operation handler
    let result;
    switch (operation) {
      case 'init-document-extraction':
        result = await initDocumentExtraction(supabaseClient, user.id, params);
        break;
      case 'process-document-transfer':
        result = await processDocumentTransfer(supabaseClient, user.id, params);
        break;
      case 'get-document-status':
        result = await getDocumentStatus(supabaseClient, user.id, params);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function initDocumentExtraction(supabase, userId, params) {
  const { projectId, sourceSystem, recordType, recordId } = params;

  try {
    // Log initialization of document extraction
    console.log(`Initializing document extraction for ${sourceSystem}, record ${recordId}`);
    
    // Create entry in document_migration table
    const { data, error } = await supabase
      .from('document_migration')
      .insert({
        user_id: userId,
        project_id: projectId,
        source_system: sourceSystem,
        associated_record_type: recordType,
        associated_record_id: recordId,
        migration_status: 'initializing',
        original_file_name: `${recordType}_${recordId}_documents`,
      })
      .select();

    if (error) throw error;

    // Create activity record for this operation
    await supabase.from('user_activities').insert({
      project_id: projectId,
      user_id: userId,
      activity_type: 'document_migration_started',
      activity_description: `Started document extraction from ${sourceSystem} for ${recordType} ${recordId}`,
      activity_details: { recordType, recordId, migrationId: data[0].id }
    });

    return {
      success: true,
      message: 'Document extraction initialized',
      migrationId: data[0].id,
    };
  } catch (error) {
    console.error('Error in initDocumentExtraction:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

async function processDocumentTransfer(supabase, userId, params) {
  const { migrationId, documentInfo, destinationSystem } = params;

  try {
    // Get the migration record
    const { data: migration, error: migrationError } = await supabase
      .from('document_migration')
      .select('*')
      .eq('id', migrationId)
      .single();

    if (migrationError) throw migrationError;
    if (!migration) throw new Error('Migration record not found');

    // Update the document_migration record
    const { error } = await supabase
      .from('document_migration')
      .update({
        migration_status: 'processing',
        content_type: documentInfo.contentType,
        file_size: documentInfo.fileSize,
        source_document_id: documentInfo.sourceId,
        source_url: documentInfo.sourceUrl,
        destination_path: documentInfo.destinationPath,
        updated_at: new Date().toISOString(),
      })
      .eq('id', migrationId);

    if (error) throw error;

    // Update relationships if provided
    if (documentInfo.relationships && documentInfo.relationships.length > 0) {
      const relationships = documentInfo.relationships.map(rel => ({
        document_id: migrationId,
        related_record_type: rel.recordType,
        related_record_id: rel.recordId,
        relationship_type: rel.relationshipType || 'associated'
      }));

      const { error: relError } = await supabase
        .from('document_relationships')
        .insert(relationships);

      if (relError) throw relError;
    }

    return {
      success: true,
      message: 'Document transfer in progress',
      migrationId,
    };
  } catch (error) {
    console.error('Error in processDocumentTransfer:', error);
    
    // Update the record with error status
    await supabase
      .from('document_migration')
      .update({
        migration_status: 'error',
        error_message: error.message,
        updated_at: new Date().toISOString(),
      })
      .eq('id', migrationId);
      
    return {
      success: false,
      error: error.message,
    };
  }
}

async function getDocumentStatus(supabase, userId, params) {
  const { migrationId } = params;

  try {
    // Get the migration record and relationships
    const { data: migration, error: migrationError } = await supabase
      .from('document_migration')
      .select('*')
      .eq('id', migrationId)
      .single();

    if (migrationError) throw migrationError;
    
    const { data: relationships, error: relError } = await supabase
      .from('document_relationships')
      .select('*')
      .eq('document_id', migrationId);

    if (relError) throw relError;

    return {
      success: true,
      migration,
      relationships: relationships || [],
    };
  } catch (error) {
    console.error('Error in getDocumentStatus:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
