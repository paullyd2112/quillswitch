
import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Database, FileSearch } from "lucide-react";
import { ExtractedData } from "@/services/migration/extractionService";
import DataExtractionPreview from "@/components/migration/extraction/DataExtractionPreview";
import { toast } from "@/components/ui/use-toast";

// Example CRM source options
const crmSources = [
  { id: "salesforce", name: "Salesforce" },
  { id: "hubspot", name: "HubSpot" },
  { id: "dynamics", name: "Microsoft Dynamics 365" },
  { id: "zoho", name: "Zoho CRM" },
  { id: "pipedrive", name: "Pipedrive" }
];

const DataExtractionPage: React.FC = () => {
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [activeTab, setActiveTab] = useState("configure");
  
  const handleDataExtracted = (data: ExtractedData[]) => {
    setExtractedData(data);
    setActiveTab("results");
    toast({
      title: "Data Extraction Complete",
      description: `Successfully extracted ${data.length} records`,
    });
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <Container>
        <PageHeader 
          heading="Data Extraction Service"
          description="Extract, standardize, and preview data from various CRM sources"
        />
        
        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="configure">
                <Database className="h-4 w-4 mr-1" /> Configure Extraction
              </TabsTrigger>
              <TabsTrigger value="results" disabled={extractedData.length === 0}>
                <FileSearch className="h-4 w-4 mr-1" /> Extraction Results 
                {extractedData.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {extractedData.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="configure">
              <DataExtractionPreview 
                availableSources={crmSources}
                onExtract={handleDataExtracted}
              />
            </TabsContent>
            
            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle>Extraction Results</CardTitle>
                  <CardDescription>
                    Successfully extracted {extractedData.length} records from {
                      extractedData[0]?.sourceSystem
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <Badge variant="outline">
                          {extractedData[0]?.objectType || "Unknown"} data
                        </Badge>
                      </div>
                      <Button onClick={() => setActiveTab("configure")}>
                        Extract More Data
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-muted/20 rounded-md">
                      <p>
                        Your data has been extracted and is now ready for further processing.
                        You can now map this data to your destination system or continue with
                        the migration process.
                      </p>
                    </div>
                    
                    <div className="rounded-md border overflow-auto">
                      <pre className="p-4 text-xs">{JSON.stringify(extractedData, null, 2)}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default DataExtractionPage;
