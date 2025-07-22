import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Users, Clock } from "lucide-react";
import { MappingSuggestion } from "../automated-mapping/types";

interface ConfidenceScoreDisplayProps {
  suggestion: MappingSuggestion;
  showDetailedBreakdown?: boolean;
}

const ConfidenceScoreDisplay: React.FC<ConfidenceScoreDisplayProps> = ({ 
  suggestion, 
  showDetailedBreakdown = false 
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-emerald-500";
    if (confidence >= 75) return "bg-blue-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return "Very High";
    if (confidence >= 75) return "High";
    if (confidence >= 60) return "Medium";
    return "Low";
  };

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 90) return "default";
    if (confidence >= 75) return "secondary";
    if (confidence >= 60) return "outline";
    return "destructive";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Confidence:</span>
        </div>
        <Badge variant={getConfidenceBadgeVariant(suggestion.confidence)}>
          {suggestion.confidence}% {getConfidenceLabel(suggestion.confidence)}
        </Badge>
      </div>

      <div className="space-y-1">
        <Progress 
          value={suggestion.confidence} 
          className="h-2"
          style={{
            background: `linear-gradient(to right, ${getConfidenceColor(suggestion.confidence)} 0%, ${getConfidenceColor(suggestion.confidence)}20 100%)`
          }}
        />
        <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
      </div>

      {showDetailedBreakdown && suggestion.semanticAnalysis && (
        <div className="mt-4 p-3 bg-muted/20 rounded-lg space-y-2">
          <h4 className="text-sm font-medium">Semantic Analysis</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Data Type:</span>
              <Badge variant="outline" className="ml-1 text-xs">
                {suggestion.semanticAnalysis.dataType}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="outline" className="ml-1 text-xs">
                {suggestion.semanticAnalysis.fieldCategory}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Pattern:</span>
            <code className="ml-1 text-xs bg-muted px-1 rounded">
              {suggestion.semanticAnalysis.contentPattern}
            </code>
          </div>
        </div>
      )}

      {showDetailedBreakdown && suggestion.learningContext && (
        <div className="mt-3 p-3 bg-muted/20 rounded-lg space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            Learning Context
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span>{suggestion.learningContext.previousMappings} previous</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span>{suggestion.learningContext.successRate}% success</span>
            </div>
            {suggestion.learningContext.lastUsed && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>Last used: {suggestion.learningContext.lastUsed}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfidenceScoreDisplay;