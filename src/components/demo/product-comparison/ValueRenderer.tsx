
import React from "react";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ValueRendererProps {
  value: boolean | string;
}

export const ValueRenderer: React.FC<ValueRendererProps> = ({ value }) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-red-500 mx-auto" />
    );
  }

  const strValue = String(value);

  if (strValue.startsWith('Limited')) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 hover:bg-amber-50 border-amber-200 dark:border-amber-700 py-0 px-2 h-5 whitespace-nowrap mx-auto">
        {strValue}
      </Badge>
    );
  } else if (strValue.startsWith('Varies')) {
    return (
      <Badge variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400 hover:bg-slate-50 border-slate-200 dark:border-slate-700 py-0 px-2 h-5 whitespace-nowrap mx-auto">
        {strValue}
      </Badge>
    );
  }

  return <span className="text-sm">{strValue}</span>;
};
