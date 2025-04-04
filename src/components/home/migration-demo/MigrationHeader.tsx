
import React from "react";
import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type MigrationHeaderProps = {
  title: string;
  type: "source" | "destination";
  icon: React.ReactNode;
};

const MigrationHeader = ({ title, type, icon }: MigrationHeaderProps) => {
  const getBgColor = () => {
    return type === "source" 
      ? "bg-gradient-to-r from-red-100 to-orange-100 text-red-600 dark:from-red-900/30 dark:to-red-800/20 dark:text-red-400" 
      : "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-600 dark:from-orange-900/30 dark:to-amber-800/20 dark:text-orange-400";
  };

  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-100/50 dark:border-gray-800/50">
      <div className="flex items-center gap-3">
        <div className={`${getBgColor()} p-2 rounded-full backdrop-blur-sm`}>
          {icon}
        </div>
        <span className="font-medium tracking-wide">{title}</span>
      </div>
      <Badge variant="outline" className="backdrop-blur-sm border border-white/10 dark:border-gray-700/30 bg-white/10 dark:bg-black/10">
        {type === "source" ? "Source" : "Destination"}
      </Badge>
    </div>
  );
};

export default MigrationHeader;
