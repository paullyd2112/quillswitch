
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Cloud, Calendar, Settings, Zap } from 'lucide-react';
import { CloudMigrationRequest } from '@/services/cloud/CloudMigrationService';

interface CloudMigrationSetupProps {
  onSetupComplete: (config: CloudMigrationRequest & { schedule?: any }) => void;
}

const CloudMigrationSetup: React.FC<CloudMigrationSetupProps> = ({ onSetupComplete }) => {
  const [config, setConfig] = useState<Partial<CloudMigrationRequest>>({
    objectTypes: [],
    fieldMappings: {}
  });
  const [schedule, setSchedule] = useState({
    enabled: false,
    recurring: false,
    cronExpression: '0 2 * * 0', // Weekly on Sunday at 2 AM
    name: '',
    description: ''
  });

  const handleObjectTypeToggle = (objectType: string) => {
    setConfig(prev => ({
      ...prev,
      objectTypes: prev.objectTypes?.includes(objectType)
        ? prev.objectTypes.filter(type => type !== objectType)
        : [...(prev.objectTypes || []), objectType]
    }));
  };

  const handleSubmit = () => {
    if (!config.projectId || !config.sourceCredentials || !config.destinationCredentials) {
      return;
    }

    const finalConfig: CloudMigrationRequest & { schedule?: any } = {
      ...config as CloudMigrationRequest,
      schedule: schedule.enabled ? {
        immediate: !schedule.recurring,
        recurring: schedule.recurring,
        cronExpression: schedule.cronExpression
      } : { immediate: true }
    };

    if (schedule.enabled && schedule.recurring) {
      finalConfig.scheduleDetails = {
        name: schedule.name,
        description: schedule.description
      };
    }

    onSetupComplete(finalConfig);
  };

  const objectTypes = [
    { id: 'contacts', name: 'Contacts', description: 'Individual contacts and leads' },
    { id: 'companies', name: 'Companies', description: 'Company and account records' },
    { id: 'deals', name: 'Deals/Opportunities', description: 'Sales opportunities and deals' },
    { id: 'tasks', name: 'Tasks', description: 'Activities and tasks' },
    { id: 'notes', name: 'Notes', description: 'Notes and comments' }
  ];

  const cronPresets = [
    { label: 'Daily at 2 AM', value: '0 2 * * *' },
    { label: 'Weekly (Sunday at 2 AM)', value: '0 2 * * 0' },
    { label: 'Monthly (1st at 2 AM)', value: '0 2 1 * *' },
    { label: 'Every 6 hours', value: '0 */6 * * *' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Cloud className="h-6 w-6 text-primary" />
            Cloud Migration Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Migration Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-id">Project ID</Label>
                <Input
                  id="project-id"
                  placeholder="Enter project ID"
                  value={config.projectId || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, projectId: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source-connection">Source Connection</Label>
                <Select onValueChange={(value) => setConfig(prev => ({ 
                  ...prev, 
                  sourceCredentials: { type: 'crm', connectionId: value }
                }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source connection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salesforce-conn-1">Salesforce (Main)</SelectItem>
                    <SelectItem value="hubspot-conn-1">HubSpot (Sales)</SelectItem>
                    <SelectItem value="pipedrive-conn-1">Pipedrive (Primary)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination-connection">Destination Connection</Label>
              <Select onValueChange={(value) => setConfig(prev => ({ 
                ...prev, 
                destinationCredentials: { type: 'crm', connectionId: value }
              }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination connection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salesforce-conn-2">Salesforce (Target)</SelectItem>
                  <SelectItem value="hubspot-conn-2">HubSpot (New)</SelectItem>
                  <SelectItem value="pipedrive-conn-2">Pipedrive (Backup)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Object Types Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Objects to Migrate</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {objectTypes.map((objectType) => (
                <Card 
                  key={objectType.id}
                  className={`cursor-pointer transition-colors ${
                    config.objectTypes?.includes(objectType.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-muted-foreground/20'
                  }`}
                  onClick={() => handleObjectTypeToggle(objectType.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{objectType.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {objectType.description}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 ${
                        config.objectTypes?.includes(objectType.id)
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground/40'
                      }`}>
                        {config.objectTypes?.includes(objectType.id) && (
                          <div className="w-full h-full rounded bg-primary"></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Scheduling Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Migration Scheduling
            </h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enable-scheduling"
                checked={schedule.enabled}
                onCheckedChange={(checked) => setSchedule(prev => ({ ...prev, enabled: checked }))}
              />
              <Label htmlFor="enable-scheduling">Enable scheduled migration</Label>
            </div>

            {schedule.enabled && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={schedule.recurring}
                    onCheckedChange={(checked) => setSchedule(prev => ({ ...prev, recurring: checked }))}
                  />
                  <Label htmlFor="recurring">Recurring migration</Label>
                </div>

                {schedule.recurring && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="schedule-name">Schedule Name</Label>
                        <Input
                          id="schedule-name"
                          placeholder="e.g., Weekly CRM Sync"
                          value={schedule.name}
                          onChange={(e) => setSchedule(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cron-preset">Schedule Frequency</Label>
                        <Select 
                          value={schedule.cronExpression}
                          onValueChange={(value) => setSchedule(prev => ({ ...prev, cronExpression: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {cronPresets.map((preset) => (
                              <SelectItem key={preset.value} value={preset.value}>
                                {preset.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schedule-description">Description (Optional)</Label>
                      <Textarea
                        id="schedule-description"
                        placeholder="Describe what this scheduled migration does..."
                        value={schedule.description}
                        onChange={(e) => setSchedule(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline">Save as Draft</Button>
            <Button 
              onClick={handleSubmit}
              disabled={!config.projectId || !config.sourceCredentials || !config.destinationCredentials || config.objectTypes?.length === 0}
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              {schedule.enabled && !schedule.recurring ? 'Schedule Migration' : 'Start Cloud Migration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CloudMigrationSetup;
