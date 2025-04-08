
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Info,
  Database,
  ChevronRight,
  FileText,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const AssessmentTool = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sourceCrm, setSourceCrm] = useState("");
  const [destinationCrm, setDestinationCrm] = useState("");
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  
  const handleStartAssessment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2000);
  };
  
  const handleCompleteAssessment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAssessmentComplete(true);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      
      <section className="pt-32 pb-8 md:pt-40 md:pb-10 relative">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Pre-Migration Assessment Tool
            </h1>
            <p className="text-xl text-muted-foreground">
              Analyze your CRM data to identify potential challenges before migration
            </p>
          </div>
        </div>
      </section>
      
      <ContentSection className="pb-32">
        <Card className="border shadow-md">
          <CardContent className="p-0">
            {step === 1 && !assessmentComplete && (
              <div className="p-6 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Select Your CRMs</h2>
                  <p className="text-muted-foreground">
                    Choose your source and destination CRMs to get a compatibility assessment
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Source CRM</label>
                    <Select value={sourceCrm} onValueChange={setSourceCrm}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your current CRM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salesforce">Salesforce</SelectItem>
                        <SelectItem value="hubspot">HubSpot</SelectItem>
                        <SelectItem value="zoho">Zoho CRM</SelectItem>
                        <SelectItem value="dynamics">Microsoft Dynamics</SelectItem>
                        <SelectItem value="pipedrive">Pipedrive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Destination CRM</label>
                    <Select value={destinationCrm} onValueChange={setDestinationCrm}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your target CRM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salesforce">Salesforce</SelectItem>
                        <SelectItem value="hubspot">HubSpot</SelectItem>
                        <SelectItem value="zoho">Zoho CRM</SelectItem>
                        <SelectItem value="dynamics">Microsoft Dynamics</SelectItem>
                        <SelectItem value="pipedrive">Pipedrive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30">
                  <div className="flex">
                    <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-300">What to expect</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                        The assessment will analyze compatibility between CRMs, identify data quality issues, and provide migration recommendations. No data will be migrated during this process.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleStartAssessment} 
                    disabled={!sourceCrm || !destinationCrm || loading}
                    className="gap-2"
                  >
                    {loading ? "Processing..." : "Start Assessment"}
                    {!loading && <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
            
            {step === 2 && !assessmentComplete && (
              <div className="p-6 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Assessment in Progress</h2>
                  <p className="text-muted-foreground">
                    We're analyzing your CRM compatibility and data structure
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing data structure</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">Complete</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Checking field compatibility</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">Complete</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Identifying potential data issues</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">Complete</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Creating migration recommendations</span>
                      <span className="font-medium">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCompleteAssessment} 
                    disabled={loading}
                    className="gap-2"
                  >
                    {loading ? "Processing..." : "Complete Assessment"}
                    {!loading && <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
            
            {assessmentComplete && (
              <div className="p-6 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Assessment Results</h2>
                  <p className="text-muted-foreground">
                    Here's what we found analyzing your Salesforce to HubSpot migration
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-lg border">
                    <h3 className="text-lg font-medium mb-3">Compatibility Score</h3>
                    <div className="flex items-center">
                      <div className="relative h-6 w-52 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <span className="ml-3 font-bold text-lg">85%</span>
                    </div>
                    <p className="text-sm mt-2 text-muted-foreground">
                      High compatibility between Salesforce and HubSpot. Most data can be migrated with minimal transformations.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Quality Issues</h3>
                    
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start dark:bg-yellow-900/20 dark:border-yellow-800/30">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Duplicate Contacts</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400">145 potential duplicate contacts detected (3.2% of total)</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start dark:bg-red-900/20 dark:border-red-800/30">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-300">Missing Fields</p>
                        <p className="text-xs text-red-700 dark:text-red-400">32% of contacts missing email addresses; 18% missing phone numbers</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-start dark:bg-green-900/20 dark:border-green-800/30">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">Clean Opportunities Data</p>
                        <p className="text-xs text-green-700 dark:text-green-400">Opportunity data is well-structured with 98% completeness</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Field Mapping Analysis</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-3">
                        <h4 className="text-sm font-medium mb-1">Contacts</h4>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>18 of 22 fields mapped</span>
                          <span>82% match</span>
                        </div>
                        <Progress value={82} className="h-1.5 mt-1" />
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="text-sm font-medium mb-1">Accounts/Companies</h4>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>12 of 15 fields mapped</span>
                          <span>80% match</span>
                        </div>
                        <Progress value={80} className="h-1.5 mt-1" />
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="text-sm font-medium mb-1">Opportunities/Deals</h4>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>14 of 16 fields mapped</span>
                          <span>88% match</span>
                        </div>
                        <Progress value={88} className="h-1.5 mt-1" />
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="text-sm font-medium mb-1">Custom Objects</h4>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>5 of 8 fields mapped</span>
                          <span>63% match</span>
                        </div>
                        <Progress value={63} className="h-1.5 mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Report
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      View Detailed Analysis
                    </Button>
                  </div>
                  
                  <Button onClick={() => navigate("/migrations/setup")} className="gap-2">
                    <Database className="h-4 w-4" />
                    Start Migration Process
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </ContentSection>
    </div>
  );
};

export default AssessmentTool;
