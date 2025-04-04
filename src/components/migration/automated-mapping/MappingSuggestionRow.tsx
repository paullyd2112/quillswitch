
import React from "react";
import { ArrowRight, Check, Info, X } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface MappingSuggestion {
  source_field: string;
  destination_field: string;
  confidence: number;
  is_required?: boolean;
  reason?: string;
}

interface MappingSuggestionRowProps {
  suggestion: MappingSuggestion;
}

export const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.9) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  if (confidence >= 0.7) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  if (confidence >= 0.5) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
};

export const getConfidenceLabel = (confidence: number) => {
  if (confidence >= 0.9) return "High";
  if (confidence >= 0.7) return "Medium";
  if (confidence >= 0.5) return "Low";
  return "Very Low";
};

const MappingSuggestionRow: React.FC<MappingSuggestionRowProps> = ({ suggestion }) => {
  return (
    <TableRow>
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
      <TableCell className="text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 mx-auto text-muted-foreground hover:text-brand-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-sm text-sm">{suggestion.reason || "Based on field name similarity"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
};

export default MappingSuggestionRow;
