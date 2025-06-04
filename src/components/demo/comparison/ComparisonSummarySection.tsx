
import React from "react";

const ComparisonSummarySection: React.FC = () => {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-semibold text-lg text-primary mb-3 text-center">QuillSwitch</h4>
          <p className="text-sm leading-relaxed">
            Offers the best of both worlds - the speed and cost-effectiveness of automated solutions with the reliability and customization typically only found in consultant-led migrations. Ideal for businesses that want predictable results without expensive services.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-3 text-center">DIY Manual Approach</h4>
          <p className="text-sm leading-relaxed">
            While appearing cost-effective initially, manual migrations typically consume extensive internal resources, introduce significant business disruption, and carry high risks of data loss or corruption. Best only for the smallest, simplest migrations.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-3 text-center">Migration Consultants</h4>
          <p className="text-sm leading-relaxed">
            Traditional consulting offers expertise but at premium prices ($10,000-$50,000+) and typically requires weeks or months to complete. While reliable for complex enterprise migrations, they're often unnecessary and cost-prohibitive for most businesses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSummarySection;
