
import React from "react";
import { RefreshCw } from "lucide-react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <div className="container px-4 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-brand-500" />
          <h2 className="text-xl font-medium">Loading migration data...</h2>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
