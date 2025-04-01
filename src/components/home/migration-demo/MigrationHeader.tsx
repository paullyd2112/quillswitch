
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
      ? "bg-red-100 text-red-600" 
      : "bg-orange-100 text-orange-600";
  };

  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className={`${getBgColor()} p-2 rounded-full`}>
          {icon}
        </div>
        <span className="font-medium">{title}</span>
      </div>
      <Badge variant="outline" className="backdrop-blur-sm">
        {type === "source" ? "Source" : "Destination"}
      </Badge>
    </div>
  );
};

export default MigrationHeader;
