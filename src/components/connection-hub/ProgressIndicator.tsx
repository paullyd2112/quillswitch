
import React from "react";
import { useLocation } from "react-router-dom";
import { Check, CircleDot } from "lucide-react";

interface Step {
  id: string;
  name: string;
  path: string;
}

const migrationSteps: Step[] = [
  {
    id: "connect",
    name: "Connect Systems",
    path: "/connect"
  },
  {
    id: "setup",
    name: "Configure Migration",
    path: "/migrations/setup"
  },
  {
    id: "run",
    name: "Run Migration",
    path: "/setup-wizard"
  },
  {
    id: "validate",
    name: "Validate Results",
    path: "/migrations/validate"
  }
];

const ProgressIndicator: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine current step based on path
  const getCurrentStepIndex = (): number => {
    if (currentPath.includes("/connect")) return 0;
    if (currentPath.includes("/migrations/setup")) return 1;
    if (currentPath.includes("/setup-wizard")) return 2;
    if (currentPath.includes("/migrations/validate")) return 3;
    // Default to first step if path doesn't match
    return 0;
  };
  
  const currentStepIndex = getCurrentStepIndex();
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between">
        {migrationSteps.map((step, index) => {
          // Determine step status
          const isComplete = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;
          
          return (
            <div 
              key={step.id}
              className={`flex flex-col items-center relative flex-1 ${
                index !== migrationSteps.length - 1 ? "after:content-[''] after:h-[2px] after:w-full after:absolute after:top-4 after:left-1/2 after:bg-gray-200 dark:after:bg-gray-800" : ""
              }`}
            >
              <div 
                className={`z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isComplete 
                    ? "bg-green-100 border-green-500 text-green-600 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400" 
                    : isCurrent 
                      ? "bg-brand-100 border-brand-500 text-brand-600 dark:bg-brand-900/30 dark:border-brand-700 dark:text-brand-400" 
                      : "bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-700"
                }`}
              >
                {isComplete ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <CircleDot className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-xs font-medium text-center">
                <span className={`${
                  isCurrent 
                    ? "text-brand-600 dark:text-brand-400" 
                    : isComplete 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-gray-500 dark:text-gray-400"
                }`}>
                  {step.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
