import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Code,
  Database,
  Globe
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ApiTest {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  expectedResponse?: string;
  payload?: string;
}

interface TestResult {
  success: boolean;
  statusCode: number;
  response: any;
  duration: number;
  error?: string;
}

const predefinedTests: ApiTest[] = [
  {
    id: 'ping',
    name: 'API Health Check',
    endpoint: '/ping',
    method: 'GET',
    description: 'Basic connectivity test to verify API is responding',
    expectedResponse: '{"status": "ok"}'
  },
  {
    id: 'auth',
    name: 'Authentication Test',
    endpoint: '/auth/validate',
    method: 'POST',
    description: 'Test API key authentication',
    payload: '{"api_key": "your_api_key"}'
  },
  {
    id: 'contacts',
    name: 'List Contacts',
    endpoint: '/contacts',
    method: 'GET',
    description: 'Retrieve contact list from CRM',
    expectedResponse: '{"data": [], "total": 0}'
  },
  {
    id: 'accounts',
    name: 'List Accounts',
    endpoint: '/accounts',
    method: 'GET',
    description: 'Retrieve account list from CRM',
    expectedResponse: '{"data": [], "total": 0}'
  },
  {
    id: 'opportunities',
    name: 'List Opportunities',
    endpoint: '/opportunities',
    method: 'GET',
    description: 'Retrieve opportunity list from CRM',
    expectedResponse: '{"data": [], "total": 0}'
  }
];

const ApiEndpointTester: React.FC = () => {
  const { toast } = useToast();
  const [selectedTest, setSelectedTest] = useState<ApiTest>(predefinedTests[0]);
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [customMethod, setCustomMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [customPayload, setCustomPayload] = useState('');
  const [isCustomTest, setIsCustomTest] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  const runTest = async (test: ApiTest) => {
    setIsRunning(true);
    const startTime = Date.now();

    try {
      const { data, error } = await supabase.functions.invoke('test-unified', {
        body: {
          test_type: 'api_endpoint',
          endpoint: test.endpoint,
          method: test.method,
          payload: test.payload ? JSON.parse(test.payload) : undefined
        }
      });

      const duration = Date.now() - startTime;

      if (error) {
        const result: TestResult = {
          success: false,
          statusCode: 500,
          response: null,
          duration,
          error: error.message
        };
        setTestResults(prev => ({ ...prev, [test.id]: result }));
        
        toast({
          title: "Test Failed",
          description: `${test.name}: ${error.message}`,
          variant: "destructive"
        });
      } else {
        const result: TestResult = {
          success: data.success,
          statusCode: data.status_code || 200,
          response: data.response,
          duration
        };
        setTestResults(prev => ({ ...prev, [test.id]: result }));
        
        toast({
          title: result.success ? "Test Passed" : "Test Failed",
          description: `${test.name}: ${result.success ? 'Successful' : 'Failed'}`,
          variant: result.success ? "default" : "destructive"
        });
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      const result: TestResult = {
        success: false,
        statusCode: 0,
        response: null,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      setTestResults(prev => ({ ...prev, [test.id]: result }));
      
      toast({
        title: "Test Error",
        description: `${test.name}: Network or system error`,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runCustomTest = async () => {
    if (!customEndpoint) {
      toast({
        title: "Invalid Test",
        description: "Please enter an endpoint URL",
        variant: "destructive"
      });
      return;
    }

    const customTest: ApiTest = {
      id: 'custom',
      name: 'Custom Test',
      endpoint: customEndpoint,
      method: customMethod,
      description: 'Custom API endpoint test',
      payload: customPayload || undefined
    };

    await runTest(customTest);
  };

  const runAllTests = async () => {
    for (const test of predefinedTests) {
      await runTest(test);
      // Brief delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getResultIcon = (result?: TestResult) => {
    if (!result) return <Clock className="h-4 w-4 text-gray-400" />;
    if (result.success) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = (result?: TestResult) => {
    if (!result) return 'secondary';
    if (result.success) return 'default';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Endpoint Testing
          </CardTitle>
          <p className="text-muted-foreground">
            Test individual API endpoints to validate functionality and response times.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predefined Tests */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Predefined Tests
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                size="sm"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Run All Tests
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {predefinedTests.map((test) => {
                const result = testResults[test.id];
                
                return (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getResultIcon(result)}
                      <div className="flex-1">
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {test.method} {test.endpoint}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {test.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {result && (
                        <>
                          <span className="text-xs text-muted-foreground">
                            {result.duration}ms
                          </span>
                          <Badge variant={getStatusColor(result)}>
                            {result.statusCode}
                          </Badge>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runTest(test)}
                        disabled={isRunning}
                      >
                        {isRunning ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Custom Test Builder */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Custom Test Builder
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint URL</Label>
              <Input
                id="endpoint"
                placeholder="/api/custom-endpoint"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select value={customMethod} onValueChange={(value: any) => setCustomMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(customMethod === 'POST' || customMethod === 'PUT') && (
              <div className="space-y-2">
                <Label htmlFor="payload">Request Payload (JSON)</Label>
                <Textarea
                  id="payload"
                  placeholder='{"key": "value"}'
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            <Button 
              onClick={runCustomTest} 
              disabled={isRunning || !customEndpoint}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Running Test...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Custom Test
                </>
              )}
            </Button>

            {testResults.custom && (
              <div className="mt-4 p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Custom Test Result</span>
                  <Badge variant={getStatusColor(testResults.custom)}>
                    {testResults.custom.statusCode}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Duration: {testResults.custom.duration}ms
                </div>
                {testResults.custom.response && (
                  <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto max-h-32">
                    {JSON.stringify(testResults.custom.response, null, 2)}
                  </pre>
                )}
                {testResults.custom.error && (
                  <div className="text-sm text-red-500 mt-2">
                    Error: {testResults.custom.error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiEndpointTester;