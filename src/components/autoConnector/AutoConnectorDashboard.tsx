
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Target,
  ArrowRight,
  Lightbulb,
  Shield
} from 'lucide-react';
import { autoConnectorService, DetectedIntegration, AutoConnectorResult } from '@/services/autoConnector/autoConnectorService';
import DetectedIntegrationCard from './DetectedIntegrationCard';
import ReconnectionPlanView from './ReconnectionPlanView';
import { toast } from 'sonner';

interface AutoConnectorDashboardProps {
  projectId: string;
  onComplete?: (results: AutoConnectorResult) => void;
}

const AutoConnectorDashboard: React.FC<AutoConnectorDashboardProps> = ({
  projectId,
  onComplete
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<AutoConnectorResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const startIntegrationScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      toast.info('Starting integration detection scan...');
      
      // Simulate progressive scanning
      const progressSteps = [
        { progress: 20, message: 'Analyzing CRM data structure...' },
        { progress: 40, message: 'Detecting integration patterns...' },
        { progress: 60, message: 'Matching integration signatures...' },
        { progress: 80, message: 'Calculating reconnection capabilities...' },
        { progress: 100, message: 'Generating reconnection plan...' }
      ];
      
      for (const step of progressSteps) {
        setScanProgress(step.progress);
        toast.info(step.message);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Mock CRM data for demonstration
      const mockCrmData = {
        campaigns: ['email_campaigns', 'nurture_sequences'],
        sequences: ['sales_cadences', 'follow_up_sequences'],
        dashboards: ['sales_metrics', 'marketing_roi'],
        calendar_events: ['meeting_sync', 'activity_logging'],
        cases: ['support_tickets', 'escalation_records']
      };
      
      const detectedIntegrations = await autoConnectorService.detectIntegrations(mockCrmData);
      const reconnectionPlan = await autoConnectorService.createReconnectionPlan(detectedIntegrations);
      
      const autoReconnectable = detectedIntegrations.filter(i => i.reconnectionCapability === 'full').length;
      const manualSetupRequired = detectedIntegrations.filter(i => ['partial', 'basic', 'manual'].includes(i.reconnectionCapability)).length;
      
      const scanResults: AutoConnectorResult = {
        totalDetected: detectedIntegrations.length,
        autoReconnectable,
        manualSetupRequired,
        integrations: detectedIntegrations,
        reconnectionPlan
      };
      
      setResults(scanResults);
      
      toast.success(`Scan complete! Found ${detectedIntegrations.length} integrations`);
      onComplete?.(scanResults);
      
    } catch (error) {
      console.error('Integration scan failed:', error);
      toast.error('Integration scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const executeAutoReconnection = async () => {
    if (!results) return;
    
    setIsReconnecting(true);
    
    try {
      toast.info('Starting automatic reconnection...');
      
      const reconnectionResult = await autoConnectorService.executeAutoReconnection(results.integrations);
      
      toast.success(
        `Reconnection complete! ${reconnectionResult.successful.length} integrations reconnected automatically`
      );
      
      if (reconnectionResult.failed.length > 0) {
        toast.warning(
          `${reconnectionResult.failed.length} integrations need manual attention`
        );
      }
      
    } catch (error) {
      console.error('Auto-reconnection failed:', error);
      toast.error('Auto-reconnection encountered errors. Check individual integrations.');
    } finally {
      setIsReconnecting(false);
    }
  };

  const getOverallStatus = () => {
    if (!results) return { color: 'bg-gray-500', label: 'Not Started' };
    
    const autoReconnectablePercent = (results.autoReconnectable / results.totalDetected) * 100;
    
    if (autoReconnectablePercent >= 70) return { color: 'bg-green-500', label: 'Excellent' };
    if (autoReconnectablePercent >= 50) return { color: 'bg-blue-500', label: 'Good' };
    if (autoReconnectablePercent >= 30) return { color: 'bg-yellow-500', label: 'Moderate' };
    return { color: 'bg-orange-500', label: 'Manual Work Needed' };
  };

  const status = getOverallStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-purple-600" />
            Ecosystem Auto-Connector
          </h2>
          <p className="text-muted-foreground">
            Automatically detect and reconnect your business tools after migration
          </p>
        </div>
        
        <Badge className={status.color}>
          {status.label}
        </Badge>
      </div>

      {/* Main Action Card */}
      {!results && (
        <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-purple-600" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Ready to Scan for Integrations</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              I'll analyze your CRM data to detect connected business tools and create 
              an automated reconnection plan for your new system.
            </p>
            
            {isScanning ? (
              <div className="w-full max-w-md space-y-4">
                <Progress value={scanProgress} className="h-2" />
                <p className="text-sm text-center">Scanning... {scanProgress}%</p>
              </div>
            ) : (
              <Button onClick={startIntegrationScan} size="lg" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Start Integration Scan
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Dashboard */}
      {results && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="integrations">Detected Integrations</TabsTrigger>
            <TabsTrigger value="plan">Reconnection Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{results.totalDetected}</div>
                  <div className="text-sm text-muted-foreground">Total Found</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{results.autoReconnectable}</div>
                  <div className="text-sm text-muted-foreground">Auto-Reconnectable</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{results.manualSetupRequired}</div>
                  <div className="text-sm text-muted-foreground">Manual Setup</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((results.autoReconnectable / results.totalDetected) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Auto Success Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={executeAutoReconnection}
                disabled={isReconnecting || results.autoReconnectable === 0}
                className="flex items-center gap-2"
              >
                {isReconnecting ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Reconnecting...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Auto-Reconnect ({results.autoReconnectable})
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={() => setActiveTab('plan')}>
                <Target className="h-4 w-4 mr-2" />
                View Full Plan
              </Button>
            </div>

            {/* Key Insights */}
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Detection:</strong> Found {results.totalDetected} integrations with {' '}
                {Math.round((results.autoReconnectable / results.totalDetected) * 100)}% auto-reconnection capability. 
                This will save approximately {results.reconnectionPlan.reduce((acc, step) => acc + step.estimatedTime, 0)} minutes 
                of manual setup time.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.integrations.map(integration => (
                <DetectedIntegrationCard 
                  key={integration.id}
                  integration={integration}
                  onReconnect={(id) => {
                    toast.info(`Starting reconnection for ${integration.name}...`);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="plan">
            <ReconnectionPlanView 
              plan={results.reconnectionPlan}
              integrations={results.integrations}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AutoConnectorDashboard;
