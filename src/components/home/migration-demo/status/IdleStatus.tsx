
import React from "react";
import { Database } from "lucide-react";

const IdleStatus = () => {
  return (
    <div className="flex items-center justify-center py-12 opacity-80">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-brand-400/20 animate-pulse"></div>
        <Database className="h-10 w-10 text-brand-500 relative" />
      </div>
    </div>
  );
};

export default IdleStatus;
