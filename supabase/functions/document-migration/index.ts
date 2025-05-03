
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

// Define CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface for the request body
interface RequestBody {
  operation: string;
  projectId?: string;
  sourceSystem?: string;
  recordType?: string;
  recordId?: string;
  migrationId?: string;
  documentInfo?: any;
  destinationSystem?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authentication information from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing authorization header' 
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 401 
      });
    }

    // Get JWT token from header
    const token = authHeader.replace('Bearer ', '');

    // Verify the token and get user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid token or user not found' 
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 401 
      });
    }

    // Parse the request body
    const requestBody: RequestBody = await req.json();
    const { operation } = requestBody;

    // Handle different operations
    switch (operation) {
      case 'init-document-extraction': {
        const { projectId, sourceSystem, recordType, recordId } = requestBody;

        if (!projectId || !sourceSystem || !recordType || !recordId) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Missing required parameters' 
          }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 400 
          });
        }

        // Create a new document migration record
        const { data: migrationRecord, error: migrationError } = await supabase
          .from('document_migration')
          .insert({
            user_id: user.id,
            project_id: projectId,
            source_system: sourceSystem,
            associated_record_type: recordType,
            associated_record_id: recordId,
            original_file_name: 'pending-extraction',
            migration_status: 'initializing'
          })
          .select('id')
          .single();

        if (migrationError) {
          console.error('Error initializing document migration:', migrationError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to initialize document migration' 
          }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 500 
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          migrationId: migrationRecord.id 
        }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      case 'process-document-transfer': {
        const { migrationId, documentInfo, destinationSystem } = requestBody;

        if (!migrationId || !documentInfo || !destinationSystem) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Missing required parameters' 
          }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 400 
          });
        }

        // Update the document migration record with the file details
        const { error: updateError } = await supabase
          .from('document_migration')
          .update({
            original_file_name: documentInfo.fileName,
            content_type: documentInfo.contentType,
            file_size: documentInfo.fileSize,
            source_document_id: documentInfo.sourceId,
            source_url: documentInfo.sourceUrl || null,
            migration_status: 'transferring',
            updated_at: new Date().toISOString()
          })
          .eq('id', migrationId);

        if (updateError) {
          console.error('Error updating document record:', updateError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to update document information' 
          }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 500 
          });
        }

        // If the document has relationships, store them
        if (documentInfo.relationships && documentInfo.relationships.length > 0) {
          const relationshipsToInsert = documentInfo.relationships.map((relationship: any) => ({
            document_id: migrationId,
            related_record_type: relationship.recordType,
            related_record_id: relationship.recordId,
            relationship_type: relationship.relationshipType || 'attachment'
          }));

          const { error: relationshipError } = await supabase
            .from('document_relationships')
            .insert(relationshipsToInsert);

          if (relationshipError) {
            console.error('Error storing document relationships:', relationshipError);
            // Continue with the process, consider it a non-blocking error
          }
        }

        // Simulate CRM transfer (this would be implemented with API calls to the destination system)
        // In a real implementation, you would use the respective API client to upload the document

        // For now, we'll simulate success and update the record
        const { error: completionError } = await supabase
          .from('document_migration')
          .update({
            destination_document_id: `dest-${Date.now()}-${documentInfo.fileName.substring(0, 8)}`,
            migration_status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', migrationId);

        if (completionError) {
          console.error('Error completing document transfer:', completionError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to complete document transfer' 
          }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 500 
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Document transfer completed' 
        }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      case 'get-document-status': {
        const { migrationId } = requestBody;

        if (!migrationId) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Missing migration ID' 
          }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 400 
          });
        }

        // Get the document migration record
        const { data: migration, error: fetchError } = await supabase
          .from('document_migration')
          .select('*')
          .eq('id', migrationId)
          .single();

        if (fetchError) {
          console.error('Error fetching document status:', fetchError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to fetch document status' 
          }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 500 
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          status: migration.migration_status,
          document: migration
        }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      default:
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Unknown operation' 
        }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        });
    }
  } catch (error) {
    console.error('Unexpected error in document migration function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 500 
    });
  }
});
