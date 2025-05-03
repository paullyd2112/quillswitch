import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMigrationProject } from "@/hooks/useMigrationProject";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface MigrationObjectStatus {
  objectType: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  percentComplete: number;
}

const MigrationSuccessSummary: React.FC<{
  projectId: string;
  onFinish?: () => void;
  onViewHistory?: () => void;
}> = ({ projectId, onFinish, onViewHistory }) => {
  const { project, loading } = useMigrationProject(projectId);
  const [objectStatus, setObjectStatus] = React.useState<MigrationObjectStatus[]>([]);
  const [hasErrors, setHasErrors] = React.useState(false);
  const [validationSteps, setValidationSteps] = React.useState<{ title: string; completed: boolean }[]>([
    { title: "Check key accounts", completed: false },
    { title: "Verify contact relationships", completed: false },
    { title: "Confirm recent activities", completed: false }
  ]);
  
  React.useEffect(() => {
    if (project) {
      // In a real implementation, fetch this data from the API
      // For now, we'll generate some sample data
      const objectTypes = ["Contacts", "Accounts", "Opportunities", "Tasks"];
      const sampleObjectStatus = objectTypes.map(type => {
        const total = Math.floor(Math.random() * 1000) + 200;
        const failed = Math.floor(Math.random() * (total * 0.05)); // 0-5% failure rate
        
        return {
          objectType: type,
          totalRecords: total,
          successfulRecords: total - failed,
          failedRecords: failed,
          percentComplete: 100
        };
      });
      
      setObjectStatus(sampleObjectStatus);
      setHasErrors(sampleObjectStatus.some(obj => obj.failedRecords > 0));
    }
  }, [project]);
  
  const handleCompletedCheck = (index: number) => {
    setValidationSteps(prev => {
      const newSteps = [...prev];
      newSteps[index].completed = !newSteps[index].completed;
      return newSteps;
    });
  };
  
  const downloadErrorReport = () => {
    // In a real implementation, this would trigger a CSV download
    // For now, we'll just log to console
    console.log("Downloading error report...");
    toast.success("Error report downloaded");
  };
  
  const openDestinationCrm = () => {
    // This would open the destination CRM in a new tab
    window.open("https://example.com/destination-crm", "_blank");
  };
  
  if (loading || !project) {
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

  return (
    <Card className="w-full">
      <CardHeader className={hasErrors ? "bg-amber-50" : "bg-green-50"}>
        <div className="flex items-center">
          {hasErrors ? (
            <AlertCircle className="h-6 w-6 text-amber-500 mr-2" />
          ) : (
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
          )}
          <CardTitle>
            {hasErrors ? "Migration Complete with Errors" : "Migration Complete!"}
          </CardTitle>
        </div>
        <CardDescription>
          Your data has been migrated from {project.source_crm} to {project.destination_crm}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold">
              {objectStatus.reduce((sum, obj) => sum + obj.totalRecords, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Records</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              {objectStatus.reduce((sum, obj) => sum + obj.successfulRecords, 0).toLocaleString()}
            </div>
            <div className="text-xs text-green-600">Succeeded</div>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-700">
              {objectStatus.reduce((sum, obj) => sum + obj.failedRecords, 0).toLocaleString()}
            </div>
            <div className="text-xs text-red-600">Failed</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {objectStatus.length}
            </div>
            <div className="text-xs text-blue-600">Object Types</div>
          </div>
        </div>
        
        {/* Per-Object Status */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Object Migration Details</h3>
          
          {objectStatus.map((obj, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">{obj.objectType}</div>
                <div className="text-sm">
                  {obj.successfulRecords.toLocaleString()}/{obj.totalRecords.toLocaleString()}
                  {obj.failedRecords > 0 && (
                    <span className="text-red-600 ml-1">
                      ({obj.failedRecords} failed)
                    </span>
                  )}
                </div>
              </div>
              <Progress value={obj.percentComplete} className="h-1.5" />
            </div>
          ))}
          
          {hasErrors && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 text-red-600 border-red-200"
              onClick={downloadErrorReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Failed Records
            </Button>
          )}
        </div>
        
        <Separator />
        
        {/* Interactive Post-Flight Check */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Verify Your Migration</h3>
          <p className="text-sm text-muted-foreground">
            Let's check that your data migrated correctly. Complete these checks in your new CRM.
          </p>
          
          <div className="space-y-2">
            {validationSteps.map((step, i) => (
              <div key={i} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`check-${i}`} 
                  checked={step.completed}
                  onChange={() => handleCompletedCheck(i)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor={`check-${i}`} className="ml-2 text-sm">
                  {step.title}
                </label>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={openDestinationCrm}
            className="mt-2"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open {project.destination_crm}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 border-t">
        <Button 
          variant="ghost" 
          onClick={onViewHistory}
        >
          View Migration History
        </Button>
        <Button 
          onClick={onFinish}
          className="bg-brand-600 hover:bg-brand-700"
        >
          Finish
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MigrationSuccessSummary;
