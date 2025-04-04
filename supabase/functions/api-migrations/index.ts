
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock migration data storage
const migrations = new Map();

// Storage for large transfer state to allow for resumption
const transferStateMap = new Map();

const baseResponse = (success: boolean, data: any, meta?: any, error?: any) => {
  if (success) {
    return { success, data, meta: meta || {} };
  }
  return { success, error };
};

// Helper function to process data in chunks
const processChunked = async (data: any[], chunkSize: number, processFn: (chunk: any[]) => Promise<any>) => {
  const results = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const result = await processFn(chunk);
    results.push(result);
    
    // Add small delay to prevent overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return results;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const path = pathParts.pop() || "";
    
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

    // Create new migration
    if (path === 'migrations' && req.method === 'POST') {
      const body = await req.json();
      
      // Validate required fields
      if (!body.name || !body.source || !body.destination || !body.dataTypes) {
        return new Response(
          JSON.stringify(baseResponse(false, null, null, {
            code: 'invalid_request',
            message: 'Missing required fields',
          })),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const migrationId = `mig_${Math.floor(Math.random() * 1000000)}`;
      const migrationData = {
        migrationId,
        name: body.name,
        status: "scheduled",
        createdAt: new Date().toISOString(),
        estimatedCompletionTime: new Date(Date.now() + 45 * 60000).toISOString(), // 45 minutes later
        source: body.source,
        destination: body.destination,
        dataTypes: body.dataTypes,
        progress: {
          overall: {
            total: 0,
            migrated: 0,
            failed: 0,
            percentage: 0
          }
        },
        // New transfer configuration
        transferConfig: body.transferConfig || {
          batchSize: 100,
          concurrentBatches: 3,
          retryAttempts: 3,
          retryDelay: 2000
        }
      };
      
      // Initialize transfer state for possible resumption
      transferStateMap.set(migrationId, {
        startTime: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        processedIds: new Set(),
        failedIds: new Set(),
        currentBatchIndices: {}
      });
      
      // Store migration info
      migrations.set(migrationId, migrationData);
      
      // Start "simulated" processing
      setTimeout(() => {
        const migration = migrations.get(migrationId);
        if (migration) {
          migration.status = "in_progress";
          migration.startTime = new Date().toISOString();
          
          // Calculate totals
          let totalRecords = 0;
          for (const dataType of body.dataTypes) {
            let typeTotal = 0;
            if (dataType.type === 'contacts') typeTotal = 1250;
            if (dataType.type === 'accounts') typeTotal = 87;
            if (dataType.type === 'opportunities') typeTotal = 138;
            if (dataType.type === 'activities') typeTotal = 625;
            if (dataType.type === 'cases') typeTotal = 93;
            if (dataType.type === 'custom_objects') typeTotal = 45;
            
            migration.progress[dataType.type] = {
              total: typeTotal,
              migrated: 0,
              failed: 0,
              percentage: 0,
              // Add batch tracking information
              currentBatch: 0,
              totalBatches: Math.ceil(typeTotal / (migration.transferConfig?.batchSize || 100)),
              lastProcessedId: null,
              pausedAt: null
            };
            
            totalRecords += typeTotal;
          }
          
          migration.progress.overall.total = totalRecords;
          migrations.set(migrationId, migration);
        }
      }, 5000);

      return new Response(
        JSON.stringify(baseResponse(true, {
          migrationId,
          name: body.name,
          status: "scheduled",
          createdAt: migrationData.createdAt,
          estimatedCompletionTime: migrationData.estimatedCompletionTime
        })),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Resume migration
    if (path === 'resume' && req.method === 'POST') {
      const body = await req.json();
      
      if (!body.migrationId) {
        return new Response(
          JSON.stringify(baseResponse(false, null, null, {
            code: 'invalid_request',
            message: 'Missing migrationId',
          })),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      const migrationId = body.migrationId;
      const migration = migrations.get(migrationId);
      
      if (!migration) {
        return new Response(
          JSON.stringify(baseResponse(false, null, null, {
            code: 'not_found',
            message: 'Migration not found',
          })),
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // Update migration status
      if (migration.status === 'paused') {
        migration.status = 'in_progress';
        migration.resumedAt = new Date().toISOString();
        
        // Reset pause flags on data types
        for (const type in migration.progress) {
          if (type !== 'overall' && migration.progress[type]) {
            migration.progress[type].pausedAt = null;
          }
        }
        
        migrations.set(migrationId, migration);
      }
      
      return new Response(
        JSON.stringify(baseResponse(true, {
          migrationId,
          status: migration.status,
          message: 'Migration resumed successfully'
        })),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Pause migration
    if (path === 'pause' && req.method === 'POST') {
      const body = await req.json();
      
      if (!body.migrationId) {
        return new Response(
          JSON.stringify(baseResponse(false, null, null, {
            code: 'invalid_request',
            message: 'Missing migrationId',
          })),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      const migrationId = body.migrationId;
      const migration = migrations.get(migrationId);
      
      if (!migration) {
        return new Response(
          JSON.stringify(baseResponse(false, null, null, {
            code: 'not_found',
            message: 'Migration not found',
          })),
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // Update migration status
      if (migration.status === 'in_progress') {
        migration.status = 'paused';
        migration.pausedAt = new Date().toISOString();
        
        // Mark all data types as paused
        for (const type in migration.progress) {
          if (type !== 'overall' && migration.progress[type]) {
            migration.progress[type].pausedAt = new Date().toISOString();
          }
        }
        
        migrations.set(migrationId, migration);
      }
      
      return new Response(
        JSON.stringify(baseResponse(true, {
          migrationId,
          status: migration.status,
          message: 'Migration paused successfully'
        })),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get migration status
    if (pathParts[pathParts.length - 1] === 'migrations' && path.startsWith('mig_') && req.method === 'GET') {
      const migrationId = path;
      const migration = migrations.get(migrationId);
      
      if (!migration) {
        return new Response(
          JSON.stringify(baseResponse(false, null, null, {
            code: 'not_found',
            message: 'Migration not found',
          })),
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // Simulate progress if in progress and not paused
      if (migration.status === 'in_progress') {
        const elapsedMinutes = (Date.now() - new Date(migration.startTime).getTime()) / 60000;
        
        // Update progress based on elapsed time but at a more realistic pace
        const progressPct = Math.min(100, elapsedMinutes * 5); // 5% per minute
        
        // Update each data type's progress
        for (const type in migration.progress) {
          if (type !== 'overall' && migration.progress[type]) {
            const total = migration.progress[type].total;
            
            // Calculate migrated with slight randomness for realism
            const rawMigrated = Math.floor(total * (progressPct / 100));
            const variance = Math.floor(rawMigrated * 0.05 * Math.random()); // up to 5% variance
            const migrated = Math.min(total, rawMigrated + (Math.random() > 0.5 ? variance : -variance));
            
            // Calculate failures - more realistic failure rate
            const failureRate = 0.01 + Math.random() * 0.02; // 1-3% failure rate  
            const failed = Math.floor(total * failureRate);
            
            migration.progress[type].migrated = migrated;
            migration.progress[type].failed = failed;
            migration.progress[type].percentage = Math.min(100, Math.floor((migrated / total) * 100));
            
            // Update batch information
            const batchSize = migration.transferConfig?.batchSize || 100;
            migration.progress[type].currentBatch = Math.ceil(migrated / batchSize);
            migration.progress[type].totalBatches = Math.ceil(total / batchSize);
            
            // Add timestamp for last update
            migration.progress[type].lastUpdated = new Date().toISOString();
          }
        }
        
        // Update overall progress
        const overallTotal = migration.progress.overall.total;
        let overallMigrated = 0;
        let overallFailed = 0;
        
        for (const type in migration.progress) {
          if (type !== 'overall' && migration.progress[type]) {
            overallMigrated += migration.progress[type].migrated;
            overallFailed += migration.progress[type].failed;
          }
        }
        
        migration.progress.overall.migrated = overallMigrated;
        migration.progress.overall.failed = overallFailed;
        migration.progress.overall.percentage = Math.min(100, Math.floor((overallMigrated / overallTotal) * 100));
        
        // Add estimated completion time based on current rate
        if (overallMigrated > 0) {
          const elapsedMs = Date.now() - new Date(migration.startTime).getTime();
          const recordsPerMs = overallMigrated / elapsedMs;
          const remainingRecords = overallTotal - overallMigrated;
          
          if (recordsPerMs > 0) {
            const remainingMs = remainingRecords / recordsPerMs;
            const estimatedCompletionTime = new Date(Date.now() + remainingMs);
            migration.estimatedCompletionTime = estimatedCompletionTime.toISOString();
          }
        }
        
        // Mark as complete if fully processed or close to it
        if (progressPct >= 99.5) {
          migration.status = 'completed';
          migration.completedAt = new Date().toISOString();
          
          // Ensure all data types show as 100% complete
          for (const type in migration.progress) {
            if (type !== 'overall' && migration.progress[type]) {
              migration.progress[type].migrated = migration.progress[type].total - migration.progress[type].failed;
              migration.progress[type].percentage = 100;
            }
          }
          
          migration.progress.overall.migrated = overallTotal - overallFailed;
          migration.progress.overall.percentage = 100;
        }
        
        // Save updated migration data
        migrations.set(migrationId, migration);
      }

      // Add detailed performance metrics
      const performanceMetrics = {
        averageRecordsPerSecond: 0,
        peakRecordsPerSecond: 0,
        totalElapsedSeconds: 0,
        estimatedRemainingSeconds: 0
      };
      
      if (migration.startTime) {
        const elapsedMs = Date.now() - new Date(migration.startTime).getTime();
        performanceMetrics.totalElapsedSeconds = Math.floor(elapsedMs / 1000);
        
        const migrated = migration.progress.overall.migrated;
        if (migrated > 0 && elapsedMs > 0) {
          performanceMetrics.averageRecordsPerSecond = (migrated / elapsedMs) * 1000;
          
          // Calculate estimated remaining time
          const remaining = migration.progress.overall.total - migrated;
          if (performanceMetrics.averageRecordsPerSecond > 0) {
            performanceMetrics.estimatedRemainingSeconds = 
              Math.floor(remaining / performanceMetrics.averageRecordsPerSecond);
          }
          
          // Simulate peak performance (slightly higher than average)
          performanceMetrics.peakRecordsPerSecond = 
            performanceMetrics.averageRecordsPerSecond * (1 + (Math.random() * 0.3));
        }
      }
      
      return new Response(
        JSON.stringify(baseResponse(true, {
          ...migration,
          performanceMetrics
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
