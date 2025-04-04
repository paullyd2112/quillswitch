
import React from "react";
import MigrationHeader from "../MigrationHeader";
import { Database, ArrowRightLeft } from "lucide-react";

type MigrationHeaderSectionProps = {
  sourceTitle: string;
  destinationTitle: string;
  migrationStatus: "idle" | "loading" | "success";
}

const MigrationHeaderSection = ({ 
  sourceTitle, 
  destinationTitle,
  migrationStatus
}: MigrationHeaderSectionProps) => {
  return (
    <div className="flex items-center space-x-2 relative">
      <MigrationHeader 
        title={sourceTitle} 
        type="source" 
        icon={<Database size={20} />} 
      />
      
      <div className="flex-shrink-0 z-10">
        <ArrowRightLeft 
          size={20} 
          className={`transition-colors duration-500 ${
            migrationStatus === "loading" 
              ? "text-brand-500 animate-pulse" 
              : migrationStatus === "success" 
                ? "text-green-500" 
                : "text-gray-400"
          }`} 
        />
      </div>
      
      <MigrationHeader 
        title={destinationTitle} 
        type="destination" 
        icon={<Database size={20} />} 
      />
    </div>
  );
};

export default MigrationHeaderSection;
