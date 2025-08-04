import React, { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RotateCcw, Camera, BarChart3, FileText, Clock, Shield, Target } from "lucide-react";
import SnapshotManager from "@/components/quill-revert/SnapshotManager";
import SelectiveRollback from "@/components/quill-revert/SelectiveRollback";
import ImpactAnalysis from "@/components/quill-revert/ImpactAnalysis";
import RollbackAuditTrail from "@/components/quill-revert/RollbackAuditTrail";

const QuillRevert: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <BaseLayout>
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
              <RotateCcw className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">QuillRevert</h1>
              <p className="text-muted-foreground">Smart Rollback & Version Control</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            The ultimate safety net for your data migrations. Selective rollbacks, versioned snapshots, 
            and comprehensive impact analysis provide unparalleled peace of mind.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="snapshots" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Snapshots
            </TabsTrigger>
            <TabsTrigger value="rollback" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Rollback
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Impact Analysis
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Audit Trail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-blue-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Camera className="h-6 w-6 text-blue-500" />
                    <div>
                      <CardTitle className="text-lg">Versioned Snapshots</CardTitle>
                      <Badge variant="secondary" className="mt-1">Auto-Created</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Automatic snapshots before each migration with complete versioning and metadata tracking.
                  </CardDescription>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Pre-migration snapshots</li>
                    <li>• Version management</li>
                    <li>• Metadata preservation</li>
                    <li>• Storage optimization</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab("snapshots")}
                  >
                    Manage Snapshots
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-orange-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Target className="h-6 w-6 text-orange-500" />
                    <div>
                      <CardTitle className="text-lg">Selective Rollback</CardTitle>
                      <Badge variant="secondary" className="mt-1">Precision Control</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Choose exactly which objects, records, or date ranges to revert with surgical precision.
                  </CardDescription>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Object-level selection</li>
                    <li>• Date range filtering</li>
                    <li>• Custom criteria</li>
                    <li>• Batch processing</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab("rollback")}
                  >
                    Start Rollback
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-purple-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-purple-500" />
                    <div>
                      <CardTitle className="text-lg">Impact Analysis</CardTitle>
                      <Badge variant="secondary" className="mt-1">Risk Assessment</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Comprehensive analysis showing exactly what will change before executing any rollback.
                  </CardDescription>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Records to be deleted</li>
                    <li>• Data to be reverted</li>
                    <li>• Dependency impact</li>
                    <li>• Risk scoring</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab("analysis")}
                  >
                    Analyze Impact
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-green-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-green-500" />
                    <div>
                      <CardTitle className="text-lg">Audit Trail</CardTitle>
                      <Badge variant="secondary" className="mt-1">Compliance Ready</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Complete audit trail of all rollback operations for compliance and accountability.
                  </CardDescription>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Detailed activity logs</li>
                    <li>• User attribution</li>
                    <li>• Timestamp tracking</li>
                    <li>• Export capabilities</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab("audit")}
                  >
                    View Audit Trail
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Snapshots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">Pre-Migration Snapshot</div>
                        <div className="text-sm text-muted-foreground">Salesforce → HubSpot Migration</div>
                      </div>
                      <Badge variant="default">v2.1.0</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">Weekly Backup</div>
                        <div className="text-sm text-muted-foreground">Automated System Snapshot</div>
                      </div>
                      <Badge variant="secondary">v2.0.8</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">Manual Checkpoint</div>
                        <div className="text-sm text-muted-foreground">Before Data Cleanup</div>
                      </div>
                      <Badge variant="outline">v2.0.7</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Safety Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <div className="font-medium">Multi-Level Confirmations</div>
                        <div className="text-sm text-muted-foreground">
                          Multiple confirmation steps prevent accidental rollbacks
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <div className="font-medium">Dry Run Mode</div>
                        <div className="text-sm text-muted-foreground">
                          Test rollbacks without making actual changes
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <div>
                        <div className="font-medium">Dependency Checking</div>
                        <div className="text-sm text-muted-foreground">
                          Automatic validation of data relationships
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                      <div>
                        <div className="font-medium">Rollback of Rollbacks</div>
                        <div className="text-sm text-muted-foreground">
                          Even rollback operations can be reverted
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <Shield className="h-5 w-5" />
                  Peace of Mind Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">99.99%</div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">Data Recovery Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">&lt; 5min</div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">Average Rollback Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">0</div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">Data Loss Events</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="snapshots">
            <SnapshotManager />
          </TabsContent>

          <TabsContent value="rollback">
            <SelectiveRollback />
          </TabsContent>

          <TabsContent value="analysis">
            <ImpactAnalysis />
          </TabsContent>

          <TabsContent value="audit">
            <RollbackAuditTrail />
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default QuillRevert;