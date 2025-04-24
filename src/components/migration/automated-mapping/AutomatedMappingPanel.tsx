
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, ArrowRightLeft, Loader2 } from "lucide-react";

interface AutomatedMappingPanelProps {
  objectTypeId: string;
  projectId: string;
  sourceFields: string[];
  destinationFields: string[];
  onMappingsApplied: () => void;
  isProcessing?: boolean;
}

const AutomatedMappingPanel: React.FC<AutomatedMappingPanelProps> = ({
  objectTypeId,
  projectId,
  sourceFields,
  destinationFields,
  onMappingsApplied,
  isProcessing = false
}) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="auto" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="auto">Auto-Map</TabsTrigger>
          <TabsTrigger value="smart">Smart Suggestions</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Recognition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-medium">AI-Powered Field Mapping</h3>
                <p className="text-muted-foreground">
                  Our AI will automatically match fields from your source CRM to the destination CRM
                  based on name similarity, data types, and common patterns.
                </p>
                <div className="flex justify-center my-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-right space-y-2">
                      {sourceFields.slice(0, 3).map((field) => (
                        <div key={field} className="text-sm font-medium">{field}</div>
                      ))}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <ArrowRightLeft className="text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      {destinationFields.slice(0, 3).map((field) => (
                        <div key={field} className="text-sm font-medium">{field}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button 
                  className="gap-2" 
                  onClick={onMappingsApplied}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      <span>Apply Auto-Mapping</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="smart">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium">Smart Field Suggestions</h3>
              <p className="text-muted-foreground">
                Review AI-generated mapping suggestions that take into account field names,
                data formats, and historical mapping patterns.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patterns">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium">Pattern Recognition</h3>
              <p className="text-muted-foreground">
                Automatically detect and map fields based on data patterns and content analysis.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomatedMappingPanel;
