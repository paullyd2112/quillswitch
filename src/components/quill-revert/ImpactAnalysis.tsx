import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, AlertTriangle, TrendingDown, TrendingUp, Shield, Zap, Target, Users } from "lucide-react";

interface ImpactMetrics {
  recordsToRevert: number;
  recordsToDelete: number;
  recordsToRestore: number;
  recordsUnaffected: number;
  dependentRecords: number;
  estimatedDuration: string;
  riskScore: "low" | "medium" | "high";
  dataIntegrityScore: number;
}

interface ObjectImpact {
  objectType: string;
  totalRecords: number;
  affectedRecords: number;
  revertCount: number;
  deleteCount: number;
  restoreCount: number;
  riskLevel: "low" | "medium" | "high";
  dependencies: string[];
}

const mockMetrics: ImpactMetrics = {
  recordsToRevert: 15750,
  recordsToDelete: 3200,
  recordsToRestore: 1850,
  recordsUnaffected: 104200,
  dependentRecords: 8400,
  estimatedDuration: "18 minutes",
  riskScore: "medium",
  dataIntegrityScore: 94
};

const mockObjectImpacts: ObjectImpact[] = [
  {
    objectType: "Accounts",
    totalRecords: 15000,
    affectedRecords: 4500,
    revertCount: 3200,
    deleteCount: 800,
    restoreCount: 500,
    riskLevel: "low",
    dependencies: ["Contacts", "Opportunities", "Cases"]
  },
  {
    objectType: "Contacts",
    totalRecords: 45000,
    affectedRecords: 12000,
    revertCount: 8500,
    deleteCount: 2100,
    restoreCount: 1400,
    riskLevel: "medium",
    dependencies: ["Activities", "Opportunities"]
  },
  {
    objectType: "Opportunities",
    totalRecords: 8500,
    affectedRecords: 2800,
    revertCount: 2400,
    deleteCount: 300,
    restoreCount: 100,
    riskLevel: "high",
    dependencies: ["OpportunityLineItems", "Activities"]
  }
];

const ImpactAnalysis: React.FC = () => {
  const [analysisComplete, setAnalysisComplete] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const getRiskBadge = (risk: string) => {
    const variants = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };
    
    return (
      <Badge className={variants[risk as keyof typeof variants]}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
      </Badge>
    );
  };

  const getImpactPercentage = (affected: number, total: number) => {
    return Math.round((affected / total) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Rollback Impact Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of the proposed rollback operation's impact on your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analysisComplete ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="objects">Objects</TabsTrigger>
                <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{mockMetrics.recordsToRevert.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Records to Revert</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="text-2xl font-bold text-red-600">{mockMetrics.recordsToDelete.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Records to Delete</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="text-2xl font-bold text-green-600">{mockMetrics.recordsToRestore.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Records to Restore</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-2xl font-bold text-gray-600">{mockMetrics.recordsUnaffected.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Unaffected Records</div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Operation Summary
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Estimated Duration:</span>
                        <Badge variant="outline">{mockMetrics.estimatedDuration}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Risk Level:</span>
                        {getRiskBadge(mockMetrics.riskScore)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Data Integrity Score:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={mockMetrics.dataIntegrityScore} className="w-20" />
                          <span className="font-medium">{mockMetrics.dataIntegrityScore}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Dependent Records:</span>
                        <span className="font-medium">{mockMetrics.dependentRecords.toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Impact Distribution
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Records to Revert</span>
                          <span>75.3%</span>
                        </div>
                        <Progress value={75.3} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Records to Delete</span>
                          <span>15.3%</span>
                        </div>
                        <Progress value={15.3} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Records to Restore</span>
                          <span>8.8%</span>
                        </div>
                        <Progress value={8.8} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Dependent Records</span>
                          <span>40.1%</span>
                        </div>
                        <Progress value={40.1} className="h-2" />
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="objects" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Object-Level Impact Analysis</CardTitle>
                    <CardDescription>
                      Detailed breakdown of how each object type will be affected
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Object Type</TableHead>
                          <TableHead>Total Records</TableHead>
                          <TableHead>Impact %</TableHead>
                          <TableHead>Revert</TableHead>
                          <TableHead>Delete</TableHead>
                          <TableHead>Restore</TableHead>
                          <TableHead>Risk Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockObjectImpacts.map((impact) => (
                          <TableRow key={impact.objectType}>
                            <TableCell className="font-medium">{impact.objectType}</TableCell>
                            <TableCell>{impact.totalRecords.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={getImpactPercentage(impact.affectedRecords, impact.totalRecords)} 
                                  className="w-16" 
                                />
                                <span className="text-sm">
                                  {getImpactPercentage(impact.affectedRecords, impact.totalRecords)}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{impact.revertCount.toLocaleString()}</TableCell>
                            <TableCell className="text-red-600">{impact.deleteCount.toLocaleString()}</TableCell>
                            <TableCell className="text-green-600">{impact.restoreCount.toLocaleString()}</TableCell>
                            <TableCell>{getRiskBadge(impact.riskLevel)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dependencies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Dependency Impact Map
                    </CardTitle>
                    <CardDescription>
                      How the rollback will affect related objects and their relationships
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {mockObjectImpacts.map((impact) => (
                        <Card key={impact.objectType} className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">{impact.objectType}</h4>
                            {getRiskBadge(impact.riskLevel)}
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">
                            Rolling back {impact.affectedRecords.toLocaleString()} records will affect:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {impact.dependencies.map((dep) => (
                              <Badge key={dep} variant="outline">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">✅ Safe to Proceed</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                      <li>• Data integrity score is above 90%</li>
                      <li>• No critical system dependencies affected</li>
                      <li>• Rollback duration is within acceptable limits</li>
                      <li>• Pre-rollback snapshot will be created automatically</li>
                    </ul>
                  </Card>

                  <Card className="p-6 border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">⚠️ Recommendations</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                      <li>• Consider rolling back Opportunities separately due to high risk</li>
                      <li>• Schedule during low-activity hours</li>
                      <li>• Notify users of potential data changes</li>
                      <li>• Run in preview mode first to validate results</li>
                    </ul>
                  </Card>
                </div>

                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Mitigation Strategies</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Before Rollback:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Create additional backup snapshot</li>
                        <li>• Export critical reports</li>
                        <li>• Validate user permissions</li>
                        <li>• Test rollback in sandbox environment</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">After Rollback:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Verify data integrity</li>
                        <li>• Run validation reports</li>
                        <li>• Update user training materials</li>
                        <li>• Monitor system performance</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
              <p className="text-muted-foreground mb-4">
                Please configure and run a rollback analysis to see the impact assessment.
              </p>
              <Button onClick={() => setAnalysisComplete(true)}>
                Run Sample Analysis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisComplete && (
        <div className="flex justify-end gap-3">
          <Button variant="outline">
            Export Analysis
          </Button>
          <Button variant="outline">
            Run Preview Mode
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700">
            Proceed with Rollback
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImpactAnalysis;