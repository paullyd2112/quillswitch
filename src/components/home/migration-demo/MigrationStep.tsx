
import React from "react";
import { Check, Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type MigrationStepProps = {
  name: string;
  status: 'idle' | 'in_progress' | 'complete';
  progress: number;
  isActive?: boolean;
};

const MigrationStep = ({ name, status, progress, isActive }: MigrationStepProps) => {
  return (
    <div 
      className={`space-y-1.5 transition-all duration-500 ease-out ${
        status === 'in_progress' || isActive
          ? 'scale-105 transform' 
          : status === 'complete' 
            ? 'opacity-90' 
            : 'opacity-60'
      }`}
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {status === 'idle' && 
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
          }
          {status === 'in_progress' && 
            <Loader className="w-3 h-3 text-brand-500 animate-spin" />
          }
          {status === 'complete' && 
            <Check className="w-3 h-3 text-green-500" />
          }
          <span 
            className={`${
              status === 'in_progress' 
                ? "font-medium text-brand-500" 
                : status === 'complete' 
                  ? "font-medium text-green-500" 
                  : ""
            } transition-colors duration-300`}
          >
            {name}
          </span>
        </div>
        <span 
          className={`transition-opacity duration-300 ${
            status === 'idle' ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {progress}%
        </span>
      </div>
      {status !== 'idle' && (
        <Progress 
          value={progress} 
          className={`h-1 transition-all duration-300 ease-out ${
            status === 'in_progress' ? 'bg-opacity-80' : ''
          }`} 
        />
      )}
    </div>
  );
};

export default MigrationStep;
