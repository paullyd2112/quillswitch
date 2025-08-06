import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Users,
  Send,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface NotificationRule {
  id: string;
  name: string;
  trigger: string;
  channels: string[];
  recipients: string[];
  conditions: Record<string, any>;
  enabled: boolean;
  created_at: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'slack';
  subject?: string;
  content: string;
  variables: string[];
}

interface NotificationHistory {
  id: string;
  rule_name: string;
  type: string;
  recipient: string;
  status: 'sent' | 'failed' | 'pending';
  sent_at: string;
  subject?: string;
  error_message?: string;
}

interface UserPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  slack_notifications: boolean;
  notification_frequency: 'immediate' | 'hourly' | 'daily';
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

const EnterpriseNotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  useEffect(() => {
    loadNotificationData();
  }, []);

  const loadNotificationData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadNotificationRules(),
        loadTemplates(),
        loadHistory(),
        loadUserPreferences()
      ]);
    } catch (error) {
      console.error('Error loading notification data:', error);
      toast({
        title: "Error",
        description: "Failed to load notification data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotificationRules = async () => {
    // Mock notification rules - in production, these would be stored in database
    const mockRules: NotificationRule[] = [
      {
        id: '1',
        name: 'Migration Completion Alert',
        trigger: 'migration_completed',
        channels: ['email', 'slack'],
        recipients: ['admin@company.com', 'ops@company.com'],
        conditions: { project_size: 'large' },
        enabled: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Error Alert - Critical',
        trigger: 'error_occurred',
        channels: ['email', 'sms'],
        recipients: ['admin@company.com'],
        conditions: { severity: 'critical' },
        enabled: true,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Daily Summary Report',
        trigger: 'daily_summary',
        channels: ['email'],
        recipients: ['team@company.com'],
        conditions: { schedule: 'daily_8am' },
        enabled: true,
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'User Login Alert',
        trigger: 'failed_login_attempts',
        channels: ['email'],
        recipients: ['security@company.com'],
        conditions: { attempts: 5, timeframe: '15_minutes' },
        enabled: false,
        created_at: new Date().toISOString()
      }
    ];
    setRules(mockRules);
  };

  const loadTemplates = async () => {
    // Mock templates
    const mockTemplates: NotificationTemplate[] = [
      {
        id: '1',
        name: 'Migration Complete',
        type: 'email',
        subject: 'Migration Completed: {{project_name}}',
        content: 'Your migration project "{{project_name}}" has been completed successfully. {{records_migrated}} records were migrated from {{source_crm}} to {{destination_crm}}.',
        variables: ['project_name', 'records_migrated', 'source_crm', 'destination_crm']
      },
      {
        id: '2',
        name: 'Error Alert',
        type: 'email',
        subject: 'Error Alert: {{error_type}}',
        content: 'An error has occurred in project "{{project_name}}": {{error_message}}. Please check the project dashboard for details.',
        variables: ['error_type', 'project_name', 'error_message']
      },
      {
        id: '3',
        name: 'Daily Summary',
        type: 'email',
        subject: 'Daily Migration Summary - {{date}}',
        content: 'Daily summary: {{completed_projects}} projects completed, {{active_projects}} projects in progress, {{total_records}} records migrated today.',
        variables: ['date', 'completed_projects', 'active_projects', 'total_records']
      }
    ];
    setTemplates(mockTemplates);
  };

  const loadHistory = async () => {
    // Mock notification history
    const mockHistory: NotificationHistory[] = [
      {
        id: '1',
        rule_name: 'Migration Completion Alert',
        type: 'email',
        recipient: 'admin@company.com',
        status: 'sent',
        sent_at: new Date().toISOString(),
        subject: 'Migration Completed: Salesforce to HubSpot'
      },
      {
        id: '2',
        rule_name: 'Error Alert - Critical',
        type: 'email',
        recipient: 'admin@company.com',
        status: 'sent',
        sent_at: new Date(Date.now() - 3600000).toISOString(),
        subject: 'Error Alert: API Connection Failed'
      },
      {
        id: '3',
        rule_name: 'Daily Summary Report',
        type: 'email',
        recipient: 'team@company.com',
        status: 'failed',
        sent_at: new Date(Date.now() - 86400000).toISOString(),
        subject: 'Daily Migration Summary',
        error_message: 'SMTP server connection timeout'
      }
    ];
    setHistory(mockHistory);
  };

  const loadUserPreferences = async () => {
    // Mock user preferences
    setPreferences({
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      slack_notifications: true,
      notification_frequency: 'immediate',
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00'
    });
  };

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled } : rule
    ));
    
    toast({
      title: enabled ? "Rule Enabled" : "Rule Disabled",
      description: `Notification rule has been ${enabled ? 'enabled' : 'disabled'}`
    });
  };

  const deleteRule = async (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    toast({
      title: "Rule Deleted",
      description: "Notification rule has been deleted"
    });
  };

  const testNotification = async (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;

    // Simulate sending test notification
    toast({
      title: "Test Notification Sent",
      description: `Test notification for "${rule.name}" has been sent to configured recipients`
    });
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => prev ? { ...prev, ...newPreferences } : null);
    toast({
      title: "Preferences Updated",
      description: "Your notification preferences have been saved"
    });
  };

  const createRule = () => {
    const newRule: NotificationRule = {
      id: Date.now().toString(),
      name: 'New Notification Rule',
      trigger: 'migration_completed',
      channels: ['email'],
      recipients: [],
      conditions: {},
      enabled: false,
      created_at: new Date().toISOString()
    };
    setEditingRule(newRule);
  };

  const saveRule = async (rule: NotificationRule) => {
    if (rules.find(r => r.id === rule.id)) {
      setRules(rules.map(r => r.id === rule.id ? rule : r));
    } else {
      setRules([...rules, rule]);
    }
    setEditingRule(null);
    toast({
      title: "Rule Saved",
      description: "Notification rule has been saved successfully"
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 animate-pulse" />
          <span>Loading notification center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground">
            Manage enterprise-wide notifications, alerts, and communication preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={createRule}>
            <Plus className="h-4 w-4 mr-2" />
            New Rule
          </Button>
        </div>
      </div>

      {/* Notification Tabs */}
      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Rules & Alerts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Notification Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{rule.name}</h4>
                            <Badge variant="outline">{rule.trigger}</Badge>
                            {rule.enabled ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-muted-foreground">
                              Channels: {rule.channels.join(', ')}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Recipients: {rule.recipients.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={rule.enabled} 
                          onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                        />
                        <Button variant="outline" size="sm" onClick={() => testNotification(rule.id)}>
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingRule(rule)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteRule(rule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Rules</span>
                  <Badge variant="default">{rules.filter(r => r.enabled).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Rules</span>
                  <Badge variant="outline">{rules.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Notifications Today</span>
                  <Badge variant="secondary">{history.filter(h => 
                    new Date(h.sent_at).toDateString() === new Date().toDateString()
                  ).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Success Rate</span>
                  <Badge variant="default">
                    {Math.round((history.filter(h => h.status === 'sent').length / history.length) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      {template.type === 'email' ? (
                        <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                      ) : template.type === 'sms' ? (
                        <Smartphone className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-purple-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline">{template.type}</Badge>
                        </div>
                        {template.subject && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Subject: {template.subject}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          Variables: {template.variables.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      {item.status === 'sent' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : item.status === 'failed' ? (
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{item.rule_name}</h4>
                          <Badge variant={
                            item.status === 'sent' ? 'default' :
                            item.status === 'failed' ? 'destructive' :
                            'secondary'
                          }>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          To: {item.recipient} • Type: {item.type}
                        </p>
                        {item.subject && (
                          <p className="text-sm text-muted-foreground">
                            Subject: {item.subject}
                          </p>
                        )}
                        {item.error_message && (
                          <p className="text-sm text-red-600">
                            Error: {item.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.sent_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Notifications</span>
                  </Label>
                  <Switch 
                    id="email-notifications"
                    checked={preferences?.email_notifications || false}
                    onCheckedChange={(checked) => updatePreferences({ email_notifications: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications" className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>SMS Notifications</span>
                  </Label>
                  <Switch 
                    id="sms-notifications"
                    checked={preferences?.sms_notifications || false}
                    onCheckedChange={(checked) => updatePreferences({ sms_notifications: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <span>Push Notifications</span>
                  </Label>
                  <Switch 
                    id="push-notifications"
                    checked={preferences?.push_notifications || false}
                    onCheckedChange={(checked) => updatePreferences({ push_notifications: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="slack-notifications" className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Slack Notifications</span>
                  </Label>
                  <Switch 
                    id="slack-notifications"
                    checked={preferences?.slack_notifications || false}
                    onCheckedChange={(checked) => updatePreferences({ slack_notifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Notification Frequency</Label>
                  <Select 
                    value={preferences?.notification_frequency || 'immediate'}
                    onValueChange={(value) => updatePreferences({ notification_frequency: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Summary</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Quiet Hours Start</Label>
                  <Input 
                    id="quiet-start"
                    type="time"
                    value={preferences?.quiet_hours_start || '22:00'}
                    onChange={(e) => updatePreferences({ quiet_hours_start: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">Quiet Hours End</Label>
                  <Input 
                    id="quiet-end"
                    type="time"
                    value={preferences?.quiet_hours_end || '08:00'}
                    onChange={(e) => updatePreferences({ quiet_hours_end: e.target.value })}
                  />
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    During quiet hours, only critical alerts will be sent immediately. 
                    Other notifications will be queued for the next delivery window.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseNotificationCenter;