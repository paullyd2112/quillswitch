
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Shield, 
  Zap, 
  Target, 
  CheckCircle, 
  ArrowRight,
  Users,
  BarChart3,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PlatformOverview: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
              <Database className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">QuillSwitch Platform</h1>
              <p className="text-muted-foreground">
                Complete CRM migration and ecosystem reconnection solution
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Enterprise Ready
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Shield className="h-3 w-3 mr-1" />
              SOC 2 Compliant
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>

        {/* Platform Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Secure Migration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Enterprise-grade data migration with OAuth 2.0, encryption at rest, 
                and comprehensive audit trails.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  OAuth 2.0 Authentication
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  End-to-end Encryption
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Real-time Validation
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Auto-Connector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered integration detection and automatic reconnection 
                for your business ecosystem.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Smart Detection
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Automatic Reconnection
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Guided Setup
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Analytics & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive monitoring and reporting throughout the 
                migration process with actionable insights.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Real-time Monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Data Quality Reports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Performance Metrics
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Platform Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Data Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">10x</div>
                <div className="text-sm text-muted-foreground">Faster Migration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
                <div className="text-sm text-muted-foreground">Supported Integrations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Expert Support</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Start Your Migration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Connect your CRM systems and begin the migration process with 
                our guided setup wizard.
              </p>
              <Link to="/connections">
                <Button className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Connect Systems
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Try Auto-Connector</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Experience our revolutionary AI-powered integration detection 
                and automatic reconnection system.
              </p>
              <Link to="/auto-connector">
                <Button variant="outline" className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Launch Auto-Connector
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default PlatformOverview;
