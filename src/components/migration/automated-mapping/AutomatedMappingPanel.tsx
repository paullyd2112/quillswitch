
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { generateMappingSuggestions, applyMappingSuggestions } from "@/services/migration/automatedMappingService";
import MappingSuggestionsTable from "./MappingSuggestionsTable";
import MappingGenerator from "./MappingGenerator";
import { MappingSuggestion } from "./types";
import { filterSuggestionsByTab } from "./utils";

interface AutomatedMappingPanelProps {
  objectTypeId: string;
  projectId: string;
  sourceFields: string[];
  destinationFields: string[];
  onMappingsApplied: () => void;
}

const AutomatedMappingPanel: React.FC<AutomatedMappingPanelProps> = ({
  objectTypeId,
  projectId,
  sourceFields,
  destinationFields,
  onMappingsApplied,
}) => {
  const [suggestions, setSuggestions] = useState<MappingSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const generateMappings = async () => {
    setIsLoading(true);
    try {
      const result = await generateMappingSuggestions(
        objectTypeId,
        sourceFields,
        destinationFields
      );
      
      setSuggestions(result);
      if (result.length > 0) {
        toast.success(`Generated ${result.length} field mapping suggestions`);
      } else {
        toast.info("Couldn't generate any mapping suggestions");
      }
    } catch (error) {
      console.error("Error generating mappings:", error);
      toast.error("Failed to generate mapping suggestions");
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyMappings = async () => {
    setIsApplying(true);
    try {
      const suggestionsToApply = filterSuggestionsByTab(suggestions, activeTab);
      
      const result = await applyMappingSuggestions(
        objectTypeId,
        projectId,
        suggestionsToApply
      );
      
      if (result.length > 0) {
        toast.success(`Applied ${result.length} field mappings`);
        setSuggestions([]);
        onMappingsApplied();
      } else {
        toast.error("Failed to apply any mappings");
      }
    } catch (error) {
      console.error("Error applying mappings:", error);
      toast.error("Failed to apply mapping suggestions");
    } finally {
      setIsApplying(false);
    }
  };
  
  const filteredSuggestions = filterSuggestionsByTab(suggestions, activeTab);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-brand-500" />
          Automated Field Mapping
        </CardTitle>
        <CardDescription>
          Smart field mapping suggestions based on field names, patterns and data formatting
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <MappingGenerator 
            isLoading={isLoading} 
            onGenerate={generateMappings} 
          />
        ) : (
          <div>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All ({suggestions.length})</TabsTrigger>
                  <TabsTrigger value="high">
                    High Confidence ({suggestions.filter(s => s.confidence >= 0.9).length})
                  </TabsTrigger>
                  <TabsTrigger value="medium">
                    Medium ({suggestions.filter(s => s.confidence >= 0.7 && s.confidence < 0.9).length})
                  </TabsTrigger>
                  <TabsTrigger value="low">
                    Low ({suggestions.filter(s => s.confidence < 0.7).length})
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="mt-0">
                <MappingSuggestionsTable suggestions={filteredSuggestions} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      {suggestions.length > 0 && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setSuggestions([])}>
            Discard Suggestions
          </Button>
          <Button 
            onClick={applyMappings} 
            disabled={isApplying || filteredSuggestions.length === 0}
            className="gap-2"
          >
            {isApplying ? "Applying..." : "Apply Suggestions"} 
            {!isApplying && <ThumbsUp className="h-4 w-4" />}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AutomatedMappingPanel;
