
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import MigrationPerformanceChart from "@/components/home/migration-demo/MigrationPerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, FileBarChart, FileText } from "lucide-react";

const ReportsDemo = () => {
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-6">
        <Tabs defaultValue="performance" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Migration Reports</h3>
            <TabsList>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="quality">Data Quality</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileBarChart className="h-5 w-5 text-brand-500" />
                <h4 className="font-medium">Performance Metrics</h4>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                Completed
              </Badge>
            </div>
            
            <div className="space-y-4">
              <MigrationPerformanceChart height={240} />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-card p-3 rounded-md border">
                  <div className="text-xs text-muted-foreground mb-1">Total Records</div>
                  <div className="font-medium text-lg">12,458</div>
                </div>
                <div className="bg-card p-3 rounded-md border">
                  <div className="text-xs text-muted-foreground mb-1">Avg. Speed</div>
                  <div className="font-medium text-lg">324 rec/s</div>
                </div>
                <div className="bg-card p-3 rounded-md border">
                  <div className="text-xs text-muted-foreground mb-1">Peak Speed</div>
                  <div className="font-medium text-lg">512 rec/s</div>
                </div>
                <div className="bg-card p-3 rounded-md border">
                  <div className="text-xs text-muted-foreground mb-1">Memory Usage</div>
                  <div className="font-medium text-lg">128 MB</div>
                </div>
                <div className="bg-card p-3 rounded-md border">
                  <div className="text-xs text-muted-foreground mb-1">Duration</div>
                  <div className="font-medium text-lg">4m 12s</div>
                </div>
                <div className="bg-card p-3 rounded-md border">
                  <div className="text-xs text-muted-foreground mb-1">Data Transferred</div>
                  <div className="font-medium text-lg">24.6 MB</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="quality" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-500" />
                <h4 className="font-medium">Data Quality Summary</h4>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                98.7% Valid
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-md border">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div className="font-medium">Contacts</div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">5,246 valid</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-amber-600">54 warnings</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="font-medium">Companies</div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">1,845 valid</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-amber-600">23 warnings</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="font-medium">Deals</div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">962 valid</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-amber-600">12 warnings</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="font-medium">Tasks</div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">4,185 valid</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-amber-600">84 warnings</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-md border border-amber-200 dark:border-amber-700/30">
                  <h5 className="text-amber-700 dark:text-amber-400 font-medium mb-2">Common Warnings</h5>
                  <ul className="space-y-1 text-sm text-amber-600 dark:text-amber-300">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Email format inconsistencies (43 records)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Missing phone country codes (38 records)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Incomplete addresses (92 records)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-md border border-green-200 dark:border-green-700/30">
                  <h5 className="text-green-700 dark:text-green-400 font-medium mb-2">Auto-Corrections</h5>
                  <ul className="space-y-1 text-sm text-green-600 dark:text-green-300">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Standardized 128 phone formats</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Fixed 86 duplicate entries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Normalized 215 address formats</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="errors" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-500" />
                <h4 className="font-medium">Error Analysis</h4>
              </div>
              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
                47 Errors
              </Badge>
            </div>
            
            <div className="bg-card rounded-md border overflow-hidden">
              <div className="divide-y">
                <div className="p-3 bg-red-50 dark:bg-red-900/10 border-l-4 border-l-red-500">
                  <div className="flex justify-between">
                    <h5 className="font-medium text-red-700 dark:text-red-400">API Rate Limit Exceeded</h5>
                    <span className="text-sm text-red-600 dark:text-red-300">12 occurrences</span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    Destination API rate limit exceeded during contacts migration. Automatic retry with backoff applied.
                  </p>
                </div>
                
                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-l-amber-500">
                  <div className="flex justify-between">
                    <h5 className="font-medium text-amber-700 dark:text-amber-400">Data Schema Mismatch</h5>
                    <span className="text-sm text-amber-600 dark:text-amber-300">18 occurrences</span>
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                    Custom field formats incompatible between source and destination. Applied transformation rules.
                  </p>
                </div>
                
                <div className="p-3 bg-red-50 dark:bg-red-900/10 border-l-4 border-l-red-500">
                  <div className="flex justify-between">
                    <h5 className="font-medium text-red-700 dark:text-red-400">Record Validation Error</h5>
                    <span className="text-sm text-red-600 dark:text-red-300">17 occurrences</span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    Destination rejected records due to validation failures. See validation report for details.
                  </p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              View Detailed Error Report
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportsDemo;
