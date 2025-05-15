import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wand2, ArrowRightLeft, Loader2, Brain, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateMappingSuggestions, applyMappingSuggestions } from '@/services/migration/automatedMappingService';
import { toast } from 'sonner';

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
  const [processingLocal, setProcessingLocal] = useState(false);
  const [activeTab, setActiveTab] = useState("auto");
  
  const handleApplyMapping = async () => {
    try {
      if (isProcessing || processingLocal) return;
      
      setProcessingLocal(true);
      toast.info("Generating field mapping suggestions...");
      
      // Generate mapping suggestions - fixed parameter count
      const suggestions = await generateMappingSuggestions(
        objectTypeId,
        sourceFields.concat(destinationFields) // Combine fields into one parameter
      );
      
      if (suggestions.length === 0) {
        toast.error("No mapping suggestions could be generated");
        setProcessingLocal(false);
        return;
      }
      
      toast.success(`Generated ${suggestions.length} field mapping suggestions`);
      
      // Apply the mapping suggestions
      await applyMappingSuggestions(objectTypeId, suggestions);
      
      toast.success("Applied field mappings successfully");
      onMappingsApplied();
    } catch (error) {
      console.error("Error applying automated mapping:", error);
      toast.error("Failed to apply automated mapping");
    } finally {
      setProcessingLocal(false);
    }
  };
  
  const isCurrentlyProcessing = isProcessing || processingLocal;
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="auto">Auto-Map</TabsTrigger>
          <TabsTrigger value="smart">AI-Powered</TabsTrigger>
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
                      {sourceFields.length > 3 && <div className="text-sm text-muted-foreground">+ {sourceFields.length - 3} more</div>}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <ArrowRightLeft className="text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      {destinationFields.slice(0, 3).map((field) => (
                        <div key={field} className="text-sm font-medium">{field}</div>
                      ))}
                      {destinationFields.length > 3 && <div className="text-sm text-muted-foreground">+ {destinationFields.length - 3} more</div>}
                    </div>
                  </div>
                </div>
                <Button 
                  className="gap-2" 
                  onClick={handleApplyMapping}
                  disabled={isCurrentlyProcessing}
                >
                  {isCurrentlyProcessing ? (
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
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium">Gemini AI Field Mapping</h3>
                </div>
                <p className="text-muted-foreground">
                  Powered by Google's Gemini AI, this advanced mapping tool analyzes your field structures and recommends optimal mappings based on deep pattern recognition and semantic understanding.
                </p>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-md border">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">How Gemini AI Mapping Works:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Analyzes naming conventions and data types</li>
                    <li>Understands common field mapping patterns</li>
                    <li>Creates confident field associations</li>
                    <li>Handles complex field relationships</li>
                  </ul>
                </div>
                
                <Button 
                  className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  onClick={handleApplyMapping}
                  disabled={isCurrentlyProcessing}
                >
                  {isCurrentlyProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      <span>Apply Gemini AI Mapping</span>
                    </>
                  )}
                </Button>
              </div>
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
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("auto")}
                >
                  Go to Auto-Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomatedMappingPanel;
