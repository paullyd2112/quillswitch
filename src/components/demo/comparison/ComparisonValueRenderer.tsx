
import React from "react";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComparisonValueRendererProps {
  value: boolean | string;
}

const ComparisonValueRenderer: React.FC<ComparisonValueRendererProps> = ({ value }) => {
  if (typeof value === "boolean") {
    if (value) {
      return <Check className="h-5 w-5 text-green-500 mx-auto" />;
    } else {
      return <X className="h-5 w-5 text-red-500 mx-auto" />;
    }
  } else if (value === "Limited") {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 hover:bg-amber-50 border-amber-200 dark:border-amber-700 text-xs px-2 py-1">
        Limited
      </Badge>
    );
  } else if (value === "Varies") {
    return (
      <Badge variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400 hover:bg-slate-50 border-slate-200 dark:border-slate-700 text-xs px-2 py-1">
        Varies
      </Badge>
    );
  } else {
    return <span className="text-sm text-center font-medium">{value}</span>;
  }
};

export default ComparisonValueRenderer;
