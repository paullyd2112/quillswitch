
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Activity, 
  Users, 
  Database,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import PremiumCard from "@/components/ui-elements/PremiumCard";
import { FloatingElement, PulseGlow } from "@/components/animations/InteractiveElements";

const PremiumDashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Premium Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Migration Control Center
            </h1>
            <p className="text-slate-400 text-lg mt-2">
              Enterprise-grade migration orchestration and monitoring
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2 bg-slate-800/50 border-slate-600 hover:bg-slate-700/50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Zap className="h-4 w-4" />
              New Migration
            </Button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FloatingElement delay={0}>
            <PremiumCard glowEffect={true} hoverEffect={true}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wide">Total Migrations</p>
                  <p className="text-3xl font-bold text-white mt-1">142</p>
                  <div className="flex items-center gap-1 text-green-400 text-sm mt-2">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12% this month</span>
                  </div>
                </div>
                <PulseGlow color="blue" intensity="subtle">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Database className="h-6 w-6 text-blue-400" />
                  </div>
                </PulseGlow>
              </div>
            </PremiumCard>
          </FloatingElement>

          <FloatingElement delay={0.1}>
            <PremiumCard glowEffect={true} hoverEffect={true}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wide">Success Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">99.7%</p>
                  <div className="flex items-center gap-1 text-green-400 text-sm mt-2">
                    <TrendingUp className="h-3 w-3" />
                    <span>+0.3% improvement</span>
                  </div>
                </div>
                <PulseGlow color="green" intensity="subtle">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Shield className="h-6 w-6 text-green-400" />
                  </div>
                </PulseGlow>
              </div>
            </PremiumCard>
          </FloatingElement>

          <FloatingElement delay={0.2}>
            <PremiumCard glowEffect={true} hoverEffect={true}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wide">Records Migrated</p>
                  <p className="text-3xl font-bold text-white mt-1">2.4M</p>
                  <div className="flex items-center gap-1 text-blue-400 text-sm mt-2">
                    <Activity className="h-3 w-3" />
                    <span>24/7 processing</span>
                  </div>
                </div>
                <PulseGlow color="purple" intensity="subtle">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                </PulseGlow>
              </div>
            </PremiumCard>
          </FloatingElement>

          <FloatingElement delay={0.3}>
            <PremiumCard glowEffect={true} hoverEffect={true}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wide">AI Accuracy</p>
                  <p className="text-3xl font-bold text-white mt-1">99.9%</p>
                  <div className="flex items-center gap-1 text-blue-400 text-sm mt-2">
                    <Zap className="h-3 w-3" />
                    <span>ML-powered</span>
                  </div>
                </div>
                <PulseGlow color="blue" intensity="moderate">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-blue-400" />
                  </div>
                </PulseGlow>
              </div>
            </PremiumCard>
          </FloatingElement>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Overview</TabsTrigger>
            <TabsTrigger value="migrations" className="data-[state=active]:bg-slate-700">Active Migrations</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">Analytics</TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-slate-700">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Migrations */}
              <PremiumCard 
                title="Active Migrations" 
                description="Real-time migration status and progress"
                glowEffect={true}
              >
                <div className="space-y-4">
                  {[
                    { name: "Salesforce → HubSpot", progress: 87, status: "Processing" },
                    { name: "Pipedrive → Zoho", progress: 45, status: "Mapping" },
                    { name: "Monday → Airtable", progress: 23, status: "Validation" }
                  ].map((migration, index) => (
                    <FloatingElement key={index} delay={index * 0.1}>
                      <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-white">{migration.name}</span>
                          <span className="text-sm text-blue-400">{migration.status}</span>
                        </div>
                        <Progress value={migration.progress} className="h-2" />
                        <div className="flex justify-between text-sm text-slate-400 mt-1">
                          <span>{migration.progress}% complete</span>
                          <span>ETA: 2h 15m</span>
                        </div>
                      </div>
                    </FloatingElement>
                  ))}
                </div>
              </PremiumCard>

              {/* System Health */}
              <PremiumCard 
                title="System Health" 
                description="Infrastructure and performance monitoring"
                glowEffect={true}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-800/30 rounded-xl">
                    <div className="text-2xl font-bold text-green-400">98.9%</div>
                    <div className="text-sm text-slate-400">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/30 rounded-xl">
                    <div className="text-2xl font-bold text-blue-400">1.2s</div>
                    <div className="text-sm text-slate-400">Avg Response</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/30 rounded-xl">
                    <div className="text-2xl font-bold text-purple-400">45GB</div>
                    <div className="text-sm text-slate-400">Data Processed</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/30 rounded-xl">
                    <div className="text-2xl font-bold text-yellow-400">12</div>
                    <div className="text-sm text-slate-400">Active Workers</div>
                  </div>
                </div>
              </PremiumCard>
            </div>
          </TabsContent>

          <TabsContent value="migrations">
            <PremiumCard 
              title="Migration Queue" 
              description="Manage and monitor all migration processes"
              glowEffect={true}
            >
              <div className="text-center py-12">
                <Globe className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Migration management interface coming soon</p>
              </div>
            </PremiumCard>
          </TabsContent>

          <TabsContent value="analytics">
            <PremiumCard 
              title="Performance Analytics" 
              description="Deep insights into migration performance and trends"
              glowEffect={true}
            >
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Advanced analytics dashboard coming soon</p>
              </div>
            </PremiumCard>
          </TabsContent>

          <TabsContent value="monitoring">
            <PremiumCard 
              title="Real-time Monitoring" 
              description="Live system monitoring and alerting"
              glowEffect={true}
            >
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Monitoring dashboard coming soon</p>
              </div>
            </PremiumCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PremiumDashboard;
