
import React from "react";
import { CheckCircle } from "lucide-react";

const DemoFooter = () => {
  return (
    <div className="text-center">
      <p className="text-slate-400 text-lg mb-6">
        This interactive demo shows our actual migration interface
      </p>
      <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span>Real-time validation</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span>Automatic error handling</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span>Zero downtime guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span>Enterprise security</span>
        </div>
      </div>
    </div>
  );
};

export default DemoFooter;
