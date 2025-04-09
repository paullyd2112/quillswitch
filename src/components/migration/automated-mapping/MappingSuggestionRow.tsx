
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
import { getConfidenceColor, getConfidenceLabel } from "./utils";
import { MappingSuggestion } from "./types";

interface MappingSuggestionRowProps {
  suggestion: MappingSuggestion;
}

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
