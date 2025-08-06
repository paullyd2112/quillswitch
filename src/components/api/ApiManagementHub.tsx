import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Code, 
  Key, 
  Globe, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Copy,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Download,
  Upload,
  Shield,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rate_limit: number;
  created_at: string;
  last_used: string | null;
  usage_count: number;
  enabled: boolean;
  expires_at?: string;
}

interface ApiEndpoint {
  id: string;
  path: string;
  method: string;
  description: string;
  rate_limit: number;
  auth_required: boolean;
  status: 'active' | 'deprecated' | 'maintenance';
  version: string;
}

interface ApiUsageMetrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time: number;
  requests_per_hour: number;
  top_endpoints: Array<{ endpoint: string; count: number }>;
}

interface ApiUsageData {
  date: string;
  requests: number;
  success: number;
  errors: number;
  response_time: number;
}

const ApiManagementHub: React.FC = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<ApiUsageMetrics | null>(null);
  const [usageData, setUsageData] = useState<ApiUsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    permissions: [] as string[],
    rate_limit: 1000,
    expires_at: ''
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    loadApiData();
  }, [selectedTimeRange]);

  const loadApiData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadApiKeys(),
        loadEndpoints(),
        loadUsageMetrics(),
        loadUsageData()
      ]);
    } catch (error) {
      console.error('Error loading API data:', error);
      toast({
        title: "Error",
        description: "Failed to load API management data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadApiKeys = async () => {
    // Mock API keys - in production, these would be stored securely
    const mockKeys: ApiKey[] = [
      {
        id: '1',
        name: 'Production API Key',
        key: 'qs_prod_1234567890abcdef',
        permissions: ['read', 'write', 'admin'],
        rate_limit: 10000,
        created_at: '2024-01-15T00:00:00Z',
        last_used: new Date().toISOString(),
        usage_count: 45678,
        enabled: true,
        expires_at: '2024-12-31T00:00:00Z'
      },
      {
        id: '2',
        name: 'Development API Key',
        key: 'qs_dev_abcdef1234567890',
        permissions: ['read', 'write'],
        rate_limit: 1000,
        created_at: '2024-02-01T00:00:00Z',
        last_used: '2024-03-01T00:00:00Z',
        usage_count: 12345,
        enabled: true
      },
      {
        id: '3',
        name: 'Analytics Read-Only',
        key: 'qs_analytics_readonly123',
        permissions: ['read'],
        rate_limit: 5000,
        created_at: '2024-02-15T00:00:00Z',
        last_used: null,
        usage_count: 0,
        enabled: false
      }
    ];
    setApiKeys(mockKeys);
  };

  const loadEndpoints = async () => {
    // Mock API endpoints
    const mockEndpoints: ApiEndpoint[] = [
      {
        id: '1',
        path: '/api/v1/migrations',
        method: 'GET',
        description: 'List all migration projects',
        rate_limit: 100,
        auth_required: true,
        status: 'active',
        version: 'v1'
      },
      {
        id: '2',
        path: '/api/v1/migrations',
        method: 'POST',
        description: 'Create a new migration project',
        rate_limit: 10,
        auth_required: true,
        status: 'active',
        version: 'v1'
      },
      {
        id: '3',
        path: '/api/v1/migrations/{id}',
        method: 'GET',
        description: 'Get migration project details',
        rate_limit: 100,
        auth_required: true,
        status: 'active',
        version: 'v1'
      },
      {
        id: '4',
        path: '/api/v1/migrations/{id}/status',
        method: 'PUT',
        description: 'Update migration status',
        rate_limit: 50,
        auth_required: true,
        status: 'active',
        version: 'v1'
      },
      {
        id: '5',
        path: '/api/v1/analytics/usage',
        method: 'GET',
        description: 'Get usage analytics',
        rate_limit: 20,
        auth_required: true,
        status: 'active',
        version: 'v1'
      },
      {
        id: '6',
        path: '/api/v0/legacy/import',
        method: 'POST',
        description: 'Legacy import endpoint',
        rate_limit: 5,
        auth_required: true,
        status: 'deprecated',
        version: 'v0'
      }
    ];
    setEndpoints(mockEndpoints);
  };

  const loadUsageMetrics = async () => {
    // Mock usage metrics
    setUsageMetrics({
      total_requests: 156789,
      successful_requests: 152341,
      failed_requests: 4448,
      average_response_time: 247,
      requests_per_hour: 2341,
      top_endpoints: [
        { endpoint: '/api/v1/migrations', count: 45678 },
        { endpoint: '/api/v1/migrations/{id}', count: 34567 },
        { endpoint: '/api/v1/analytics/usage', count: 23456 },
        { endpoint: '/api/v1/migrations/{id}/status', count: 12345 },
        { endpoint: '/api/v1/webhooks', count: 8901 }
      ]
    });
  };

  const loadUsageData = async () => {
    // Generate mock usage data based on time range
    const hours = selectedTimeRange === '24h' ? 24 : selectedTimeRange === '7d' ? 168 : 720;
    const mockData: ApiUsageData[] = [];
    
    for (let i = hours; i >= 0; i--) {
      const date = new Date();
      date.setHours(date.getHours() - i);
      
      const baseRequests = 1000 + Math.random() * 500;
      const successRate = 0.95 + Math.random() * 0.04;
      const successful = Math.floor(baseRequests * successRate);
      const errors = Math.floor(baseRequests - successful);
      
      mockData.push({
        date: selectedTimeRange === '24h' 
          ? date.toTimeString().slice(0, 5)
          : date.toLocaleDateString(),
        requests: Math.floor(baseRequests),
        success: successful,
        errors,
        response_time: 200 + Math.random() * 100
      });
    }
    
    setUsageData(mockData);
  };

  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'qs_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const createApiKey = async () => {
    if (!newKeyData.name.trim()) {
      toast({
        title: "Error",
        description: "API key name is required",
        variant: "destructive"
      });
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyData.name,
      key: generateApiKey(),
      permissions: newKeyData.permissions,
      rate_limit: newKeyData.rate_limit,
      created_at: new Date().toISOString(),
      last_used: null,
      usage_count: 0,
      enabled: true,
      expires_at: newKeyData.expires_at || undefined
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyData({
      name: '',
      permissions: [],
      rate_limit: 1000,
      expires_at: ''
    });
    setShowNewKeyForm(false);

    toast({
      title: "API Key Created",
      description: "New API key has been created successfully"
    });
  };

  const toggleApiKey = async (keyId: string, enabled: boolean) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, enabled } : key
    ));
    
    toast({
      title: enabled ? "API Key Enabled" : "API Key Disabled",
      description: `API key has been ${enabled ? 'enabled' : 'disabled'}`
    });
  };

  const deleteApiKey = async (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
    toast({
      title: "API Key Deleted",
      description: "API key has been deleted successfully"
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "API key copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const exportApiDocumentation = () => {
    const documentation = {
      version: '1.0',
      title: 'QuillSwitch API Documentation',
      endpoints,
      authentication: 'API Key required in Authorization header',
      rate_limits: 'Varies by endpoint and API key',
      generated_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(documentation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quillswitch-api-docs.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Documentation Exported",
      description: "API documentation has been exported"
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Code className="h-6 w-6 animate-pulse" />
          <span>Loading API management...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Management Hub</h1>
          <p className="text-muted-foreground">
            Manage API keys, monitor usage, and configure endpoints
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportApiDocumentation}>
            <Download className="h-4 w-4 mr-2" />
            Export Docs
          </Button>
          <Button onClick={() => setShowNewKeyForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New API Key
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{usageMetrics?.total_requests.toLocaleString() || 0}</p>
                <p className="text-xs text-green-600">+12% from last period</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {usageMetrics ? Math.round((usageMetrics.successful_requests / usageMetrics.total_requests) * 100) : 0}%
                </p>
                <Progress 
                  value={usageMetrics ? (usageMetrics.successful_requests / usageMetrics.total_requests) * 100 : 0} 
                  className="mt-2 h-2" 
                />
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{usageMetrics?.average_response_time || 0}ms</p>
                <p className="text-xs text-green-600">-15ms from last hour</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Keys</p>
                <p className="text-2xl font-bold">{apiKeys.filter(k => k.enabled).length}</p>
                <p className="text-xs text-muted-foreground">of {apiKeys.length} total</p>
              </div>
              <Key className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">Time Range:</span>
        {(['24h', '7d', '30d'] as const).map((range) => (
          <Button
            key={range}
            variant={selectedTimeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange(range)}
          >
            {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
          </Button>
        ))}
      </div>

      {/* API Management Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Request Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="requests" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" name="Total Requests" />
                    <Area type="monotone" dataKey="errors" stackId="2" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" name="Errors" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="response_time" stroke="hsl(var(--primary))" name="Response Time (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageMetrics?.top_endpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{endpoint.endpoint}</code>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">
                        {endpoint.count.toLocaleString()} requests
                      </span>
                      <Progress 
                        value={(endpoint.count / (usageMetrics?.top_endpoints[0]?.count || 1)) * 100} 
                        className="w-20 h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          {showNewKeyForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New API Key</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input 
                      id="key-name"
                      value={newKeyData.name}
                      onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                      placeholder="e.g., Production API Key"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit">Rate Limit (requests/hour)</Label>
                    <Input 
                      id="rate-limit"
                      type="number"
                      value={newKeyData.rate_limit}
                      onChange={(e) => setNewKeyData({ ...newKeyData, rate_limit: parseInt(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expires-at">Expiration Date (optional)</Label>
                    <Input 
                      id="expires-at"
                      type="date"
                      value={newKeyData.expires_at}
                      onChange={(e) => setNewKeyData({ ...newKeyData, expires_at: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="flex flex-wrap gap-2">
                      {['read', 'write', 'admin'].map((permission) => (
                        <label key={permission} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newKeyData.permissions.includes(permission)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewKeyData({ 
                                  ...newKeyData, 
                                  permissions: [...newKeyData.permissions, permission] 
                                });
                              } else {
                                setNewKeyData({ 
                                  ...newKeyData, 
                                  permissions: newKeyData.permissions.filter(p => p !== permission) 
                                });
                              }
                            }}
                          />
                          <span className="text-sm">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={createApiKey}>Create Key</Button>
                  <Button variant="outline" onClick={() => setShowNewKeyForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Key className="h-5 w-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{key.name}</h4>
                          <Badge variant={key.enabled ? 'default' : 'secondary'}>
                            {key.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                          {key.expires_at && (
                            <Badge variant="outline">
                              Expires: {new Date(key.expires_at).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {key.key.slice(0, 20)}...
                          </code>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(key.key)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>Permissions: {key.permissions.join(', ')}</span>
                          <span>Rate Limit: {key.rate_limit}/hour</span>
                          <span>Usage: {key.usage_count.toLocaleString()}</span>
                          {key.last_used && (
                            <span>Last used: {new Date(key.last_used).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApiKey(key.id, !key.enabled)}
                      >
                        {key.enabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteApiKey(key.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpoints.map((endpoint) => (
                  <div key={endpoint.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-green-500 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            endpoint.method === 'GET' ? 'default' :
                            endpoint.method === 'POST' ? 'secondary' :
                            endpoint.method === 'PUT' ? 'outline' :
                            'destructive'
                          }>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm bg-muted px-2 py-1 rounded">{endpoint.path}</code>
                          <Badge variant={
                            endpoint.status === 'active' ? 'default' :
                            endpoint.status === 'deprecated' ? 'destructive' :
                            'secondary'
                          }>
                            {endpoint.status}
                          </Badge>
                          <Badge variant="outline">{endpoint.version}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {endpoint.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>Rate Limit: {endpoint.rate_limit}/hour</span>
                          <span>Auth: {endpoint.auth_required ? 'Required' : 'Not Required'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Success vs Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="success" fill="hsl(var(--primary))" name="Successful" />
                    <Bar dataKey="errors" fill="hsl(var(--destructive))" name="Errors" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {usageMetrics?.successful_requests.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Successful Requests</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {usageMetrics?.failed_requests.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Failed Requests</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {usageMetrics?.requests_per_hour.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Requests/Hour</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {usageMetrics?.average_response_time || 0}ms
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                </div>
                
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertDescription>
                    API performance is within normal parameters. 
                    Success rate is {usageMetrics ? Math.round((usageMetrics.successful_requests / usageMetrics.total_requests) * 100) : 0}%.
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

export default ApiManagementHub;