
import React from "react";
import { Database, Check } from "lucide-react";

type MigrationStatusProps = {
  status: "idle" | "loading" | "success";
};

const MigrationStatus = ({ status }: MigrationStatusProps) => {
  if (status === "idle") {
    return (
      <div className="flex items-center justify-center py-12 opacity-80">
        <Database className="h-8 w-8 text-brand-500 animate-pulse" />
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
          <div className="relative bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full backdrop-blur-sm">
            <Check className="h-8 w-8" />
          </div>
        </div>
        <div className="text-green-600 dark:text-green-400 font-medium">All data migrated successfully!</div>
      </div>
    );
  }

  return null;
};

export default MigrationStatus;
