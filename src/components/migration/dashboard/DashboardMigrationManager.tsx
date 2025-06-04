
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, XCircle, BarChart3, Settings, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { dashboardMigrationService } from '@/services/migration/dashboard';
import { DashboardConfig, DashboardMigrationResult } from '@/services/migration/dashboard/types';

interface DashboardMigrationManagerProps {
  sourceCrm: string;
  destinationCrm: string;
  sourceCredentials: Record<string, any>;
  destinationCredentials: Record<string, any>;
  fieldMappings?: Record<string, string>;
}

export const DashboardMigrationManager: React.FC<DashboardMigrationManagerProps> = ({
  sourceCrm,
  destinationCrm,
  sourceCredentials,
  destinationCredentials,
  fieldMappings = {}
}) => {
  const [discoveredDashboards, setDiscoveredDashboards] = useState<DashboardConfig[]>([]);
  const [selectedDashboards, setSelectedDashboards] = useState<string[]>([]);
  const [migrationResults, setMigrationResults] = useState<DashboardMigrationResult[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('discovery');

  useEffect(() => {
    discoverDashboards();
  }, [sourceCrm, sourceCredentials]);

  const discoverDashboards = async () => {
    setIsDiscovering(true);
    try {
      const dashboards = await dashboardMigrationService.migrateDashboards({
        sourceCrm,
        destinationCrm,
        sourceCredentials,
        destinationCredentials,
        fieldMappings
      });
      
      setDiscoveredDashboards(dashboards.discoveredDashboards);
      toast.success(`Discovered ${dashboards.discoveredDashboards.length} dashboards`);
    } catch (error) {
      console.error('Dashboard discovery failed:', error);
      toast.error('Failed to discover dashboards');
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleDashboardSelection = (dashboardId: string, selected: boolean) => {
    if (selected) {
      setSelectedDashboards([...selectedDashboards, dashboardId]);
    } else {
      setSelectedDashboards(selectedDashboards.filter(id => id !== dashboardId));
    }
  };

  const selectAllDashboards = () => {
    setSelectedDashboards(discoveredDashboards.map(d => d.id));
  };

  const clearSelection = () => {
    setSelectedDashboards([]);
  };

  const startMigration = async () => {
    if (selectedDashboards.length === 0) {
      toast.error('Please select dashboards to migrate');
      return;
    }

    setIsMigrating(true);
    setMigrationProgress(0);
    
    try {
      const result = await dashboardMigrationService.migrateDashboards({
        sourceCrm,
        destinationCrm,
        sourceCredentials,
        destinationCredentials,
        fieldMappings,
        selectedDashboards
      });

      setMigrationResults(result.migrationResults);
      setMigrationProgress(100);
      setActiveTab('results');
      
      toast.success(`Migration completed: ${result.overallSummary.successfulMigrations} successful, ${result.overallSummary.failedMigrations} failed`);
    } catch (error) {
      console.error('Dashboard migration failed:', error);
      toast.error('Dashboard migration failed');
    } finally {
      setIsMigrating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'partial': return 'text-amber-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'partial': return <AlertTriangle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Dashboard Migration
          </CardTitle>
          <CardDescription>
            Migrate dashboards from {sourceCrm} to {destinationCrm}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="discovery">Discovery</TabsTrigger>
              <TabsTrigger value="migration">Migration</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="discovery" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Discovered Dashboards ({discoveredDashboards.length})
                </h3>
                <div className="space-x-2">
                  <Button 
                    onClick={discoverDashboards} 
                    disabled={isDiscovering}
                    variant="outline"
                    size="sm"
                  >
                    {isDiscovering ? 'Discovering...' : 'Refresh'}
                  </Button>
                  <Button onClick={selectAllDashboards} variant="outline" size="sm">
                    Select All
                  </Button>
                  <Button onClick={clearSelection} variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              </div>

              <div className="grid gap-3">
                {discoveredDashboards.map((dashboard) => (
                  <Card key={dashboard.id} className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedDashboards.includes(dashboard.id)}
                        onCheckedChange={(checked) => 
                          handleDashboardSelection(dashboard.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{dashboard.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {dashboard.widgets.length} widgets
                            </Badge>
                            <Badge variant="outline">
                              {dashboard.filters.length} filters
                            </Badge>
                          </div>
                        </div>
                        {dashboard.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {dashboard.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="migration" className="space-y-4">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">
                  Ready to migrate {selectedDashboards.length} dashboards
                </h3>
                
                {isMigrating && (
                  <div className="space-y-2">
                    <Progress value={migrationProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      Migration in progress... {migrationProgress}%
                    </p>
                  </div>
                )}

                <Button 
                  onClick={startMigration} 
                  disabled={isMigrating || selectedDashboards.length === 0}
                  className="w-full"
                >
                  {isMigrating ? 'Migrating...' : 'Start Migration'}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Migration Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="preserve-layout" defaultChecked />
                    <label htmlFor="preserve-layout" className="text-sm">
                      Preserve original layout when possible
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="convert-charts" defaultChecked />
                    <label htmlFor="convert-charts" className="text-sm">
                      Convert unsupported chart types to alternatives
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="skip-complex" />
                    <label htmlFor="skip-complex" className="text-sm">
                      Skip complex filters that cannot be converted
                    </label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <h3 className="text-lg font-semibold">Migration Results</h3>
              
              <div className="grid gap-4">
                {migrationResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {result.sourceConfig.name}
                        </CardTitle>
                        <div className={`flex items-center gap-1 ${getStatusColor(result.migrationStatus)}`}>
                          {getStatusIcon(result.migrationStatus)}
                          <span className="capitalize">{result.migrationStatus}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.warnings.length > 0 && (
                        <div>
                          <h5 className="font-medium text-amber-600 mb-2">Warnings:</h5>
                          <ul className="list-disc list-inside text-sm text-amber-600 space-y-1">
                            {result.warnings.map((warning, i) => (
                              <li key={i}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.errors.length > 0 && (
                        <div>
                          <h5 className="font-medium text-red-600 mb-2">Errors:</h5>
                          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                            {result.errors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.unsupportedFeatures.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-600 mb-2">Unsupported Features:</h5>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {result.unsupportedFeatures.map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMigrationManager;
