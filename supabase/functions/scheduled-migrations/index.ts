
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: Request) => {
  try {
    console.log('Checking for scheduled migrations...');
    
    // Get all active scheduled migrations that are due
    const { data: scheduledMigrations, error } = await supabase
      .from('migration_schedules')
      .select('*')
      .eq('is_active', true)
      .lte('next_run_at', new Date().toISOString());

    if (error) {
      console.error('Error fetching scheduled migrations:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log(`Found ${scheduledMigrations?.length || 0} migrations to execute`);

    for (const schedule of scheduledMigrations || []) {
      try {
        console.log(`Executing scheduled migration: ${schedule.name}`);
        
        // Create a new migration project
        const { data: project, error: projectError } = await supabase
          .from('migration_projects')
          .insert({
            user_id: schedule.user_id,
            workspace_id: schedule.workspace_id,
            company_name: `Scheduled: ${schedule.name}`,
            source_crm: schedule.migration_config.source_crm,
            destination_crm: schedule.migration_config.destination_crm,
            migration_strategy: 'scheduled',
            status: 'pending'
          })
          .select()
          .single();

        if (projectError) {
          console.error('Error creating project:', projectError);
          continue;
        }

        // Call the migration orchestrator
        const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/migration-orchestrator`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'start_migration',
            projectId: project.id,
            sourceCredentials: schedule.migration_config.source_credentials,
            destinationCredentials: schedule.migration_config.destination_credentials,
            objectTypes: schedule.migration_config.object_types,
            fieldMappings: schedule.migration_config.field_mappings
          })
        });

        if (response.ok) {
          // Calculate next run time based on cron expression
          const nextRunAt = getNextCronDate(schedule.cron_expression);
          
          // Update the schedule
          await supabase
            .from('migration_schedules')
            .update({
              last_run_at: new Date().toISOString(),
              next_run_at: nextRunAt.toISOString(),
              retry_count: 0
            })
            .eq('id', schedule.id);

          console.log(`Successfully started migration for schedule: ${schedule.name}`);
        } else {
          throw new Error(`Migration orchestrator returned: ${response.status}`);
        }

      } catch (error) {
        console.error(`Error executing scheduled migration ${schedule.name}:`, error);
        
        // Update retry count
        const newRetryCount = (schedule.retry_count || 0) + 1;
        const updates: any = { retry_count: newRetryCount };
        
        // Disable if max retries exceeded
        if (newRetryCount >= schedule.max_retries) {
          updates.is_active = false;
          console.log(`Disabling schedule ${schedule.name} due to max retries exceeded`);
        }
        
        await supabase
          .from('migration_schedules')
          .update(updates)
          .eq('id', schedule.id);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: scheduledMigrations?.length || 0 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Scheduled migrations error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

function getNextCronDate(cronExpression: string): Date {
  // Simple cron parser for common patterns
  // For production, you'd want to use a proper cron library
  const now = new Date();
  const next = new Date(now);
  
  // For demo purposes, add 1 hour for any cron expression
  // In production, implement proper cron parsing
  next.setHours(next.getHours() + 1);
  
  return next;
}
