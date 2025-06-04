
import React from "react";

const ComparisonHeaderRow: React.FC = () => {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/80 rounded-lg p-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="font-semibold text-left">Feature / Approach</div>
        <div className="text-center">
          <div className="font-semibold text-primary">QuillSwitch</div>
          <div className="text-xs text-muted-foreground mt-1">Automated Migration</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">DIY</div>
          <div className="text-xs text-muted-foreground mt-1">Manual Export/Import</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">Consultants</div>
          <div className="text-xs text-muted-foreground mt-1">Professional Services</div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonHeaderRow;
