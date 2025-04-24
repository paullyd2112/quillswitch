
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Database, FileSearch, Eye } from "lucide-react";
import { useDataExtraction } from "@/hooks/useDataExtraction";
import { ExtractedData } from "@/services/migration/extractionService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface DataExtractionPreviewProps {
  availableSources: { id: string; name: string }[];
  onExtract?: (data: ExtractedData[]) => void;
}

const objectTypes = [
  { id: "contacts", name: "Contacts" },
  { id: "accounts", name: "Accounts/Companies" },
  { id: "opportunities", name: "Opportunities/Deals" },
  { id: "custom", name: "Custom Object" }
];

const DataExtractionPreview: React.FC<DataExtractionPreviewProps> = ({ 
  availableSources,
  onExtract 
}) => {
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedObjectType, setSelectedObjectType] = useState<string>("contacts");
  const [customObjectName, setCustomObjectName] = useState<string>("");
  const [limit, setLimit] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [selectedRecord, setSelectedRecord] = useState<ExtractedData | null>(null);
  
  const { 
    previewData, 
    isLoading, 
    error, 
    extractionProgress,
    fetchPreview, 
    extractData, 
    resetExtraction
  } = useDataExtraction();

  const handleFetchPreview = async () => {
    if (!selectedSource) return;
    
    const objectType = selectedObjectType === "custom" ? customObjectName : selectedObjectType;
    if (!objectType) return;
    
    await fetchPreview({
      sourceSystem: selectedSource,
      objectType,
      limit
    });
  };

  const handleExtract = async () => {
    if (!selectedSource) return;
    
    const objectType = selectedObjectType === "custom" ? customObjectName : selectedObjectType;
    if (!objectType) return;
    
    const data = await extractData({
      sourceSystem: selectedSource,
      objectType,
      limit: 25 // For actual extraction, we'd want more data
    });
    
    if (data.length > 0 && onExtract) {
      onExtract(data);
    }
  };

  const renderFieldValue = (field: any) => {
    if (field.type === 'date') {
      const date = new Date(field.value);
      return date.toLocaleString();
    } else if (field.type === 'boolean') {
      return field.value ? 'Yes' : 'No';
    } else if (field.type === 'object' || field.type === 'array') {
      return JSON.stringify(field.value);
    }
    return String(field.value);
  };

  const getObjectTypeName = () => {
    if (selectedObjectType === "custom") {
      return customObjectName || "Custom Object";
    }
    const found = objectTypes.find(t => t.id === selectedObjectType);
    return found ? found.name : selectedObjectType;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-brand-600" /> 
          Data Extraction Preview
        </CardTitle>
        <CardDescription>
          Preview data from your source CRM systems before extraction
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Source Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium">
              Source CRM
            </label>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger id="source">
                <SelectValue placeholder="Select source CRM" />
              </SelectTrigger>
              <SelectContent>
                {availableSources.map(source => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="objectType" className="text-sm font-medium">
              Object Type
            </label>
            <Select value={selectedObjectType} onValueChange={setSelectedObjectType}>
              <SelectTrigger id="objectType">
                <SelectValue placeholder="Select object type" />
              </SelectTrigger>
              <SelectContent>
                {objectTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedObjectType === "custom" && (
              <div className="mt-2">
                <Input 
                  placeholder="Enter custom object name" 
                  value={customObjectName}
                  onChange={(e) => setCustomObjectName(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-24">
            <Input 
              type="number"
              min={1}
              max={100}
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
            />
          </div>
          <span className="text-sm text-muted-foreground">records to preview</span>
          
          <div className="ml-auto space-x-2">
            <Button 
              variant="outline" 
              onClick={resetExtraction}
              disabled={isLoading || previewData.length === 0}
            >
              Reset
            </Button>
            <Button 
              onClick={handleFetchPreview} 
              disabled={isLoading || !selectedSource || (selectedObjectType === "custom" && !customObjectName)}
            >
              <Eye className="h-4 w-4 mr-1" /> Preview Data
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="space-y-4 py-4">
            {activeTab === "preview" ? (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-40 w-full" />
              </>
            ) : (
              <div className="space-y-2 py-8 text-center">
                <Progress value={extractionProgress * 100} className="h-2 w-full" />
                <p className="text-sm text-muted-foreground">
                  Extracting data... {Math.round(extractionProgress * 100)}% complete
                </p>
              </div>
            )}
          </div>
        )}

        {!isLoading && previewData.length > 0 && (
          <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-1" /> Preview
              </TabsTrigger>
              <TabsTrigger value="extract">
                <FileSearch className="h-4 w-4 mr-1" /> Extract
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Record ID</TableHead>
                      {previewData.length > 0 && previewData[0].fields.slice(0, 4).map((field, i) => (
                        <TableHead key={i}>{field.name}</TableHead>
                      ))}
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((record, i) => (
                      <TableRow 
                        key={i} 
                        className={selectedRecord?.recordId === record.recordId ? "bg-muted/50" : ""}
                      >
                        <TableCell className="font-mono text-xs">
                          {record.recordId}
                        </TableCell>
                        {record.fields.slice(0, 4).map((field, j) => (
                          <TableCell key={j}>
                            {renderFieldValue(field)}
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedRecord(
                              selectedRecord?.recordId === record.recordId ? null : record
                            )}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedRecord && (
                <Card className="border border-brand-200 shadow-sm">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Record Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedRecord.fields.map((field, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{field.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {field.type}
                            </Badge>
                          </div>
                          <div className="p-2 rounded-md bg-muted/50 text-sm">
                            {renderFieldValue(field)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="extract" className="space-y-4">
              <div className="space-y-4 p-4 bg-muted/20 rounded-md">
                <h3 className="font-semibold">Ready to Extract Full Dataset</h3>
                <p className="text-muted-foreground">
                  You're about to extract all {getObjectTypeName()} from {
                    availableSources.find(s => s.id === selectedSource)?.name || selectedSource
                  }.
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Source:</span> {
                      availableSources.find(s => s.id === selectedSource)?.name || selectedSource
                    }
                  </div>
                  <div>
                    <span className="font-medium">Object Type:</span> {getObjectTypeName()}
                  </div>
                  <div>
                    <span className="font-medium">Preview Records:</span> {previewData.length}
                  </div>
                  <div>
                    <span className="font-medium">Fields per Record:</span> {
                      previewData.length > 0 ? previewData[0].fields.length : 0
                    }
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleExtract} disabled={isLoading}>
                    <Database className="h-4 w-4 mr-1" />
                    Extract Full Dataset
                  </Button>
                </div>
              </div>
              
              {extractionProgress > 0 && extractionProgress < 1 && (
                <div className="space-y-2">
                  <Progress value={extractionProgress * 100} className="h-2 w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Extracting {Math.round(extractionProgress * 100)}% complete
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      {!isLoading && previewData.length > 0 && (
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{previewData.length}</span> records from <span className="font-medium">{selectedSource}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Displaying preview data only
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DataExtractionPreview;
