
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

// Real data preview - connects to actual CRM data
const generateRealDataPreview = async (fieldMappings: FieldMapping[], count: number = 5) => {
  // TODO: Implement real data preview from connected CRM systems
  console.warn('Real data preview not yet implemented');
  return [];
};

const DataPreview: React.FC<DataPreviewProps> = ({ objectType, fieldMappings }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [destinationData, setDestinationData] = useState<any[]>([]);
  const [hasErrors, setHasErrors] = useState(false);
  
  useEffect(() => {
    // Load real data preview instead of mock data
    const loadRealDataPreview = async () => {
      setIsLoading(true);
      try {
        console.log('Loading real data preview for object type:', objectType.name);
        
        // For now, show empty state until real data preview is implemented
        setSourceData([]);
        setDestinationData([]);
        setHasErrors(false);
      } catch (error) {
        console.error('Error loading data preview:', error);
        setHasErrors(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadRealDataPreview();
  }, [fieldMappings, objectType]);

  if (hasErrors) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading real data preview. Please check your CRM connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (sourceData.length === 0 && !isLoading) {
    return (
      <Alert className="mt-4">
        <AlertDescription>
          Connect a CRM system to see real data preview. Real data preview will show once you've established a connection and configured your migration.
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
