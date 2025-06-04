
import React from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ComparisonFeature } from "./types";
import ComparisonValueRenderer from "./ComparisonValueRenderer";

interface ComparisonFeatureRowProps {
  feature: ComparisonFeature;
}

const ComparisonFeatureRow: React.FC<ComparisonFeatureRowProps> = ({ feature }) => {
  return (
    <div 
      className="grid grid-cols-4 gap-4 py-4 px-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md transition-colors"
    >
      <div className="flex items-center gap-2 min-h-[2.5rem]">
        <span className="font-medium text-sm">{feature.name}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              {feature.description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center justify-center min-h-[2.5rem]">
        <ComparisonValueRenderer value={feature.quillswitch} />
      </div>
      <div className="flex items-center justify-center min-h-[2.5rem]">
        <ComparisonValueRenderer value={feature.manual} />
      </div>
      <div className="flex items-center justify-center min-h-[2.5rem]">
        <ComparisonValueRenderer value={feature.consultants} />
      </div>
    </div>
  );
};

export default ComparisonFeatureRow;
