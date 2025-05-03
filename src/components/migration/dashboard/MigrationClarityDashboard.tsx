
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Database } from "lucide-react";
import { useMigrationProject } from "@/hooks/useMigrationProject";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DataQualityFlag {
  severity: "info" | "warning" | "error";
  message: string;
  objectType: string;
}

const MigrationClarityDashboard: React.FC<{
  projectId: string;
  onProceed?: () => void;
}> = ({ projectId, onProceed }) => {
  const { project, loading, error } = useMigrationProject(projectId);
  const [dataQualityFlags, setDataQualityFlags] = React.useState<DataQualityFlag[]>([]);
  const [complexityRating, setComplexityRating] = React.useState<"simple" | "medium" | "complex">("medium");
  const [estimatedTime, setEstimatedTime] = React.useState<number | null>(null);
  
  React.useEffect(() => {
    if (project) {
      // Simulate fetching data quality flags
      // In a real implementation, this would be fetched from the server
      setDataQualityFlags([
        {
          severity: "warning",
          message: "20% of contacts missing email addresses",
          objectType: "Contacts"
        },
        {
          severity: "info",
          message: "Custom fields detected in Accounts",
          objectType: "Accounts"
        }
      ]);
      
      // Calculate complexity based on number of objects, custom fields, etc.
      const objectCount = project.total_objects || 0;
      if (objectCount > 10000) {
        setComplexityRating("complex");
        setEstimatedTime(60); // minutes
      } else if (objectCount > 1000) {
        setComplexityRating("medium");
        setEstimatedTime(30); // minutes
      } else {
        setComplexityRating("simple");
        setEstimatedTime(15); // minutes
      }
    }
  }, [project]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !project) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center h-40">
            <AlertCircle className="h-10 w-10 text-destructive mb-2" />
            <p className="text-destructive">Failed to load migration data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Migration Clarity Dashboard</CardTitle>
        <CardDescription>
          Analysis of your connected CRMs and data structure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estimated Time & Complexity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Estimated Migration Time
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-muted-foreground">ℹ️</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">This is an estimate based on the objects selected, data volume, and complexity.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold">{estimatedTime}</span>
              <span className="text-muted-foreground ml-1">minutes</span>
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Migration Complexity
              </h3>
            </div>
            <div className="mt-1">
              <Badge 
                className={
                  complexityRating === "simple" ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800" :
                  complexityRating === "medium" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800" :
                  "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                }
              >
                {complexityRating.charAt(0).toUpperCase() + complexityRating.slice(1)}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                {complexityRating === "simple" ? "Basic data mapping with standard fields" : 
                 complexityRating === "medium" ? "Some custom fields and medium data volume" : 
                 "Multiple custom objects and large data volume"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Data Quality Flags */}
        <div>
          <h3 className="text-sm font-medium mb-2">Data Quality Alerts</h3>
          <div className="space-y-2">
            {dataQualityFlags.length > 0 ? (
              dataQualityFlags.map((flag, index) => (
                <div 
                  key={index} 
                  className={`p-2 border rounded-md flex items-start ${
                    flag.severity === "error" ? "border-red-200 bg-red-50" :
                    flag.severity === "warning" ? "border-yellow-200 bg-yellow-50" :
                    "border-blue-200 bg-blue-50"
                  }`}
                >
                  <div className="mr-2 mt-0.5">
                    {flag.severity === "error" ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : flag.severity === "warning" ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{flag.objectType}</p>
                    <p className="text-xs text-muted-foreground">{flag.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">No data quality issues detected</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Connection Status */}
        <div>
          <h3 className="text-sm font-medium mb-2">Connected Systems</h3>
          <div className="space-y-2">
            <div className="p-2 border rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="font-medium text-blue-700">{project.source_crm.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{project.source_crm}</p>
                  <p className="text-xs text-muted-foreground">Source CRM</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
            </div>
            
            <div className="p-2 border rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                  <span className="font-medium text-purple-700">{project.destination_crm.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{project.destination_crm}</p>
                  <p className="text-xs text-muted-foreground">Destination CRM</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        {onProceed && (
          <div className="pt-4">
            <button 
              onClick={onProceed}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 rounded-md transition-colors"
            >
              Next: Select Data
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MigrationClarityDashboard;
