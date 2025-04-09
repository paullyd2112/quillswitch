
import React, { useState, useEffect } from "react";
import { FieldMapping, MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DataPreviewProps {
  objectType: MigrationObjectType;
  fieldMappings: FieldMapping[];
}

// Mock data - In a real application, this would come from an API
const generateMockData = (fieldMappings: FieldMapping[], count: number = 5) => {
  const data = [];
  
  for (let i = 0; i < count; i++) {
    const record: Record<string, any> = {};
    
    fieldMappings.forEach(mapping => {
      const fieldName = mapping.source_field.toLowerCase();
      
      // Generate appropriate mock data based on field name
      if (fieldName.includes('name')) {
        record[mapping.source_field] = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'][i % 5];
      } else if (fieldName.includes('email')) {
        record[mapping.source_field] = [`user${i}@example.com`, 'contact@company.com', 'support@business.org'][i % 3];
      } else if (fieldName.includes('phone')) {
        record[mapping.source_field] = [`(555) 123-${1000 + i}`, '(800) 555-1234', '(123) 456-7890'][i % 3];
      } else if (fieldName.includes('date')) {
        const date = new Date();
        date.setDate(date.getDate() - i * 10);
        record[mapping.source_field] = date.toISOString().split('T')[0];
      } else if (fieldName.includes('id')) {
        record[mapping.source_field] = `ID-${10000 + i}`;
      } else if (fieldName.includes('amount') || fieldName.includes('price')) {
        record[mapping.source_field] = (100 * (i + 1)).toFixed(2);
      } else if (fieldName.includes('description')) {
        record[mapping.source_field] = `Sample description for record ${i+1}`;
      } else if (fieldName.includes('status')) {
        record[mapping.source_field] = ['Active', 'Pending', 'Completed', 'On Hold'][i % 4];
      } else {
        record[mapping.source_field] = `Value ${i+1}`;
      }
      
      // Apply transformation if it exists
      if (mapping.transformation_rule) {
        try {
          // Simple transformation logic - in a real app this would be more robust
          if (mapping.transformation_rule.includes('toUpperCase')) {
            record[`${mapping.destination_field}_transformed`] = record[mapping.source_field].toUpperCase();
          } else if (mapping.transformation_rule.includes('toLowerCase')) {
            record[`${mapping.destination_field}_transformed`] = record[mapping.source_field].toLowerCase();
          } else {
            record[`${mapping.destination_field}_transformed`] = record[mapping.source_field];
          }
        } catch (error) {
          record[`${mapping.destination_field}_transformed`] = `Error: Could not transform`;
        }
      } else {
        record[`${mapping.destination_field}_transformed`] = record[mapping.source_field];
      }
    });
    
    data.push(record);
  }
  
  return data;
};

const DataPreview: React.FC<DataPreviewProps> = ({ objectType, fieldMappings }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [destinationData, setDestinationData] = useState<any[]>([]);
  const [hasErrors, setHasErrors] = useState(false);
  
  useEffect(() => {
    // Simulate API call to get preview data
    const timer = setTimeout(() => {
      try {
        const mockData = generateMockData(fieldMappings);
        setSourceData(mockData);
        
        // Transform data for destination preview
        const transformedData = mockData.map(record => {
          const transformed: Record<string, any> = {};
          
          fieldMappings.forEach(mapping => {
            transformed[mapping.destination_field] = record[`${mapping.destination_field}_transformed`] || record[mapping.source_field];
          });
          
          return transformed;
        });
        
        setDestinationData(transformedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error generating preview data:", error);
        setHasErrors(true);
        setIsLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [fieldMappings]);

  if (hasErrors) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          There was an error generating the preview. This might be due to invalid transformation rules.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="py-4">
      <Tabs defaultValue="source">
        <TabsList className="mb-4">
          <TabsTrigger value="source">Source Data Preview</TabsTrigger>
          <TabsTrigger value="destination">Post-Migration Preview</TabsTrigger>
          <TabsTrigger value="side-by-side">Side-by-Side Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="source">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {fieldMappings.map(mapping => (
                      <TableHead key={`source-${mapping.id}`}>{mapping.source_field}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sourceData.map((record, index) => (
                    <TableRow key={`source-row-${index}`}>
                      {fieldMappings.map(mapping => (
                        <TableCell key={`source-cell-${mapping.id}-${index}`}>
                          {record[mapping.source_field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="destination">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {fieldMappings.map(mapping => (
                      <TableHead key={`dest-${mapping.id}`}>{mapping.destination_field}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinationData.map((record, index) => (
                    <TableRow key={`dest-row-${index}`}>
                      {fieldMappings.map(mapping => (
                        <TableCell key={`dest-cell-${mapping.id}-${index}`}>
                          {record[mapping.destination_field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="side-by-side">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Source Data</h3>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {fieldMappings.map(mapping => (
                          <TableHead key={`side-source-${mapping.id}`} className="whitespace-nowrap">
                            {mapping.source_field}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sourceData.slice(0, 2).map((record, index) => (
                        <TableRow key={`side-source-row-${index}`}>
                          {fieldMappings.map(mapping => (
                            <TableCell key={`side-source-cell-${mapping.id}-${index}`} className="truncate max-w-[200px]">
                              {record[mapping.source_field]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Destination Data</h3>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {fieldMappings.map(mapping => (
                          <TableHead key={`side-dest-${mapping.id}`} className="whitespace-nowrap">
                            {mapping.destination_field}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {destinationData.slice(0, 2).map((record, index) => (
                        <TableRow key={`side-dest-row-${index}`}>
                          {fieldMappings.map(mapping => (
                            <TableCell key={`side-dest-cell-${mapping.id}-${index}`} className="truncate max-w-[200px]">
                              {record[mapping.destination_field]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataPreview;
