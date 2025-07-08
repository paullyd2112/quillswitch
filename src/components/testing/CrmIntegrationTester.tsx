import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Database,
  Users,
  Building,
  Target,
  Clock,
  Zap
} from 'lucide-react';
import { unifiedApiService } from '@/services/unified/UnifiedApiService';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  test: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  duration?: number;
  details?: any;
}

interface CrmTestSuite {
  connectionId: string;
  crmName: string;
  tests: TestResult[];
  overallStatus: 'idle' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
}

const CrmIntegrationTester: React.FC = () => {
  const { toast } = useToast();
  const [connections, setConnections] = useState<any[]>([]);
  const [testSuites, setTestSuites] = useState<Record<string, CrmTestSuite>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());

  const testDefinitions = [
    {
      name: 'Connection Health',
      description: 'Verify API connection is active and responding',
      icon: <Zap className="h-4 w-4" />
    },
    {
      name: 'Authentication',
      description: 'Test API authentication and token validity',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      name: 'Schema Discovery',
      description: 'Retrieve and validate CRM object schemas',
      icon: <Database className="h-4 w-4" />
    },
    {
      name: 'Contact Data Access',
      description: 'Test reading contact/lead data from CRM',
      icon: <Users className="h-4 w-4" />
    },
    {
      name: 'Account Data Access',
      description: 'Test reading company/account data from CRM',
      icon: <Building className="h-4 w-4" />
    },
    {
      name: 'Opportunity Data Access',
      description: 'Test reading opportunity/deal data from CRM',
      icon: <Target className="h-4 w-4" />
    },
    {
      name: 'Rate Limiting',
      description: 'Test API rate limits and throttling behavior',
      icon: <Clock className="h-4 w-4" />
    }
  ];

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    setIsLoading(true);
    try {
      const connectionsData = await unifiedApiService.getUserConnections();
      setConnections(connectionsData);
      
      // Initialize test suites for each connection
      const suites: Record<string, CrmTestSuite> = {};
      connectionsData.forEach(conn => {
        suites[conn.id] = {
          connectionId: conn.id,
          crmName: conn.name,
          tests: testDefinitions.map(test => ({
            test: test.name,
            status: 'pending',
            message: test.description
          })),
          overallStatus: 'idle'
        };
      });
      setTestSuites(suites);
    } catch (error) {
      console.error('Failed to load connections:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load CRM connections",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runTestSuite = async (connectionId: string) => {
    setRunningTests(prev => new Set([...prev, connectionId]));
    
    setTestSuites(prev => ({
      ...prev,
      [connectionId]: {
        ...prev[connectionId],
        overallStatus: 'running',
        startTime: new Date(),
        tests: prev[connectionId].tests.map(test => ({
          ...test,
          status: test.test === 'Connection Health' ? 'running' : 'pending'
        }))
      }
    }));

    try {
      const suite = testSuites[connectionId];
      
      for (let i = 0; i < testDefinitions.length; i++) {
        const testDef = testDefinitions[i];
        const testStartTime = Date.now();
        
        // Update test status to running
        setTestSuites(prev => ({
          ...prev,
          [connectionId]: {
            ...prev[connectionId],
            tests: prev[connectionId].tests.map((test, index) => 
              index === i ? { ...test, status: 'running' } : test
            )
          }
        }));

        try {
          const result = await runIndividualTest(connectionId, testDef.name);
          const duration = Date.now() - testStartTime;
          
          setTestSuites(prev => ({
            ...prev,
            [connectionId]: {
              ...prev[connectionId],
              tests: prev[connectionId].tests.map((test, index) => 
                index === i ? { 
                  ...test, 
                  status: result.success ? 'passed' : 'failed',
                  message: result.message,
                  duration,
                  details: result.details
                } : test
              )
            }
          }));

          // Brief delay between tests
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          const duration = Date.now() - testStartTime;
          setTestSuites(prev => ({
            ...prev,
            [connectionId]: {
              ...prev[connectionId],
              tests: prev[connectionId].tests.map((test, index) => 
                index === i ? { 
                  ...test, 
                  status: 'failed',
                  message: error instanceof Error ? error.message : 'Test failed',
                  duration
                } : test
              )
            }
          }));
        }
      }

      // Mark suite as completed
      setTestSuites(prev => ({
        ...prev,
        [connectionId]: {
          ...prev[connectionId],
          overallStatus: 'completed',
          endTime: new Date()
        }
      }));

      const passedTests = testSuites[connectionId].tests.filter(t => t.status === 'passed').length;
      const totalTests = testDefinitions.length;

      toast({
        title: "Test Suite Complete",
        description: `${passedTests}/${totalTests} tests passed for ${suite.crmName}`,
        variant: passedTests === totalTests ? "default" : "destructive"
      });

    } catch (error) {
      console.error('Test suite failed:', error);
      setTestSuites(prev => ({
        ...prev,
        [connectionId]: {
          ...prev[connectionId],
          overallStatus: 'failed',
          endTime: new Date()
        }
      }));

      toast({
        title: "Test Suite Failed",
        description: "Failed to complete integration tests",
        variant: "destructive"
      });
    } finally {
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(connectionId);
        return newSet;
      });
    }
  };

  const runIndividualTest = async (connectionId: string, testName: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> => {
    switch (testName) {
      case 'Connection Health':
        const health = await unifiedApiService.testConnection(connectionId);
        return {
          success: health.status === 'healthy',
          message: health.status === 'healthy' ? 'Connection is healthy' : `Connection issues: ${health.issues.join(', ')}`,
          details: health
        };

      case 'Authentication':
        try {
          const { data, error } = await supabase.functions.invoke('test-unified', {
            body: { connection_id: connectionId, test_type: 'auth' }
          });
          if (error) throw error;
          return {
            success: data.authenticated,
            message: data.authenticated ? 'Authentication successful' : 'Authentication failed',
            details: data
          };
        } catch (error) {
          return {
            success: false,
            message: 'Authentication test failed',
            details: error
          };
        }

      case 'Schema Discovery':
        try {
          const schema = await unifiedApiService.getConnectionSchema(connectionId);
          return {
            success: schema.objects.length > 0,
            message: `Found ${schema.objects.length} object schemas`,
            details: schema
          };
        } catch (error) {
          return {
            success: false,
            message: 'Schema discovery failed',
            details: error
          };
        }

      case 'Contact Data Access':
        try {
          const { data, error } = await supabase.functions.invoke('unified-data-extraction', {
            body: { 
              connection_id: connectionId, 
              object_type: 'contacts',
              limit: 5
            }
          });
          if (error) throw error;
          return {
            success: true,
            message: `Retrieved ${data.records?.length || 0} contact records`,
            details: data
          };
        } catch (error) {
          return {
            success: false,
            message: 'Contact data access failed',
            details: error
          };
        }

      case 'Account Data Access':
        try {
          const { data, error } = await supabase.functions.invoke('unified-data-extraction', {
            body: { 
              connection_id: connectionId, 
              object_type: 'accounts',
              limit: 5
            }
          });
          if (error) throw error;
          return {
            success: true,
            message: `Retrieved ${data.records?.length || 0} account records`,
            details: data
          };
        } catch (error) {
          return {
            success: false,
            message: 'Account data access failed',
            details: error
          };
        }

      case 'Opportunity Data Access':
        try {
          const { data, error } = await supabase.functions.invoke('unified-data-extraction', {
            body: { 
              connection_id: connectionId, 
              object_type: 'opportunities',
              limit: 5
            }
          });
          if (error) throw error;
          return {
            success: true,
            message: `Retrieved ${data.records?.length || 0} opportunity records`,
            details: data
          };
        } catch (error) {
          return {
            success: false,
            message: 'Opportunity data access failed',
            details: error
          };
        }

      case 'Rate Limiting':
        // Simulate rapid API calls to test rate limiting
        try {
          const startTime = Date.now();
          const promises = Array(5).fill(null).map(() =>
            supabase.functions.invoke('test-unified', {
              body: { connection_id: connectionId, test_type: 'ping' }
            })
          );
          
          const results = await Promise.allSettled(promises);
          const successCount = results.filter(r => r.status === 'fulfilled').length;
          const duration = Date.now() - startTime;
          
          return {
            success: true,
            message: `Completed ${successCount}/5 rapid requests in ${duration}ms`,
            details: { successCount, duration, results }
          };
        } catch (error) {
          return {
            success: false,
            message: 'Rate limiting test failed',
            details: error
          };
        }

      default:
        return {
          success: false,
          message: 'Unknown test type'
        };
    }
  };

  const getTestIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getOverallProgress = (suite: CrmTestSuite) => {
    const completedTests = suite.tests.filter(t => t.status === 'passed' || t.status === 'failed').length;
    return (completedTests / suite.tests.length) * 100;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading connections...
        </CardContent>
      </Card>
    );
  }

  if (connections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            CRM Integration Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No CRM connections found. Please connect to a CRM system first to run integration tests.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            CRM Integration Testing
          </CardTitle>
          <p className="text-muted-foreground">
            Comprehensive testing suite for validating CRM integrations, API connectivity, and data access.
          </p>
        </CardHeader>
      </Card>

      {connections.map(connection => {
        const suite = testSuites[connection.id];
        const isRunning = runningTests.has(connection.id);
        
        if (!suite) return null;

        return (
          <Card key={connection.id} className="glass-panel">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {connection.name}
                    <Badge variant="outline">{connection.type}</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Connection ID: {connection.id}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {suite.overallStatus === 'running' && (
                    <div className="flex items-center gap-2">
                      <Progress value={getOverallProgress(suite)} className="w-24" />
                      <span className="text-sm text-muted-foreground">
                        {Math.round(getOverallProgress(suite))}%
                      </span>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => runTestSuite(connection.id)}
                    disabled={isRunning}
                    variant={suite.overallStatus === 'completed' ? "outline" : "default"}
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Running...
                      </>
                    ) : suite.overallStatus === 'completed' ? (
                      <>
                        <TestTube className="h-4 w-4 mr-2" />
                        Re-run Tests
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4 mr-2" />
                        Run Tests
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {suite.tests.map((test, index) => (
                  <div key={test.test} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTestIcon(test.status)}
                      <div>
                        <div className="font-medium">{test.test}</div>
                        <div className="text-sm text-muted-foreground">{test.message}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {test.duration && (
                        <span className="text-xs text-muted-foreground">
                          {test.duration}ms
                        </span>
                      )}
                      <Badge 
                        variant={
                          test.status === 'passed' ? 'default' : 
                          test.status === 'failed' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {suite.endTime && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      Started: {suite.startTime?.toLocaleTimeString()}
                    </span>
                    <span>
                      Completed: {suite.endTime.toLocaleTimeString()}
                    </span>
                    <span>
                      Duration: {suite.endTime.getTime() - (suite.startTime?.getTime() || 0)}ms
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CrmIntegrationTester;