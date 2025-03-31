
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock migration data storage
const migrations = new Map();

const baseResponse = (success: boolean, data: any, meta?: any, error?: any) => {
  if (success) {
    return { success, data, meta: meta || {} };
  }
  return { success, error };
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
        }
      };
      
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
            
            migration.progress[dataType.type] = {
              total: typeTotal,
              migrated: 0,
              failed: 0,
              percentage: 0
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
      
      // Simulate progress
      if (migration.status === 'in_progress') {
        const elapsedMinutes = (Date.now() - new Date(migration.startTime).getTime()) / 60000;
        
        // Update progress based on elapsed time
        const progressPct = Math.min(100, elapsedMinutes * 5); // 5% per minute
        
        // Update each data type's progress
        for (const type in migration.progress) {
          if (type !== 'overall' && migration.progress[type]) {
            const total = migration.progress[type].total;
            const migrated = Math.floor(total * (progressPct / 100));
            const failed = Math.floor(total * 0.02); // 2% failure rate
            
            migration.progress[type].migrated = migrated;
            migration.progress[type].failed = failed;
            migration.progress[type].percentage = (migrated / total) * 100;
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
        migration.progress.overall.percentage = (overallMigrated / overallTotal) * 100;
        
        // Mark as complete if fully processed
        if (progressPct >= 100) {
          migration.status = 'completed';
        }
        
        // Save updated migration data
        migrations.set(migrationId, migration);
      }

      return new Response(
        JSON.stringify(baseResponse(true, migration)),
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
