
import React from "react";

export const ComparisonSummary: React.FC = () => {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium text-lg text-primary mb-2 text-center">QuillSwitch</h4>
          <p className="text-sm">
            Offers the best of both worlds - the speed and cost-effectiveness of automated solutions with the reliability and customization typically only found in consultant-led migrations. Ideal for businesses that want predictable results without expensive services.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-medium text-lg mb-2 text-center">DIY Manual Approach</h4>
          <p className="text-sm">
            While appearing cost-effective initially, manual migrations typically consume extensive internal resources, introduce significant business disruption, and carry high risks of data loss or corruption. Best only for the smallest, simplest migrations.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-medium text-lg mb-2 text-center">Migration Consultants</h4>
          <p className="text-sm">
            Traditional consulting offers expertise but at premium prices ($10,000-$50,000+) and typically requires weeks or months to complete. While reliable for complex enterprise migrations, they're often unnecessary and cost-prohibitive for most businesses.
          </p>
        </div>
      </div>
    </div>
  );
};
