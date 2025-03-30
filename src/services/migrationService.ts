
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { 
  MigrationProject, 
  MigrationStage,
  MigrationObjectType,
  FieldMapping,
  MigrationError,
  ValidationReport,
  UserActivity,
  MigrationNotification
} from "@/integrations/supabase/migrationTypes";

// Migration Projects
export const createMigrationProject = async (projectData: Omit<MigrationProject, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<MigrationProject | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_projects')
      .insert({
        ...projectData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast({
      title: "Error creating migration project",
      description: error.message,
      variant: "destructive",
    });
    console.error("Error creating migration project:", error);
    return null;
  }
};

export const getMigrationProjects = async (): Promise<MigrationProject[]> => {
  try {
    const { data, error } = await supabase
      .from('migration_projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    toast({
      title: "Error fetching migration projects",
      description: error.message,
      variant: "destructive",
    });
    console.error("Error fetching migration projects:", error);
    return [];
  }
};

export const getMigrationProject = async (id: string): Promise<MigrationProject | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast({
      title: "Error fetching migration project",
      description: error.message,
      variant: "destructive",
    });
    console.error("Error fetching migration project:", error);
    return null;
  }
};

export const updateMigrationProject = async (id: string, updates: Partial<MigrationProject>): Promise<MigrationProject | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast({
      title: "Error updating migration project",
      description: error.message,
      variant: "destructive",
    });
    console.error("Error updating migration project:", error);
    return null;
  }
};

// Migration Stages
export const getMigrationStages = async (projectId: string): Promise<MigrationStage[]> => {
  try {
    const { data, error } = await supabase
      .from('migration_stages')
      .select('*')
      .eq('project_id', projectId)
      .order('sequence_order', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error("Error fetching migration stages:", error);
    return [];
  }
};

export const createMigrationStage = async (stageData: Omit<MigrationStage, 'id'>): Promise<MigrationStage | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_stages')
      .insert(stageData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Error creating migration stage:", error);
    return null;
  }
};

export const updateMigrationStage = async (id: string, updates: Partial<MigrationStage>): Promise<MigrationStage | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_stages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Error updating migration stage:", error);
    return null;
  }
};

// Migration Object Types
export const getMigrationObjectTypes = async (projectId: string): Promise<MigrationObjectType[]> => {
  try {
    const { data, error } = await supabase
      .from('migration_object_types')
      .select('*')
      .eq('project_id', projectId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error("Error fetching migration object types:", error);
    return [];
  }
};

export const createMigrationObjectType = async (objectTypeData: Omit<MigrationObjectType, 'id'>): Promise<MigrationObjectType | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_object_types')
      .insert(objectTypeData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Error creating migration object type:", error);
    return null;
  }
};

export const updateMigrationObjectType = async (id: string, updates: Partial<MigrationObjectType>): Promise<MigrationObjectType | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_object_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Error updating migration object type:", error);
    return null;
  }
};

// Field Mappings
export const getFieldMappings = async (objectTypeId: string): Promise<FieldMapping[]> => {
  try {
    const { data, error } = await supabase
      .from('field_mappings')
      .select('*')
      .eq('object_type_id', objectTypeId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error("Error fetching field mappings:", error);
    return [];
  }
};

// Migration Errors
export const getMigrationErrors = async (projectId: string): Promise<MigrationError[]> => {
  try {
    const { data, error } = await supabase
      .from('migration_errors')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error("Error fetching migration errors:", error);
    return [];
  }
};

// Create a default migration project from setup wizard data
export const createDefaultMigrationProject = async (formData: any): Promise<MigrationProject | null> => {
  try {
    const projectData = {
      company_name: formData.companyName,
      source_crm: formData.sourceCrm,
      destination_crm: formData.destinationCrm,
      migration_strategy: formData.migrationStrategy,
      status: 'pending' as const,
      total_objects: 0,
      migrated_objects: 0,
      failed_objects: 0
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
        status: 'pending',
        sequence_order: stage.sequence_order,
        started_at: null,
        completed_at: null,
        percentage_complete: 0
      });
    }
    
    // Create object types from dataTypes
    if (formData.dataTypes && formData.dataTypes.length > 0) {
      const objectTypeMappings = {
        contacts: { name: 'Contacts & Leads', description: 'All contact and lead information' },
        accounts: { name: 'Accounts & Companies', description: 'Organization information' },
        opportunities: { name: 'Opportunities & Deals', description: 'Sales pipeline and deals' },
        cases: { name: 'Cases & Tickets', description: 'Support cases and tickets' },
        activities: { name: 'Activities & Tasks', description: 'Call logs, emails, and tasks' },
        custom: { name: 'Custom Objects', description: 'Your custom data objects' }
      };
      
      for (const dataType of formData.dataTypes) {
        if (objectTypeMappings[dataType as keyof typeof objectTypeMappings]) {
          const typeInfo = objectTypeMappings[dataType as keyof typeof objectTypeMappings];
          await createMigrationObjectType({
            project_id: project.id,
            name: typeInfo.name,
            description: typeInfo.description,
            total_records: 0,
            processed_records: 0,
            failed_records: 0,
            status: 'pending'
          });
        }
      }
    }
    
    // Log user activity
    await supabase
      .from('user_activities')
      .insert({
        project_id: project.id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        activity_type: 'project_creation',
        activity_description: 'Created new migration project',
        activity_details: { formData }
      });
    
    // Create welcome notification
    await supabase
      .from('migration_notifications')
      .insert({
        project_id: project.id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        title: 'Migration Project Created',
        message: `Your ${formData.sourceCrm} to ${formData.destinationCrm} migration project has been created successfully.`,
        notification_type: 'info',
        is_read: false
      });
    
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

// Additional helper functions
export const getProjectProgress = (project: MigrationProject): number => {
  if (project.total_objects === 0) return 0;
  return Math.round((project.migrated_objects / project.total_objects) * 100);
};

export const logUserActivity = async (
  projectId: string, 
  activityType: string,
  activityDescription: string,
  activityDetails: any = null
): Promise<void> => {
  try {
    await supabase
      .from('user_activities')
      .insert({
        project_id: projectId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        activity_type: activityType,
        activity_description: activityDescription,
        activity_details: activityDetails
      });
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
};
