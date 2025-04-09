
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ValidationResult } from "@/services/migration/validationService";

interface ValidationSummaryProps {
  result: ValidationResult | null;
  objectTypeName: string;
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({ result, objectTypeName }) => {
  if (!result) return null;
  
  const totalRecords = result.validRecords + result.invalidRecords;
  const validPercentage = totalRecords > 0 ? Math.round((result.validRecords / totalRecords) * 100) : 0;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Data Quality Score</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Your data quality score helps you understand how much of your data is valid and ready for migration. 
                  A higher score means fewer issues to fix before migrating.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center mt-1">
            <Badge 
              className={`mr-2 ${
                validPercentage >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                validPercentage >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {validPercentage}%
            </Badge>
            <span className="text-sm text-muted-foreground">
              {validPercentage >= 90 ? 'Excellent' : 
               validPercentage >= 70 ? 'Good' : 
               validPercentage >= 50 ? 'Fair' : 'Poor'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Records</p>
          <div className="flex items-center mt-1 justify-end">
            <Badge variant="outline" className="mr-2">
              {result.validRecords} valid
            </Badge>
            {result.invalidRecords > 0 && (
              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                {result.invalidRecords} invalid
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <Progress value={validPercentage} className="h-2" />
      
      {result.invalidRecords > 0 && (
        <Alert className="mt-4 bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle>Validation Issues Found</AlertTitle>
          <AlertDescription>
            <p>There are some data quality issues that may impact your {objectTypeName} migration.</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Check for missing required fields in your {objectTypeName} records</li>
              <li>Fix formatting issues in email addresses, phone numbers, or dates</li>
              <li>Review the detailed error list below for specific records that need attention</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {result.validRecords > 0 && result.invalidRecords === 0 && (
        <Alert className="mt-4 bg-green-50 dark:bg-green-950/30">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>All Data Valid</AlertTitle>
          <AlertDescription>
            Your {objectTypeName} data passed all validation checks and is ready for migration.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ValidationSummary;
