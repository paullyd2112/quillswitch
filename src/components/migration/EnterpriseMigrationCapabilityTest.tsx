
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { BarChart, FileText, Settings, GitBranch, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { testEnterpriseCapabilities, TransferProgress } from "@/services/migration/transferService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EnterpriseMigrationCapabilityTest = () => {
  const [testInProgress, setTestInProgress] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [progress, setProgress] = useState<TransferProgress | null>(null);
  const [recordCounts, setRecordCounts] = useState({
    contacts: 5000,
    accounts: 1000,
    opportunities: 500,
    cases: 200,
    activities: 2000
  });
  const [activeTab, setActiveTab] = useState("configuration");
  
  const handleCountChange = (dataType: string, value: number) => {
    setRecordCounts(prev => ({
      ...prev,
      [dataType]: value
    }));
  };
  
  const totalRecords = Object.values(recordCounts).reduce((sum, count) => sum + count, 0);
  
  const startCapabilityTest = async () => {
    setTestInProgress(true);
    setTestResults(null);
    setProgress(null);
    setActiveTab("progress");
    
    try {
      const results = await testEnterpriseCapabilities(
        { recordCounts },
        (progress) => {
          setProgress(progress);
        }
      );
      
      setTestResults(results);
      toast({
        title: "Capability Test Complete",
        description: "System capability test has completed successfully",
      });
      setActiveTab("results");
    } catch (error) {
      console.error("Error testing capabilities:", error);
      toast({
        title: "Capability Test Failed",
        description: error instanceof Error ? error.message : "An error occurred during testing",
        variant: "destructive"
      });
    } finally {
      setTestInProgress(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Enterprise Migration Capability Test
        </CardTitle>
        <CardDescription>
          Test the system's capacity for enterprise-scale migrations
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mx-6">
          <TabsTrigger value="configuration">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="progress" disabled={!testInProgress && !progress}>
            <GitBranch className="h-4 w-4 mr-2" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!testResults}>
            <BarChart className="h-4 w-4 mr-2" />
            Results
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="pt-6">
          <TabsContent value="configuration">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Record Counts for Simulation</h3>
                <p className="text-muted-foreground text-sm">
                  Configure the number of records to simulate for each data type
                </p>
                
                {Object.entries(recordCounts).map(([dataType, count]) => (
                  <div key={dataType} className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={dataType}>{dataType.charAt(0).toUpperCase() + dataType.slice(1)}</Label>
                      <span className="text-muted-foreground text-sm">{count.toLocaleString()} records</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        id={dataType}
                        min={0}
                        max={dataType === 'contacts' ? 200000 : dataType === 'accounts' ? 20000 : 10000}
                        step={dataType === 'contacts' ? 1000 : 100}
                        value={[count]}
                        onValueChange={(value) => handleCountChange(dataType, value[0])}
                        disabled={testInProgress}
                      />
                      <Input
                        type="number"
                        value={count}
                        onChange={(e) => handleCountChange(dataType, parseInt(e.target.value) || 0)}
                        className="w-24"
                        disabled={testInProgress}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Total Records</h4>
                      <p className="text-muted-foreground text-sm">Combined records across all data types</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-semibold">{totalRecords.toLocaleString()}</span>
                      <p className="text-muted-foreground text-sm">records</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="space-y-6">
              {progress ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Overall Progress</h3>
                      <span className="text-sm font-medium">{progress.percentage}%</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Processed: {progress.processedRecords.toLocaleString()} of {progress.totalRecords.toLocaleString()}</span>
                      <span>Batch: {progress.currentBatch} of {progress.totalBatches}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Processing Stats</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Start Time</span>
                          <span>{progress.startTime.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <span className="capitalize">{progress.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Failed Records</span>
                          <span>{progress.failedRecords.toLocaleString()}</span>
                        </div>
                        {progress.processingRate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Processing Rate</span>
                            <span>{progress.processingRate.toFixed(2)} records/sec</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Estimated Time</h4>
                      <div className="space-y-2">
                        {progress.estimatedTimeRemaining !== null ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Time Remaining</span>
                              <span>{formatTime(progress.estimatedTimeRemaining)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Estimated Completion</span>
                              <span>
                                {new Date(Date.now() + progress.estimatedTimeRemaining * 1000).toLocaleTimeString()}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            Calculating estimates...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : testInProgress ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <h3 className="text-lg font-medium">Initializing Test</h3>
                  <p className="text-muted-foreground mt-2">
                    Setting up test environment for {totalRecords.toLocaleString()} records
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Active Test</h3>
                  <p className="text-muted-foreground mt-2">
                    Start a capability test to see progress information
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {testResults ? (
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Test Completed Successfully
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    The system was tested with {totalRecords.toLocaleString()} total records
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Maximum Capacity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(testResults.maxCapacity).map(([dataType, count]) => (
                      <div key={dataType} className="border rounded-lg p-4">
                        <h4 className="font-medium capitalize">{dataType}</h4>
                        <p className="text-2xl font-bold">{Number(count).toLocaleString()}</p>
                        <p className="text-muted-foreground text-sm">records per 8-hour window</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Peak Throughput</span>
                          <span className="text-lg">{testResults.performanceMetrics.peakThroughput.toFixed(2)}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">records per second</p>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Average Throughput</span>
                          <span className="text-lg">{testResults.performanceMetrics.averageThroughput.toFixed(2)}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">records per second</p>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Success Rate</span>
                          <span className="text-lg">{testResults.performanceMetrics.successRate.toFixed(2)}%</span>
                        </div>
                        <p className="text-muted-foreground text-sm">of processed records</p>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Total Duration</span>
                          <span className="text-lg">{formatTime(testResults.performanceMetrics.totalDuration)}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">test execution time</p>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Memory Usage</span>
                          <span className="text-lg">{testResults.performanceMetrics.memoryUsage.toFixed(0)} MB</span>
                        </div>
                        <p className="text-muted-foreground text-sm">peak memory consumption</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Recommendation
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-4 h-[calc(100%-2rem)]">
                      <div className="overflow-auto max-h-[400px] space-y-2">
                        {testResults.recommendation.split('\n').map((line, index) => (
                          line.trim() ? (
                            <p key={index} className={line.startsWith('-') ? 'pl-4 text-muted-foreground' : 'font-medium'}>
                              {line}
                            </p>
                          ) : <div key={index} className="h-2" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Results Available</h3>
                <p className="text-muted-foreground mt-2">
                  Complete a capability test to view detailed results
                </p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab("configuration")} disabled={testInProgress}>
          Reset Configuration
        </Button>
        <Button 
          onClick={startCapabilityTest} 
          disabled={testInProgress || totalRecords === 0}
          className="gap-2"
        >
          {testInProgress ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing Capabilities...
            </>
          ) : (
            <>
              <Settings className="h-4 w-4" />
              Start Capability Test
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

/**
 * Format seconds into human-readable time
 */
const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`;
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

export default EnterpriseMigrationCapabilityTest;
