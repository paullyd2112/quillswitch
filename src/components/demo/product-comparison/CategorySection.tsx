
import React from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ComparisonFeature, FeatureCategory } from "./types";
import { categoryTitles } from "./constants";
import { ValueRenderer } from "./ValueRenderer";

interface CategorySectionProps {
  category: FeatureCategory;
  features: ComparisonFeature[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category, features }) => {
  const categoryFeatures = features.filter(f => f.category === category);
  
  return (
    <div>
      <h3 className="font-medium mb-4 text-center py-2 bg-slate-100 dark:bg-slate-800/80 rounded-md">
        {categoryTitles[category]}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {categoryFeatures.map((feature) => (
              <tr 
                key={feature.id}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="py-3 px-4 align-middle">
                  <div className="flex items-center gap-1">
                    {feature.name}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          {feature.description}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
                <td className="py-3 px-4 text-center align-middle h-16">
                  <ValueRenderer value={feature.quillswitch} />
                </td>
                <td className="py-3 px-4 text-center align-middle h-16">
                  <ValueRenderer value={feature.manual} />
                </td>
                <td className="py-3 px-4 text-center align-middle h-16">
                  <ValueRenderer value={feature.consultants} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
