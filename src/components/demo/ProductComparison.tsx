
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "./comparison/data";
import ComparisonHeaderRow from "./comparison/ComparisonHeaderRow";
import ComparisonCategorySection from "./comparison/ComparisonCategorySection";
import ComparisonSummarySection from "./comparison/ComparisonSummarySection";

const ProductComparison: React.FC = () => {
  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="h-6 w-1 bg-gradient-to-b from-cyan-500 to-indigo-500 rounded-full"></div>
          Product Comparison
        </CardTitle>
        <CardDescription>
          See how QuillSwitch compares to traditional migration approaches
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-8">
          {/* Header Row */}
          <ComparisonHeaderRow />
          
          {/* Category Sections */}
          <div className="space-y-6">
            <ComparisonCategorySection category="experience" features={features} />
            <ComparisonCategorySection category="technical" features={features} />
            <ComparisonCategorySection category="security" features={features} />
            <ComparisonCategorySection category="impact" features={features} />
          </div>
          
          {/* Summary Section */}
          <ComparisonSummarySection />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductComparison;
