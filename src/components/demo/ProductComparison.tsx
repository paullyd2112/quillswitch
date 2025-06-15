
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "./product-comparison/constants";
import { CategorySection } from "./product-comparison/CategorySection";
import { ComparisonSummary } from "./product-comparison/ComparisonSummary";
import { FeatureCategory } from "./product-comparison/types";

const ProductComparison: React.FC = () => {
  const categories: FeatureCategory[] = ["experience", "security", "technical", "cost"];

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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 border-b-2 border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4 text-left align-middle">Key Differentiator</th>
                  <th className="py-3 px-4 text-center align-middle">
                    <div className="font-medium text-primary">QuillSwitch: Automated & Secure</div>
                    <div className="text-xs font-normal text-muted-foreground">Automated Migration</div>
                  </th>
                  <th className="py-3 px-4 text-center align-middle">
                    <div className="font-medium">Manual Export/Import (DIY)</div>
                    <div className="text-xs font-normal text-muted-foreground">Manual Export/Import</div>
                  </th>
                  <th className="py-3 px-4 text-center align-middle">
                    <div className="font-medium">Consulting Services</div>
                    <div className="text-xs font-normal text-muted-foreground">Professional Services</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <CategorySection key={category} category={category} features={features} />
                ))}
              </tbody>
            </table>
          </div>
          
          <ComparisonSummary />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductComparison;
