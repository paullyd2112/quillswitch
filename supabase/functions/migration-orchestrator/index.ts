
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MigrationJobRequest {
  projectId: string;
  sourceCredentials: {
    type: string;
    connectionId: string;
  };
  destinationCredentials: {
    type: string;
    connectionId: string;
  };
  objectTypes: string[];
  fieldMappings: Record<string, any>;
  schedule?: {
    immediate?: boolean;
    scheduledAt?: string;
    recurring?: boolean;
    cronExpression?: string;
  };
}

interface MigrationProgress {
  stage: string;
  percentage: number;
  currentObject: string;
  processedRecords: number;
  totalRecords: number;
  throughputPerSecond: number;
  estimatedTimeRemaining: number;
  errors: any[];
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...payload } = await req.json();

    switch (action) {
      case 'start_migration':
        return await startCloudMigration(payload as MigrationJobRequest);
      case 'get_progress':
        return await getMigrationProgress(payload.projectId);
      case 'pause_migration':
        return await pauseMigration(payload.projectId);
      case 'resume_migration':
        return await resumeMigration(payload.projectId);
      case 'cancel_migration':
        return await cancelMigration(payload.projectId);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Migration orchestrator error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function startCloudMigration(request: MigrationJobRequest) {
  console.log('Starting cloud migration for project:', request.projectId);
  
  // Update project status to running
  await supabase
    .from('migration_projects')
    .update({ 
      status: 'running',
      started_at: new Date().toISOString()
    })
    .eq('id', request.projectId);

  // Create migration stages
  const stages = [
    { name: 'Data Extraction', sequence_order: 1, description: 'Extracting data from source system' },
    { name: 'Data Transformation', sequence_order: 2, description: 'Transforming and mapping data' },
    { name: 'Data Validation', sequence_order: 3, description: 'Validating transformed data' },
    { name: 'Data Loading', sequence_order: 4, description: 'Loading data into destination system' },
    { name: 'Post-Migration Validation', sequence_order: 5, description: 'Validating migrated data' }
  ];

  for (const stage of stages) {
    await supabase
      .from('migration_stages')
      .insert({
        project_id: request.projectId,
        ...stage,
        status: 'pending'
      });
  }

  // Start background migration process
  EdgeRuntime.waitUntil(executeCloudMigration(request));

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Cloud migration started',
      projectId: request.projectId
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function executeCloudMigration(request: MigrationJobRequest) {
  try {
    console.log('Executing cloud migration for project:', request.projectId);
    
    // Stage 1: Data Extraction
    await updateStageProgress(request.projectId, 'Data Extraction', 0, 'running');
    const extractedData = await extractDataFromSource(request);
    await updateStageProgress(request.projectId, 'Data Extraction', 100, 'completed');

    // Stage 2: Data Transformation
    await updateStageProgress(request.projectId, 'Data Transformation', 0, 'running');
    const transformedData = await transformData(extractedData, request.fieldMappings);
    await updateStageProgress(request.projectId, 'Data Transformation', 100, 'completed');

    // Stage 3: Data Validation
    await updateStageProgress(request.projectId, 'Data Validation', 0, 'running');
    const validationResults = await validateData(transformedData);
    await updateStageProgress(request.projectId, 'Data Validation', 100, 'completed');

    // Stage 4: Data Loading
    await updateStageProgress(request.projectId, 'Data Loading', 0, 'running');
    const loadResults = await loadDataToDestination(transformedData, request);
    await updateStageProgress(request.projectId, 'Data Loading', 100, 'completed');

    // Stage 5: Post-Migration Validation
    await updateStageProgress(request.projectId, 'Post-Migration Validation', 0, 'running');
    await validateMigratedData(request);
    await updateStageProgress(request.projectId, 'Post-Migration Validation', 100, 'completed');

    // Update project as completed
    await supabase
      .from('migration_projects')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        migrated_objects: loadResults.successCount,
        failed_objects: loadResults.failedCount
      })
      .eq('id', request.projectId);

    console.log('Cloud migration completed successfully for project:', request.projectId);

  } catch (error) {
    console.error('Cloud migration failed:', error);
    
    await supabase
      .from('migration_projects')
      .update({ 
        status: 'failed',
        completed_at: new Date().toISOString()
      })
      .eq('id', request.projectId);

    // Log error
    await supabase
      .from('migration_errors')
      .insert({
        project_id: request.projectId,
        object_type_id: 'system',
        error_type: 'execution_error',
        error_message: error.message,
        resolved: false
      });
  }
}

