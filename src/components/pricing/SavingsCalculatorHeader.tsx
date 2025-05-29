
import React from "react";
import { Calculator } from "lucide-react";

const SavingsCalculatorHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
        <Calculator className="h-4 w-4" />
        Savings Calculator
      </div>
      <h2 className="text-3xl font-bold">Calculate Your Migration Savings</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        See how much time and money you can save by choosing QuillSwitch over traditional manual migration methods.
      </p>
    </div>
  );
};

export default SavingsCalculatorHeader;
