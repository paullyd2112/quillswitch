
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  validateData, 
  ValidationRule, 
  ValidationResult, 
  commonValidationRules 
} from "@/services/migration/validationService";
import { MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import { useToast } from "@/hooks/use-toast";
import ValidationSummary from "./ValidationSummary";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Validation</CardTitle>
            <CardDescription>
              Validate your data before migration to identify and fix potential issues
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Data validation helps you identify and fix issues <strong>before</strong> migration starts. 
                Run validation for each data type to ensure a smooth migration process.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
                <div className="flex gap-2 items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click "Validate Data" to check for common issues like missing required fields, 
                        invalid email formats, and data inconsistencies.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button 
                    onClick={() => handleValidateData(obj.name)} 
                    disabled={isValidating[obj.name]}
                  >
                    {isValidating[obj.name] ? 'Validating...' : 'Validate Data'}
                  </Button>
                </div>
              </div>
              
              {validationResults[obj.name] ? (
                <>
                  <ValidationSummary 
                    result={validationResults[obj.name]} 
                    objectTypeName={obj.name} 
                  />
                  
                  {validationResults[obj.name]?.errors.length ? (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-medium">Error Details</h4>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>These specific errors need to be fixed in your source CRM before migration. 
                              Fixing these issues will improve your data quality and ensure a successful migration.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
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
                  ) : null}
                </>
              ) : (
                <div className="p-8 text-center border rounded-md bg-muted/30">
                  <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
                  <p className="text-muted-foreground mb-2">
                    Click "Validate Data" to check for potential issues before migration
                  </p>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Validating your data now will help identify common issues like missing required fields, 
                    incorrect formats, and data inconsistencies that could cause problems during migration.
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
