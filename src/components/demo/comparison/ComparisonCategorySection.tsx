
import React from "react";
import { ComparisonFeature } from "./types";
import ComparisonFeatureRow from "./ComparisonFeatureRow";

interface ComparisonCategorySectionProps {
  category: string;
  features: ComparisonFeature[];
}

const getCategoryTitle = (category: string): string => {
  switch (category) {
    case "experience":
      return "Migration Experience";
    case "technical":
      return "Technical Features";
    case "security":
      return "Security & Reliability";
    case "impact":
      return "Business Impact";
    default:
      return category;
  }
};

const ComparisonCategorySection: React.FC<ComparisonCategorySectionProps> = ({ category, features }) => {
  const categoryFeatures = features.filter(f => f.category === category);
  const categoryTitle = getCategoryTitle(category);
  
  return (
    <div className="mb-8">
      <div className="bg-slate-100 dark:bg-slate-800/80 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-lg text-center">{categoryTitle}</h3>
      </div>
      
      <div className="space-y-1">
        {categoryFeatures.map((feature) => (
          <ComparisonFeatureRow key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  );
};

export default ComparisonCategorySection;
