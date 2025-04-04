
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wand2, ArrowRight, AlertCircle, ThumbsUp, Check, X } from "lucide-react";
import { toast } from "sonner";
import { generateMappingSuggestions, applyMappingSuggestions } from "@/services/migration/automatedMappingService";
import { Progress } from "@/components/ui/progress";

interface MappingSuggestion {
  source_field: string;
  destination_field: string;
  confidence: number;
  is_required?: boolean;
}

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
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (confidence >= 0.7) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    if (confidence >= 0.5) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };
  
  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return "High";
    if (confidence >= 0.7) return "Medium";
    if (confidence >= 0.5) return "Low";
    return "Very Low";
  };
  
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
      // Filter by confidence based on the selected tab
      let suggestionsToApply = suggestions;
      if (activeTab === "high") {
        suggestionsToApply = suggestions.filter(s => s.confidence >= 0.9);
      } else if (activeTab === "medium") {
        suggestionsToApply = suggestions.filter(s => s.confidence >= 0.7);
      }
      
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
  
  const filteredSuggestions = () => {
    switch (activeTab) {
      case "high":
        return suggestions.filter(s => s.confidence >= 0.9);
      case "medium":
        return suggestions.filter(s => s.confidence >= 0.7 && s.confidence < 0.9);
      case "low":
        return suggestions.filter(s => s.confidence < 0.7);
      default:
        return suggestions;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-brand-500" />
          Automated Field Mapping
        </CardTitle>
        <CardDescription>
          AI-powered suggestions for mapping fields between CRM systems
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-6">
            <Wand2 className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">Generate Mapping Suggestions</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our AI can analyze your source and destination fields to suggest the most likely mappings based on field names and common patterns.
            </p>
            <Button 
              onClick={generateMappings} 
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? "Generating..." : "Generate Suggestions"} 
              {!isLoading && <Wand2 className="h-4 w-4" />}
            </Button>
            {isLoading && (
              <div className="mt-6">
                <Progress value={45} className="mb-2" />
                <p className="text-sm text-muted-foreground">Analyzing field patterns...</p>
              </div>
            )}
          </div>
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
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source Field</TableHead>
                        <TableHead className="w-[50px] text-center"></TableHead>
                        <TableHead>Destination Field</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead className="text-center">Required</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuggestions().map((suggestion, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{suggestion.source_field}</TableCell>
                          <TableCell className="text-center">
                            <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground" />
                          </TableCell>
                          <TableCell>{suggestion.destination_field}</TableCell>
                          <TableCell>
                            <Badge className={getConfidenceColor(suggestion.confidence)}>
                              {getConfidenceLabel(suggestion.confidence)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {suggestion.is_required ? (
                              <Check className="h-4 w-4 mx-auto text-green-500" />
                            ) : (
                              <X className="h-4 w-4 mx-auto text-muted-foreground" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
            disabled={isApplying || filteredSuggestions().length === 0}
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
