
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  validateData, 
  ValidationRule, 
  ValidationResult, 
  commonValidationRules 
} from "@/services/migration/validationService";
import { MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface DataValidationProps {
  project: {
    source_crm: string;
    destination_crm: string;
  };
  objectTypes: MigrationObjectType[];
}

const DataValidation: React.FC<DataValidationProps> = ({ project, objectTypes }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(objectTypes[0]?.name || 'contacts');
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult | null>>({});
  const [isValidating, setIsValidating] = useState<Record<string, boolean>>({});

  const handleValidateData = async (objectType: string) => {
    setIsValidating(prev => ({ ...prev, [objectType]: true }));
    
    try {
      // Get appropriate validation rules for this object type
      const rules = commonValidationRules[objectType as keyof typeof commonValidationRules] || [];
      
      // Run validation
      const result = await validateData(project.source_crm, objectType, rules);
      
      // Update state with results
      setValidationResults(prev => ({ ...prev, [objectType]: result }));
      
      // Show toast notification
      toast({
        title: result.valid ? "Validation Passed" : "Validation Issues Found",
        description: result.valid 
          ? `All ${result.validRecords} records are valid.` 
          : `Found issues in ${result.invalidRecords} out of ${result.validRecords + result.invalidRecords} records.`,
        variant: result.valid ? "default" : "destructive",
      });
    } catch (error: any) {
      console.error("Validation error:", error);
      toast({
        title: "Validation Error",
        description: error.message || "An error occurred during validation",
        variant: "destructive",
      });
    } finally {
      setIsValidating(prev => ({ ...prev, [objectType]: false }));
    }
  };

  const getValidationSummary = (result: ValidationResult | null) => {
    if (!result) return null;
    
    const totalRecords = result.validRecords + result.invalidRecords;
    const validPercentage = totalRecords > 0 ? Math.round((result.validRecords / totalRecords) * 100) : 0;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Data Quality Score</p>
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
              There are some data quality issues that may impact your migration. 
              See details below for specific records that need attention.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Validation</CardTitle>
        <CardDescription>
          Validate your data before migration to identify and fix potential issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4 grid w-full grid-cols-3">
            {objectTypes.map(obj => (
              <TabsTrigger key={obj.id} value={obj.name}>
                {obj.name.charAt(0).toUpperCase() + obj.name.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {objectTypes.map(obj => (
            <TabsContent key={obj.id} value={obj.name} className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{obj.name.charAt(0).toUpperCase() + obj.name.slice(1)} Validation</h3>
                  <p className="text-sm text-muted-foreground">
                    Validates {obj.total_records || 'all'} records from {project.source_crm}
                  </p>
                </div>
                <Button 
                  onClick={() => handleValidateData(obj.name)} 
                  disabled={isValidating[obj.name]}
                >
                  {isValidating[obj.name] ? 'Validating...' : 'Validate Data'}
                </Button>
              </div>
              
              {validationResults[obj.name] ? (
                <>
                  {getValidationSummary(validationResults[obj.name])}
                  
                  {validationResults[obj.name]?.errors.length ? (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Error Details</h4>
                      <div className="border rounded-md overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Record ID</TableHead>
                              <TableHead>Field</TableHead>
                              <TableHead>Issue</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {validationResults[obj.name]?.errors.slice(0, 10).map((error, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-mono text-xs">{error.recordId}</TableCell>
                                <TableCell>{error.field}</TableCell>
                                <TableCell>{error.message}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {(validationResults[obj.name]?.errors.length || 0) > 10 && (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            Showing 10 of {validationResults[obj.name]?.errors.length} issues
                          </div>
                        )}
                      </div>
                    </div>
                  ) : validationResults[obj.name]?.valid ? (
                    <Alert className="mt-4 bg-green-50 dark:bg-green-950/30">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertTitle>All Data Valid</AlertTitle>
                      <AlertDescription>
                        Your {obj.name} data passed all validation checks and is ready for migration.
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </>
              ) : (
                <div className="p-8 text-center border rounded-md bg-muted/30">
                  <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
                  <p className="text-muted-foreground">
                    Click "Validate Data" to check for potential issues before migration
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataValidation;
