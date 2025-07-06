import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Clock, Database } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MigrationProject {
  id: string;
  company_name: string;
  source_crm: string;
  destination_crm: string;
  status: string;
  total_objects: number;
  migrated_objects: number;
  failed_objects: number;
}

interface ObjectType {
  id: string;
  name: string;
  total_records: number;
  processed_records: number;
  failed_records: number;
  status: string;
}

interface MigrationExecutionDashboardProps {
  projectId: string;
  sourceConnectionId: string;
  destinationConnectionId: string;
}

const MigrationExecutionDashboard: React.FC<MigrationExecutionDashboardProps> = ({
  projectId,
  sourceConnectionId,
  destinationConnectionId
}) => {
  const { toast } = useToast();
  const [project, setProject] = useState<MigrationProject | null>(null);
  const [objectTypes, setObjectTypes] = useState<ObjectType[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [currentObjectType, setCurrentObjectType] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
    loadObjectTypes();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      if (isExecuting || isExtracting) {
        loadProject();
        loadObjectTypes();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [projectId, isExecuting, isExtracting]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('migration_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const loadObjectTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('migration_object_types')
        .select('*')
        .eq('project_id', projectId)
        .order('name');

      if (error) throw error;
      setObjectTypes(data || []);
    } catch (error) {
      console.error('Error loading object types:', error);
    }
  };

  const startDataExtraction = async () => {
    setIsExtracting(true);
    try {
      const objectTypeNames = objectTypes.length > 0 
        ? objectTypes.map(ot => ot.name)
        : ['contacts', 'companies', 'deals']; // Default object types

      const { data, error } = await supabase.functions.invoke('unified-data-extraction', {
        body: {
          project_id: projectId,
          connection_id: sourceConnectionId,
          object_types: objectTypeNames
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Data extraction failed');
      }

      toast({
        title: "Data Extraction Complete",
        description: `Extracted ${data.total_records} records successfully`
      });

      loadProject();
      loadObjectTypes();
    } catch (error) {
      console.error('Error during data extraction:', error);
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "Failed to extract data",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const startMigration = async (objectType: string) => {
    setIsExecuting(true);
    setCurrentObjectType(objectType);
    
    try {
      const { data, error } = await supabase.functions.invoke('unified-migration-execute', {
        body: {
          project_id: projectId,
          destination_connection_id: destinationConnectionId,
          object_type: objectType,
          batch_size: 50
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Migration failed');
      }

      toast({
        title: "Migration Batch Complete",
        description: `Migrated ${data.migrated_count} records (${data.failed_count} failed)`
      });

      // If there are more records to process, continue
      if (data.has_more) {
        setTimeout(() => startMigration(objectType), 1000);
      } else {
        setIsExecuting(false);
        setCurrentObjectType(null);
      }

      loadProject();
      loadObjectTypes();
    } catch (error) {
      console.error('Error during migration:', error);
      toast({
        title: "Migration Failed",
        description: error instanceof Error ? error.message : "Failed to migrate data",
        variant: "destructive"
      });
      setIsExecuting(false);
      setCurrentObjectType(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
      case 'extraction_partial':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'extracting':
      case 'migrating':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
      case 'extraction_partial':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'extracting':
      case 'migrating':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateProgress = (processed: number, total: number) => {
    return total > 0 ? Math.round((processed / total) * 100) : 0;
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Migration Execution - {project.company_name}
            <Badge className={getStatusColor(project.status)}>
              {getStatusIcon(project.status)}
              <span className="ml-1">{project.status}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{project.migrated_objects}</div>
              <div className="text-sm text-muted-foreground">Migrated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{project.failed_objects}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{project.total_objects}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={startDataExtraction}
              disabled={isExtracting || isExecuting}
              variant="outline"
            >
              <Database className="h-4 w-4 mr-1" />
              {isExtracting ? 'Extracting...' : 'Extract Data'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {objectTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Object Types Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {objectTypes.map((objectType) => (
              <div key={objectType.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(objectType.status)}
                    <span className="font-medium capitalize">{objectType.name}</span>
                    <Badge variant="outline">
                      {objectType.processed_records} / {objectType.total_records}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    {objectType.status === 'extracted' && (
                      <Button
                        size="sm"
                        onClick={() => startMigration(objectType.name)}
                        disabled={isExecuting || isExtracting}
                      >
                        {currentObjectType === objectType.name && isExecuting ? (
                          <>
                            <Clock className="h-3 w-3 mr-1 animate-pulse" />
                            Migrating...
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Migrate
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Progress 
                    value={calculateProgress(objectType.processed_records, objectType.total_records)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress: {calculateProgress(objectType.processed_records, objectType.total_records)}%</span>
                    {objectType.failed_records > 0 && (
                      <span className="text-red-600">{objectType.failed_records} failed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {objectTypes.length === 0 && project.status === 'pending' && (
        <Alert>
          <AlertDescription>
            No data has been extracted yet. Click "Extract Data" to begin the migration process.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MigrationExecutionDashboard;