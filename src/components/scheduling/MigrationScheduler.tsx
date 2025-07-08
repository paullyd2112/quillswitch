import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Play, Pause, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MigrationSchedule {
  id: string;
  name: string;
  description: string;
  cron_expression: string;
  next_run_at: string;
  last_run_at?: string;
  migration_config: any;
  is_active: boolean;
  retry_count: number;
  max_retries: number;
  created_at: string;
}

const CRON_PRESETS = [
  { label: 'Every day at 2 AM', value: '0 2 * * *' },
  { label: 'Every weekday at 6 AM', value: '0 6 * * 1-5' },
  { label: 'Every Sunday at midnight', value: '0 0 * * 0' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every 30 minutes', value: '*/30 * * * *' },
  { label: 'Custom', value: 'custom' }
];

const MigrationScheduler: React.FC = () => {
  const { currentWorkspace } = useWorkspace();
  const [schedules, setSchedules] = useState<MigrationSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cronPreset, setCronPreset] = useState('');
  const [customCron, setCustomCron] = useState('');
  const [sourceCrm, setSourceCrm] = useState('');
  const [destinationCrm, setDestinationCrm] = useState('');
  const [maxRetries, setMaxRetries] = useState(3);

  // Load schedules
  const loadSchedules = async () => {
    if (!currentWorkspace) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('migration_schedules')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Failed to load schedules:', error);
      toast.error('Failed to load migration schedules');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new schedule
  const createSchedule = async () => {
    if (!currentWorkspace || !name || !cronPreset) {
      toast.error('Please fill in all required fields');
      return;
    }

    const cronExpression = cronPreset === 'custom' ? customCron : cronPreset;
    if (!cronExpression) {
      toast.error('Please provide a valid cron expression');
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('migration_schedules')
        .insert({
          workspace_id: currentWorkspace.id,
          user_id: (await supabase.auth.getUser()).data.user?.id || '',
          name,
          description,
          cron_expression: cronExpression,
          migration_config: {
            source_crm: sourceCrm,
            destination_crm: destinationCrm,
            data_types: ['contacts', 'accounts', 'opportunities'],
            validation_rules: [],
            transformation_rules: []
          },
          max_retries: maxRetries
        });

      if (error) throw error;

      toast.success('Migration schedule created successfully');
      setShowCreateForm(false);
      resetForm();
      loadSchedules();
    } catch (error) {
      console.error('Failed to create schedule:', error);
      toast.error('Failed to create migration schedule');
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle schedule active status
  const toggleSchedule = async (scheduleId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('migration_schedules')
        .update({ is_active: isActive })
        .eq('id', scheduleId);

      if (error) throw error;

      toast.success(`Schedule ${isActive ? 'activated' : 'deactivated'}`);
      loadSchedules();
    } catch (error) {
      console.error('Failed to toggle schedule:', error);
      toast.error('Failed to update schedule');
    }
  };

  // Delete schedule
  const deleteSchedule = async (scheduleId: string) => {
    try {
      const { error } = await supabase
        .from('migration_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;

      toast.success('Schedule deleted successfully');
      loadSchedules();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      toast.error('Failed to delete schedule');
    }
  };

  // Reset form
  const resetForm = () => {
    setName('');
    setDescription('');
    setCronPreset('');
    setCustomCron('');
    setSourceCrm('');
    setDestinationCrm('');
    setMaxRetries(3);
  };

  // Format next run time
  const formatNextRun = (nextRunAt: string) => {
    return new Date(nextRunAt).toLocaleString();
  };

  // Parse cron expression to human readable
  const parseCronToHuman = (cron: string) => {
    const preset = CRON_PRESETS.find(p => p.value === cron);
    return preset ? preset.label : cron;
  };

  useEffect(() => {
    loadSchedules();
  }, [currentWorkspace]);

  if (!currentWorkspace) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Please select a workspace to manage migration schedules.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Migration Scheduler</h2>
          <p className="text-muted-foreground">
            Automate your migration workflows with scheduled runs
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Schedule
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Migration Schedule</CardTitle>
            <CardDescription>
              Set up automated migration runs with custom timing and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-name">Schedule Name</Label>
                <Input
                  id="schedule-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Daily CRM Sync"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule-timing">Schedule Timing</Label>
                <Select value={cronPreset} onValueChange={setCronPreset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timing" />
                  </SelectTrigger>
                  <SelectContent>
                    {CRON_PRESETS.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {cronPreset === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="custom-cron">Custom Cron Expression</Label>
                <Input
                  id="custom-cron"
                  value={customCron}
                  onChange={(e) => setCustomCron(e.target.value)}
                  placeholder="0 2 * * *"
                />
                <p className="text-xs text-muted-foreground">
                  Use standard cron format: minute hour day month weekday
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="schedule-description">Description</Label>
              <Textarea
                id="schedule-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description of what this schedule does..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source-crm">Source CRM</Label>
                <Select value={sourceCrm} onValueChange={setSourceCrm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salesforce">Salesforce</SelectItem>
                    <SelectItem value="hubspot">HubSpot</SelectItem>
                    <SelectItem value="pipedrive">Pipedrive</SelectItem>
                    <SelectItem value="zoho">Zoho CRM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination-crm">Destination CRM</Label>
                <Select value={destinationCrm} onValueChange={setDestinationCrm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salesforce">Salesforce</SelectItem>
                    <SelectItem value="hubspot">HubSpot</SelectItem>
                    <SelectItem value="pipedrive">Pipedrive</SelectItem>
                    <SelectItem value="zoho">Zoho CRM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-retries">Max Retries</Label>
                <Input
                  id="max-retries"
                  type="number"
                  value={maxRetries}
                  onChange={(e) => setMaxRetries(parseInt(e.target.value) || 3)}
                  min="0"
                  max="10"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={createSchedule}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Schedule'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p>Loading schedules...</p>
          </CardContent>
        </Card>
      ) : schedules.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No migration schedules found</p>
            <p className="text-sm text-muted-foreground">Create your first schedule to automate migrations</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{schedule.name}</h3>
                      <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                        {schedule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    {schedule.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {schedule.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{parseCronToHuman(schedule.cron_expression)}</span>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Next run: </span>
                        <span>{formatNextRun(schedule.next_run_at)}</span>
                      </div>
                      
                      {schedule.last_run_at && (
                        <div>
                          <span className="text-muted-foreground">Last run: </span>
                          <span>{formatNextRun(schedule.last_run_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={schedule.is_active}
                      onCheckedChange={(checked) => toggleSchedule(schedule.id, checked)}
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSchedule(schedule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MigrationScheduler;