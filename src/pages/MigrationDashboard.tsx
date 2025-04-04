import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BarChart3,
  FileText,
  AlertTriangle,
  Activity,
  Database,
  Settings,
  ArrowUpDown,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  DownloadCloud,
  XCircle,
  Zap,
  ListChecks,
  Clock
} from "lucide-react";
import {
  MigrationProject,
  MigrationStage,
  MigrationObjectType,
  MigrationError,
  UserActivity,
  FieldMapping,
} from "@/integrations/supabase/migrationTypes";
import {
  getMigrationProject,
  getMigrationStages,
  getMigrationObjectTypes,
  getMigrationErrors,
  getFieldMappings,
  updateMigrationProject,
  logUserActivity,
} from "@/services/migrationService";
import { useToast } from "@/components/ui/use-toast";
import MigrationStatusCard from "@/components/migration/MigrationStatusCard";
import MigrationStagesProgress from "@/components/migration/MigrationStagesProgress";
import ObjectMigrationStatus from "@/components/migration/ObjectMigrationStatus";
import ErrorSummary from "@/components/migration/ErrorSummary";
import DataMappingVisualizer from "@/components/migration/DataMappingVisualizer";
import ActivityTimeline from "@/components/migration/ActivityTimeline";
import { supabase } from "@/integrations/supabase/client";
import DataValidation from "@/components/migration/DataValidation";
import DeltaMigrationConfig from "@/components/migration/DeltaMigrationConfig";
import NotificationsPanel from "@/components/migration/NotificationsPanel";
import { createNotification } from "@/services/migration/notificationService";

const MigrationDashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<MigrationProject | null>(null);
  const [stages, setStages] = useState<MigrationStage[]>([]);
  const [objectTypes, setObjectTypes] = useState<MigrationObjectType[]>([]);
  const [errors, setErrors] = useState<MigrationError[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [selectedObjectTypeId, setSelectedObjectTypeId] = useState<string | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!projectId) {
      navigate("/migrations");
      return;
    }

    const fetchMigrationData = async () => {
      setIsLoading(true);
      
      // Fetch project details
      const projectData = await getMigrationProject(projectId);
      if (!projectData) {
        toast({
          title: "Error",
          description: "Failed to load migration project.",
          variant: "destructive",
        });
        navigate("/migrations");
        return;
      }
      setProject(projectData);

      // Fetch stages
      const stagesData = await getMigrationStages(projectId);
      setStages(stagesData);

      // Fetch object types
      const objectTypesData = await getMigrationObjectTypes(projectId);
      setObjectTypes(objectTypesData);
      if (objectTypesData.length > 0) {
        setSelectedObjectTypeId(objectTypesData[0].id);
      }

      // Fetch errors
      const errorsData = await getMigrationErrors(projectId);
      setErrors(errorsData);

      // Fetch user activities
      try {
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setActivities(data || []);
      } catch (error: any) {
        console.error("Error fetching activities:", error);
      }

      // Fetch field mappings for the first object type if available
      if (objectTypesData.length > 0) {
        const mappingsData = await getFieldMappings(objectTypesData[0].id);
        setFieldMappings(mappingsData);
      }

      setIsLoading(false);
    };

    fetchMigrationData();
  }, [projectId, navigate, toast]);

  useEffect(() => {
    // Fetch field mappings when selected object type changes
    const fetchFieldMappings = async () => {
      if (selectedObjectTypeId) {
        const mappingsData = await getFieldMappings(selectedObjectTypeId);
        setFieldMappings(mappingsData);
      }
    };

    fetchFieldMappings();
  }, [selectedObjectTypeId]);

  const handleObjectTypeSelect = (objectTypeId: string) => {
    setSelectedObjectTypeId(objectTypeId);
  };

  const handleToggleMigrationStatus = async () => {
    if (!project) return;

    try {
      setIsProcessing(true);
      
      const newStatus = project.status === "in_progress" ? "paused" : "in_progress";
      const updatedProject = await updateMigrationProject(project.id, { status: newStatus });
      
      if (updatedProject) {
        setProject(updatedProject);
        
        // Log the activity
        await logUserActivity({
          project_id: project.id,
          activity_type: newStatus === "in_progress" ? "project_resumed" : "project_paused",
          activity_description: `Migration ${newStatus === "in_progress" ? "resumed" : "paused"}`
        });
        
        toast({
          title: newStatus === "in_progress" ? "Migration Resumed" : "Migration Paused",
          description: `Your migration has been ${newStatus === "in_progress" ? "resumed" : "paused"} successfully.`,
        });
        
        // Refresh activities
        const { data } = await supabase
          .from('user_activities')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: false });
          
        if (data) {
          setActivities(data);
        }
      }
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to update migration status.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // New handlers for our added features
  const handleSaveDeltaConfig = async (config: any) => {
    if (!project) return;
    
    try {
      // In a real app, we would save this to the database
      // For now we'll just log it and show a success notification
      console.log("Delta migration config saved:", config);
      
      // Create a notification
      if (config.enabled) {
        await createNotification(
          project.id,
          "Delta Migration Enabled",
          `Delta migration configured with ${config.syncFrequency} frequency.`,
          "migration_started"
        );
      }
      
      toast({
        title: config.enabled ? "Delta Migration Enabled" : "Delta Migration Disabled",
        description: config.enabled 
          ? `Configuration saved with ${config.syncFrequency} updates.` 
          : "Delta migration has been disabled.",
      });
      
      // Log the activity
      await logUserActivity({
        project_id: project.id,
        activity_type: "delta_config_updated",
        activity_description: config.enabled 
          ? `Delta migration configured with ${config.syncFrequency} frequency` 
          : "Delta migration disabled",
        activity_details: config
      });
      
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to save delta migration configuration.",
        variant: "destructive",
      });
    }
  };

  const selectedObjectType = objectTypes.find(obj => obj.id === selectedObjectTypeId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
        <Navbar />
        <div className="container px-4 pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-brand-500" />
            <h2 className="text-xl font-medium">Loading migration data...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
        <Navbar />
        <div className="container px-4 pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-medium">Migration project not found</h2>
            <p className="mt-2 text-muted-foreground">The migration project you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-6" onClick={() => navigate("/migrations")}>
              Back to Migrations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      
      <section className="pt-32 pb-8 md:pt-40 md:pb-10 relative">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => navigate("/migrations")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                <Badge className="bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
                  Migration
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {project.company_name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {project.source_crm} to {project.destination_crm} Migration
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <NotificationsPanel projectId={project.id} />
              
              <Button
                variant={project.status === "in_progress" ? "outline" : "default"}
                className="gap-2"
                onClick={handleToggleMigrationStatus}
                disabled={isProcessing || project.status === "completed" || project.status === "failed"}
              >
                {project.status === "in_progress" ? (
                  <>
                    <PauseCircle className="h-4 w-4" />
                    <span>Pause Migration</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    <span>Resume Migration</span>
                  </>
                )}
              </Button>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Data</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <DownloadCloud className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-auto">
              <TabsList className="mb-8">
                <TabsTrigger value="overview" className="gap-1.5">
                  <BarChart3 className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="data-mapping" className="gap-1.5">
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Data Mapping</span>
                </TabsTrigger>
                <TabsTrigger value="validation" className="gap-1.5">
                  <ListChecks className="h-4 w-4" />
                  <span>Validation</span>
                </TabsTrigger>
                <TabsTrigger value="delta" className="gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Delta Sync</span>
                </TabsTrigger>
                <TabsTrigger value="errors" className="gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Errors & Issues</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-1.5">
                  <Activity className="h-4 w-4" />
                  <span>Activity Log</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>Reports</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-1.5">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="space-y-8">
              <FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MigrationStatusCard project={project} />
                  <MigrationStagesProgress stages={stages} />
                </div>
              </FadeIn>
              
              <FadeIn delay="100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <ObjectMigrationStatus objectTypes={objectTypes} />
                  </div>
                  <div>
                    <ErrorSummary errors={errors} limit={3} />
                  </div>
                </div>
              </FadeIn>
            </TabsContent>
            
            <TabsContent value="data-mapping">
              <FadeIn>
                <GlassPanel className="mb-6">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Data Mapping Configuration</h2>
                    <p className="text-muted-foreground mb-6">
                      Review and configure how data fields are mapped between your source and destination CRMs.
                    </p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Object Type</label>
                        <div className="flex flex-wrap gap-2">
                          {objectTypes.map((objectType) => (
                            <Button
                              key={objectType.id}
                              variant={selectedObjectTypeId === objectType.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleObjectTypeSelect(objectType.id)}
                            >
                              <Database className="h-4 w-4 mr-2" />
                              {objectType.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {selectedObjectType && (
                        <DataMappingVisualizer 
                          objectType={selectedObjectType} 
                          fieldMappings={fieldMappings} 
                        />
                      )}
                    </div>
                  </div>
                </GlassPanel>
              </FadeIn>
            </TabsContent>

            <TabsContent value="validation">
              <FadeIn>
                <DataValidation 
                  project={project} 
                  objectTypes={objectTypes} 
                />
              </FadeIn>
            </TabsContent>

            <TabsContent value="delta">
              <FadeIn>
                <DeltaMigrationConfig 
                  projectId={project.id}
                  onSave={handleSaveDeltaConfig}
                />
              </FadeIn>
            </TabsContent>
            
            <TabsContent value="errors">
              <FadeIn>
                <GlassPanel className="mb-6">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Error Reports & Issues</h2>
                    <p className="text-muted-foreground mb-6">
                      Track and resolve any errors or issues encountered during the migration process.
                    </p>
                    
                    <ErrorSummary errors={errors} />
                  </div>
                </GlassPanel>
              </FadeIn>
            </TabsContent>
            
            <TabsContent value="activity">
              <FadeIn>
                <GlassPanel className="mb-6">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
                    <p className="text-muted-foreground mb-6">
                      Comprehensive timeline of all activities and events related to your migration.
                    </p>
                    
                    <ActivityTimeline activities={activities} limit={20} />
                  </div>
                </GlassPanel>
              </FadeIn>
            </TabsContent>
            
            <TabsContent value="reports">
              <FadeIn>
                <GlassPanel className="mb-6">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Migration Reports</h2>
                    <p className="text-muted-foreground mb-6">
                      Detailed reports on the migration process, data quality, and validation results.
                    </p>
                    
                    <div className="bg-muted/30 rounded-lg p-6 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
                      <h3 className="text-lg font-medium">Reports Coming Soon</h3>
                      <p className="text-muted-foreground mt-2">
                        Detailed migration reports will be available once data processing begins.
                      </p>
                    </div>
                  </div>
                </GlassPanel>
              </FadeIn>
            </TabsContent>
            
            <TabsContent value="settings">
              <FadeIn>
                <GlassPanel className="mb-6">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Migration Settings</h2>
                    <p className="text-muted-foreground mb-6">
                      Configure preferences and options for your CRM migration.
                    </p>
                    
                    <div className="bg-muted/30 rounded-lg p-6 text-center">
                      <Settings className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
                      <h3 className="text-lg font-medium">Settings Coming Soon</h3>
                      <p className="text-muted-foreground mt-2">
                        Advanced configuration options for your migration will be available in the next update.
                      </p>
                    </div>
                  </div>
                </GlassPanel>
              </FadeIn>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default MigrationDashboard;
