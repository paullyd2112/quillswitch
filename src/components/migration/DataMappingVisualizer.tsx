
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldMapping, MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, AlertTriangle } from "lucide-react";
import FieldMappingsTable from "./data-mapping/FieldMappingsTable";
import EmptyMappingState from "./data-mapping/EmptyMappingState";
import MappingPreviewDialog from "./data-mapping/MappingPreviewDialog";
import ConfidenceScoreDisplay from "./enhanced-mapping/ConfidenceScoreDisplay";
import { MappingSuggestion } from "./automated-mapping/types";

interface DataMappingVisualizerProps {
  objectType: MigrationObjectType;
  fieldMappings: FieldMapping[];
  aiSuggestions?: MappingSuggestion[];
  onUpdateMapping?: (mappingId: string, updates: Partial<FieldMapping>) => void;
  onApplyAiSuggestion?: (suggestion: MappingSuggestion) => void;
  onGenerateAiSuggestions?: () => void;
  isGeneratingAi?: boolean;
}

const DataMappingVisualizer: React.FC<DataMappingVisualizerProps> = ({ 
  objectType, 
  fieldMappings,
  aiSuggestions = [],
  onUpdateMapping,
  onApplyAiSuggestion,
  onGenerateAiSuggestions,
  isGeneratingAi = false
}) => {
  const [activeTab, setActiveTab] = useState<string>("mappings");

  const handleUpdateMapping = (mappingId: string, updates: Partial<FieldMapping>) => {
    if (onUpdateMapping) {
      onUpdateMapping(mappingId, updates);
    }
  };

  const getConfidenceStats = () => {
    if (!aiSuggestions.length) return null;
    
    const highConfidence = aiSuggestions.filter(s => s.confidence >= 80).length;
    const mediumConfidence = aiSuggestions.filter(s => s.confidence >= 60 && s.confidence < 80).length;
    const lowConfidence = aiSuggestions.filter(s => s.confidence < 60).length;
    
    return { highConfidence, mediumConfidence, lowConfidence };
  };

  const confidenceStats = getConfidenceStats();

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{objectType.name} Field Mapping</span>
            <Badge variant="outline" className="ml-2">
              {fieldMappings.length} Fields
            </Badge>
            {confidenceStats && (
              <div className="flex items-center gap-2 ml-4">
                <Brain className="h-4 w-4 text-primary" />
                <Badge variant="default" className="text-xs">
                  {confidenceStats.highConfidence} High Confidence
                </Badge>
                {confidenceStats.mediumConfidence > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {confidenceStats.mediumConfidence} Medium
                  </Badge>
                )}
                {confidenceStats.lowConfidence > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {confidenceStats.lowConfidence} Low
                  </Badge>
                )}
              </div>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {onGenerateAiSuggestions && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onGenerateAiSuggestions}
                disabled={isGeneratingAi}
                className="gap-2"
              >
                <Brain className="h-4 w-4" />
                {isGeneratingAi ? "Generating..." : "AI Enhance"}
              </Button>
            )}
            <MappingPreviewDialog objectType={objectType} fieldMappings={fieldMappings} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="mappings" className="flex items-center gap-2">
              Current Mappings
              <Badge variant="outline" className="text-xs">
                {fieldMappings.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="ai-suggestions" className="flex items-center gap-2">
              <Brain className="h-3 w-3" />
              AI Suggestions
              <Badge variant="outline" className="text-xs">
                {aiSuggestions.length}
              </Badge>
            </TabsTrigger>
            {confidenceStats && (
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Insights
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="mappings" className="m-0">
            {fieldMappings.length > 0 ? (
              <FieldMappingsTable 
                fieldMappings={fieldMappings} 
                onUpdateMapping={handleUpdateMapping} 
              />
            ) : (
              <EmptyMappingState />
            )}
          </TabsContent>

          <TabsContent value="ai-suggestions" className="m-0 p-6">
            {aiSuggestions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">AI-Generated Mapping Suggestions</h3>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => aiSuggestions.forEach(suggestion => 
                      onApplyAiSuggestion?.(suggestion)
                    )}
                  >
                    Apply All High Confidence
                  </Button>
                </div>
                <div className="space-y-3">
                  {aiSuggestions
                    .sort((a, b) => b.confidence - a.confidence)
                    .map((suggestion, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm">
                              {suggestion.source_field}
                            </code>
                            <span className="text-muted-foreground">→</span>
                            <code className="bg-muted px-2 py-1 rounded text-sm">
                              {suggestion.destination_field}
                            </code>
                          </div>
                          {suggestion.is_required && (
                            <Badge variant="outline" className="text-xs">Required Field</Badge>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onApplyAiSuggestion?.(suggestion)}
                        >
                          Apply
                        </Button>
                      </div>
                      <ConfidenceScoreDisplay 
                        suggestion={suggestion} 
                        showDetailedBreakdown={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No AI Suggestions Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Generate intelligent mapping suggestions using our AI engine.
                </p>
                {onGenerateAiSuggestions && (
                  <Button onClick={onGenerateAiSuggestions} disabled={isGeneratingAi}>
                    <Brain className="h-4 w-4 mr-2" />
                    {isGeneratingAi ? "Generating..." : "Generate AI Suggestions"}
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {confidenceStats && (
            <TabsContent value="insights" className="m-0 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Mapping Quality Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-emerald-200 bg-emerald-50/50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-emerald-700">
                          {confidenceStats.highConfidence}
                        </div>
                        <div className="text-sm text-emerald-600">High Confidence</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          80%+ confidence score
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-yellow-200 bg-yellow-50/50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-700">
                          {confidenceStats.mediumConfidence}
                        </div>
                        <div className="text-sm text-yellow-600">Medium Confidence</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          60-79% confidence score
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-red-200 bg-red-50/50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-700">
                          {confidenceStats.lowConfidence}
                        </div>
                        <div className="text-sm text-red-600">Needs Review</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Below 60% confidence
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {confidenceStats.lowConfidence > 0 && (
                  <Card className="border-amber-200 bg-amber-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800">Manual Review Recommended</h4>
                          <p className="text-sm text-amber-700 mt-1">
                            {confidenceStats.lowConfidence} mappings have low confidence scores and should be reviewed manually 
                            to ensure data accuracy during migration.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataMappingVisualizer;
