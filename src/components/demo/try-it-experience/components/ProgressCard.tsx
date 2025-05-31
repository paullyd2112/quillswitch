
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ProgressCardProps {
  title: string;
  description: string;
  progress: number;
  isComplete: boolean;
  isLoading?: boolean;
  buttonText?: string;
  onStart?: () => void;
  loadingText?: string;
  sourceCrm?: string;
  targetCrm?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  description,
  progress,
  isComplete,
  isLoading = false,
  buttonText,
  onStart,
  loadingText,
  sourceCrm,
  targetCrm
}) => {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      
      <p className="text-muted-foreground mb-4">
        {description} {sourceCrm && targetCrm && `${sourceCrm} and ${targetCrm}`}.
      </p>
      
      {!isComplete && !isLoading ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{title.toLowerCase()} progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {buttonText && onStart && (
            <Button onClick={onStart} className="w-full">
              {buttonText}
            </Button>
          )}
        </div>
      ) : isLoading ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mr-3"></div>
            <div className="text-blue-600 dark:text-blue-400">
              {loadingText || `${title} in progress...`} {Math.round(progress)}% complete
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
          <div className="flex items-center text-green-700 dark:text-green-400">
            <Check className="h-5 w-5 mr-2" />
            <div className="font-medium">{title} Completed</div>
          </div>
          <div className="mt-2 text-green-600 dark:text-green-500 text-sm">
            All {title.toLowerCase()} have been successfully completed.
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;