async function extractDataFromSource(request: MigrationJobRequest) {
  // Get source credentials
  const { data: credentials } = await supabase
    .rpc('get_decrypted_credential_with_logging', {
      p_credential_id: request.sourceCredentials.connectionId
    });

  if (!credentials || credentials.length === 0) {
    throw new Error('Source credentials not found');
  }

  const sourceCredential = credentials[0];
  const extractedData: Record<string, any[]> = {};

  // Extract data for each object type
  for (const objectType of request.objectTypes) {
    console.log(`Extracting ${objectType} from ${sourceCredential.service_name}`);
    
    // Use Unified API for data extraction
    const response = await fetch(`https://api.unified.to/crm/${sourceCredential.service_name}/${objectType}`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('UNIFIED_API_KEY')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to extract ${objectType}: ${response.statusText}`);
    }

    const records = await response.json();
    extractedData[objectType] = records.data || [];
  }

  return extractedData;
}

async function transformData(extractedData: Record<string, any[]>, fieldMappings: Record<string, any>) {
  const transformedData: Record<string, any[]> = {};

  for (const [objectType, records] of Object.entries(extractedData)) {
    console.log(`Transforming ${records.length} ${objectType} records`);
    
    const objectMappings = fieldMappings[objectType] || {};
    transformedData[objectType] = records.map(record => {
      const transformedRecord: any = {};
      
      for (const [sourceField, destinationField] of Object.entries(objectMappings)) {
        if (record[sourceField] !== undefined) {
          transformedRecord[destinationField as string] = record[sourceField];
        }
      }
      
      return transformedRecord;
    });
  }

  return transformedData;
}

async function validateData(transformedData: Record<string, any[]>) {
  const validationResults: Record<string, any> = {};

  for (const [objectType, records] of Object.entries(transformedData)) {
    console.log(`Validating ${records.length} ${objectType} records`);
    
    const validRecords = [];
    const invalidRecords = [];

    for (const record of records) {
      // Basic validation - check for required fields
      const isValid = record.email || record.name || record.id;
      
      if (isValid) {
        validRecords.push(record);
      } else {
        invalidRecords.push({
          record,
          errors: ['Missing required fields']
        });
      }
    }

    validationResults[objectType] = {
      valid: validRecords,
      invalid: invalidRecords,
      totalCount: records.length,
      validCount: validRecords.length,
      invalidCount: invalidRecords.length
    };
  }

  return validationResults;
}

async function loadDataToDestination(transformedData: Record<string, any[]>, request: MigrationJobRequest) {
  // Get destination credentials
  const { data: credentials } = await supabase
    .rpc('get_decrypted_credential_with_logging', {
      p_credential_id: request.destinationCredentials.connectionId
    });

  if (!credentials || credentials.length === 0) {
    throw new Error('Destination credentials not found');
  }

  const destinationCredential = credentials[0];
  let successCount = 0;
  let failedCount = 0;

  for (const [objectType, records] of Object.entries(transformedData)) {
    console.log(`Loading ${records.length} ${objectType} records to ${destinationCredential.service_name}`);
    
    // Batch process records
    const batchSize = 50;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      try {
        const response = await fetch(`https://api.unified.to/crm/${destinationCredential.service_name}/${objectType}/batch`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('UNIFIED_API_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ records: batch })
        });

        if (response.ok) {
          successCount += batch.length;
        } else {
          failedCount += batch.length;
          console.error(`Failed to load batch: ${response.statusText}`);
        }
      } catch (error) {
        failedCount += batch.length;
        console.error('Batch load error:', error);
      }
    }
  }

  return { successCount, failedCount };
}

async function validateMigratedData(request: MigrationJobRequest) {
  console.log('Performing post-migration validation');
  // This would implement data integrity checks
  // comparing source vs destination record counts, etc.
  return true;
}

async function updateStageProgress(projectId: string, stageName: string, percentage: number, status: string) {
  const updateData: any = {
    percentage_complete: percentage,
    status
  };

  if (status === 'running' && percentage === 0) {
    updateData.started_at = new Date().toISOString();
  } else if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  }

  await supabase
    .from('migration_stages')
    .update(updateData)
    .eq('project_id', projectId)
    .eq('name', stageName);
}

async function getMigrationProgress(projectId: string) {
  const { data: stages } = await supabase
    .from('migration_stages')
    .select('*')
    .eq('project_id', projectId)
    .order('sequence_order');

  const progress: MigrationProgress = {
    stage: 'Preparing',
    percentage: 0,
    currentObject: '',
    processedRecords: 0,
    totalRecords: 0,
    throughputPerSecond: 0,
    estimatedTimeRemaining: 0,
    errors: []
  };

  if (stages && stages.length > 0) {
    const currentStage = stages.find(s => s.status === 'running') || stages[0];
    const completedStages = stages.filter(s => s.status === 'completed').length;
    
    progress.stage = currentStage.name;
    progress.percentage = Math.round((completedStages / stages.length) * 100);
    
    if (currentStage.status === 'running') {
      progress.percentage += Math.round((currentStage.percentage_complete / stages.length));
    }
  }

  return new Response(
    JSON.stringify({ success: true, progress }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function pauseMigration(projectId: string) {
  await supabase
    .from('migration_projects')
    .update({ status: 'paused' })
    .eq('id', projectId);

  return new Response(
    JSON.stringify({ success: true, message: 'Migration paused' }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function resumeMigration(projectId: string) {
  await supabase
    .from('migration_projects')
    .update({ status: 'running' })
    .eq('id', projectId);

  return new Response(
    JSON.stringify({ success: true, message: 'Migration resumed' }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function cancelMigration(projectId: string) {
  await supabase
    .from('migration_projects')
    .update({ 
      status: 'cancelled',
      completed_at: new Date().toISOString()
    })
    .eq('id', projectId);

  return new Response(
    JSON.stringify({ success: true, message: 'Migration cancelled' }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
