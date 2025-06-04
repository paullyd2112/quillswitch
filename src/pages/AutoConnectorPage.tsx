
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, Zap, Target, Shield, Clock } from 'lucide-react';
import AutoConnectorDashboard from '@/components/autoConnector/AutoConnectorDashboard';

const AutoConnectorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ecosystem Auto-Connector</h1>
              <p className="text-muted-foreground">
                Automatically detect and reconnect your business integrations after migration
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Target className="h-3 w-3 mr-1" />
              Smart Detection
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Zap className="h-3 w-3 mr-1" />
              Auto-Reconnection
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Shield className="h-3 w-3 mr-1" />
              Guided Setup
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <Clock className="h-3 w-3 mr-1" />
              Time Savings
            </Badge>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-8">
          <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Revolutionary Integration Recovery:</strong> Our AI analyzes your CRM data patterns 
              to automatically detect connected business tools and creates a comprehensive reconnection plan. 
              Save hours of manual work and avoid missing critical integrations.
            </AlertDescription>
          </Alert>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-purple-600" />
                Smart Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced pattern recognition analyzes your CRM data to identify connected tools 
                like marketing automation, sales engagement, support systems, and more.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-green-600" />
                Auto-Reconnection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fully automated reconnection for supported integrations using secure API 
                credentials and OAuth flows. No manual configuration required.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                Guided Assistance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Step-by-step guidance for integrations requiring manual setup, with 
                pre-filled configurations and detailed instructions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <AutoConnectorDashboard 
          projectId="demo_project_001"
          onComplete={(results) => {
            console.log('Auto-connector scan completed:', results);
          }}
        />

        {/* How It Works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How the Auto-Connector Works</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <h4 className="font-medium mb-2">Data Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Scans your CRM data for integration signatures and patterns
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h4 className="font-medium mb-2">Smart Matching</h4>
                <p className="text-sm text-muted-foreground">
                  Matches patterns to our database of 100+ business tools
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h4 className="font-medium mb-2">Auto-Reconnect</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically reconnects supported integrations
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <h4 className="font-medium mb-2">Guided Setup</h4>
                <p className="text-sm text-muted-foreground">
                  Provides step-by-step guidance for remaining tools
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default AutoConnectorPage;
