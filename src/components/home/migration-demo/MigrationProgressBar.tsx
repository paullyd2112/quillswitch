
import React from "react";
import { Progress } from "@/components/ui/progress";

type MigrationProgressBarProps = {
  progress: number;
};

const MigrationProgressBar = ({ progress }: MigrationProgressBarProps) => {
  return (
    <div className="py-4 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Migration Progress</span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2 transition-all duration-700 ease-in-out" 
      />
    </div>
  );
};

export default MigrationProgressBar;
