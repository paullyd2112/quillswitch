
import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeatureCategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  linkTo: string;
  linkText: string;
}

const FeatureCategory = ({
  icon,
  title,
  description,
  features,
  linkTo,
  linkText
}: FeatureCategoryProps) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
      <div className="mb-4 text-brand-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button asChild variant="outline" size="sm" className="w-full">
        <Link to={linkTo}>
          {linkText} <ArrowRight size={16} className="ml-2" />
        </Link>
      </Button>
    </div>
  );
};

export default FeatureCategory;
