
import React from "react";
import { Database, Check, Loader } from "lucide-react";
import type { MigrationStep } from "@/hooks/use-migration-demo";

type MigrationStatusProps = {
  status: "idle" | "loading" | "success";
  activeStep?: MigrationStep;
};

// Helper function to get random action verb based on step name
const getActionVerb = (stepName: string): string => {
  const verbsByType: Record<string, string[]> = {
    "Contacts": ["importing", "loading", "fetching", "retrieving", "processing"],
    "Opportunities & Deals": ["syncing", "analyzing", "processing", "transferring", "mapping"],
    "Activities & Tasks": ["transferring", "moving", "syncing", "processing", "organizing"],
    "Cases & Tickets": ["processing", "handling", "migrating", "transferring", "analyzing"],
    "Accounts & Companies": ["connecting", "linking", "integrating", "mapping", "processing"],
    "Custom Objects": ["configuring", "setting up", "integrating", "customizing", "processing"],
  };
  
  // Get the array of verbs for the given step name or use default
  const verbs = verbsByType[stepName] || ["migrating", "processing", "transferring"];
  
  // Pick a random verb from the array
  const randomIndex = Math.floor(Math.random() * verbs.length);
  return verbs[randomIndex];
};

const MigrationStatus = ({ status, activeStep }: MigrationStatusProps) => {
  if (status === "idle") {
    return (
      <div className="flex items-center justify-center py-12 opacity-80">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brand-400/20 animate-pulse"></div>
          <Database className="h-10 w-10 text-brand-500 relative" />
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="relative">
          {/* Outer rings */}
          <div className="absolute inset-0 rounded-full bg-brand-400/10 animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-[-8px] rounded-full border-2 border-brand-300/30 animate-spin" style={{ animationDuration: '4s' }}></div>
          
          {/* Inner spinning loader */}
          <div className="relative bg-gradient-to-br from-brand-100 to-transparent p-4 rounded-full backdrop-blur-sm">
            <Loader className="h-12 w-12 text-brand-500 animate-spin" />
          </div>
        </div>
        <div className="text-brand-500 font-medium tracking-wide">
          <span className="inline-block mr-2 shimmer">Migration in progress</span>
          <span className="inline-flex">
            <span className="animate-bounce delay-100" style={{ animationDuration: '1.5s' }}>.</span>
            <span className="animate-bounce delay-200" style={{ animationDuration: '1.5s' }}>.</span>
            <span className="animate-bounce delay-300" style={{ animationDuration: '1.5s' }}>.</span>
          </span>
        </div>
        
        {activeStep && (
          <div className="text-sm text-brand-400 animate-pulse" style={{ animationDuration: '2.5s' }}>
            <span>{activeStep.name} </span>
            <span className="opacity-80">
              {activeStep.status === 'in_progress' ? getActionVerb(activeStep.name) : ''}
              <span className="inline-flex">
                <span className="animate-bounce delay-100" style={{ animationDuration: '1.5s' }}>.</span>
                <span className="animate-bounce delay-200" style={{ animationDuration: '1.5s' }}>.</span>
                <span className="animate-bounce delay-300" style={{ animationDuration: '1.5s' }}>.</span>
              </span>
            </span>
          </div>
        )}
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="relative">
          {/* Success glow effect */}
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" style={{ animationDuration: '1.5s' }}></div>
          <div className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-green-400/30 to-emerald-500/30 animate-pulse"></div>
          
          {/* Success icon with glassy effect */}
          <div className="relative bg-gradient-to-br from-green-100 to-green-200/30 dark:from-green-900/40 dark:to-green-800/20 p-4 rounded-full backdrop-blur-md border border-green-200/50 dark:border-green-700/30">
            <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400 font-medium tracking-wide">
          All data migrated successfully!
        </div>
        <div className="text-xs text-center text-muted-foreground space-y-1">
          <div className="text-green-500 dark:text-green-400">✓ Contacts</div>
          <div className="text-green-500 dark:text-green-400">✓ Opportunities & Deals</div>
          <div className="text-green-500 dark:text-green-400">✓ Activities & Tasks</div>
          <div className="text-green-500 dark:text-green-400">✓ Cases & Tickets</div>
          <div className="text-green-500 dark:text-green-400">✓ Accounts & Companies</div>
          <div className="text-green-500 dark:text-green-400">✓ Custom Objects</div>
        </div>
      </div>
    );
  }

  return null;
};

export default MigrationStatus;
