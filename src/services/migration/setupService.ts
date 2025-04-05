
import { MigrationProject } from "@/integrations/supabase/migrationTypes";
import { createMigrationProject } from "./projectService";
import { createMigrationStage } from "./stageService";
import { createMigrationObjectType } from "./objectTypeService";
import { logUserActivity } from "./activityService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SetupFormData } from "@/contexts/setup-wizard/types";
import { createNotification } from "./notificationService";

/**
 * Create a default migration project from setup wizard data
 */
export const createDefaultMigrationProject = async (formData: SetupFormData & {
  multiCrmSourceList?: string[];
  multiDestinationList?: string[];
  multiCrmEnabled?: boolean;
  multiDestinationEnabled?: boolean;
  customCrmNames?: Record<string, string>;
}): Promise<MigrationProject | null> => {
  try {
    // Determine source and destination CRM values based on multi-CRM mode
    const sourceCrm = formData.multiCrmEnabled && formData.multiCrmSourceList 
      ? formData.multiCrmSourceList.join(',')
      : formData.sourceCrm;
      
    const destinationCrm = formData.multiDestinationEnabled && formData.multiDestinationList
      ? formData.multiDestinationList.join(',')
      : formData.destinationCrm;
      
    const projectData: Omit<MigrationProject, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
      company_name: formData.companyName,
      source_crm: sourceCrm,
      destination_crm: destinationCrm,
      migration_strategy: formData.migrationStrategy,
      status: 'pending' as const,
      total_objects: 0,
      migrated_objects: 0,
      failed_objects: 0,
      completed_at: null
    };
    
    const project = await createMigrationProject(projectData);
    
    if (!project) throw new Error('Failed to create migration project');
    
    // Create default stages
    const stages = [
      { name: 'Data Extraction', description: 'Extracting data from source CRM', sequence_order: 1 },
      { name: 'Data Mapping', description: 'Mapping fields between source and destination', sequence_order: 2 },
      { name: 'Data Transformation', description: 'Transforming data to match destination format', sequence_order: 3 },
      { name: 'Data Validation', description: 'Validating data before import', sequence_order: 4 },
      { name: 'Data Import', description: 'Importing data into destination CRM', sequence_order: 5 },
      { name: 'Verification', description: 'Verifying successful migration', sequence_order: 6 }
    ];
    
    for (const stage of stages) {
      await createMigrationStage({
        project_id: project.id,
        name: stage.name,
        description: stage.description,
        status: 'pending' as const,
        sequence_order: stage.sequence_order,
        started_at: null,
        completed_at: null,
        percentage_complete: 0
      });
    }
    
    // Create object types based on data selection mode
    if (formData.multiCrmEnabled && formData.crmDataSelections.length > 0) {
      // Multi-CRM mode: Create object types from per-CRM data selections
      const objectTypesCreated = new Set<string>();
      
      for (const selection of formData.crmDataSelections) {
        if (selection.dataTypes.length === 0) continue;
        
        // Get CRM name for display
        const crmName = formData.customCrmNames?.[selection.crmId] || selection.crmId;
        
        for (const dataType of selection.dataTypes) {
          // Create a unique name for this object type that includes the CRM
          const typeInfo = getObjectTypeInfo(dataType);
          const objectName = `${crmName} - ${typeInfo.name}`;
          
          // Avoid duplicates
          if (objectTypesCreated.has(objectName)) continue;
          objectTypesCreated.add(objectName);
          
          await createMigrationObjectType({
            project_id: project.id,
            name: objectName,
            description: typeInfo.description,
            total_records: 0,
            processed_records: 0,
            failed_records: 0,
            status: 'pending' as const
          });
        }
      }
    } else if (formData.dataTypes && formData.dataTypes.length > 0) {
      // Single CRM mode: Use the dataTypes array directly
      for (const dataType of formData.dataTypes) {
        const typeInfo = getObjectTypeInfo(dataType);
        await createMigrationObjectType({
          project_id: project.id,
          name: typeInfo.name,
          description: typeInfo.description,
          total_records: 0,
          processed_records: 0,
          failed_records: 0,
          status: 'pending' as const
        });
      }
    }
    
    // Log user activity
    await logUserActivity({
      project_id: project.id,
      activity_type: 'project_creation',
      activity_description: 'Created new migration project',
      activity_details: { 
        formData,
        multiCrmEnabled: formData.multiCrmEnabled,
        multiDestinationEnabled: formData.multiDestinationEnabled 
      }
    });
    
    // Get current user ID
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Create welcome notification
    await createNotification(
      project.id,
      'Migration Project Created',
      `Your ${formData.sourceCrm} to ${formData.destinationCrm} migration project has been created successfully.`,
      'migration_started',
      userId
    );
    
    return project;
  } catch (error: any) {
    toast({
      title: "Error creating migration project",
      description: error.message,
      variant: "destructive",
    });
    console.error("Error in createDefaultMigrationProject:", error);
    return null;
  }
};

// Helper function to get display name and description for object types
function getObjectTypeInfo(dataType: string): { name: string; description: string } {
  const objectTypeMappings: Record<string, { name: string; description: string }> = {
    contacts: { name: 'Contacts & Leads', description: 'All contact and lead information' },
    accounts: { name: 'Accounts & Companies', description: 'Organization information' },
    opportunities: { name: 'Opportunities & Deals', description: 'Sales pipeline and deals' },
    cases: { name: 'Cases & Tickets', description: 'Support cases and tickets' },
    activities: { name: 'Activities & Tasks', description: 'Call logs, emails, and tasks' },
    custom: { name: 'Custom Objects', description: 'Your custom data objects' }
  };
  
  return objectTypeMappings[dataType] || { name: dataType, description: `${dataType} records` };
}
