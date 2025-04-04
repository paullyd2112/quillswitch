
import React from "react";
import { PlayCircle, RefreshCw, AlertCircle } from "lucide-react";

type MigrationFooterProps = {
  status: "idle" | "loading" | "success" | "error";
};

const MigrationFooter = ({ status }: MigrationFooterProps) => {
  if (status === "idle") {
    return (
      <div className="flex items-center justify-center mt-6 space-x-2 text-sm text-muted-foreground">
        <PlayCircle size={16} className="text-brand-400" />
        <span className="animate-pulse">Click to see a demo migration</span>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center mt-6 space-x-2 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400">
        <RefreshCw size={16} className="text-green-500" />
        <span>Migration complete! Click to run again</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center mt-6 space-x-2 text-sm font-medium text-red-500">
        <AlertCircle size={16} className="text-red-500" />
        <span>Migration failed. Click to try again</span>
      </div>
    );
  }

  return null;
};

export default MigrationFooter;
