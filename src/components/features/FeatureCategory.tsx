
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
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-800 hover:border-brand-600/50 transition-all duration-300">
      <div className="mb-4 text-brand-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-slate-400 mb-4">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Button asChild variant="outline" size="sm" className="w-full border-slate-700 hover:bg-slate-800 text-brand-300 hover:text-brand-200">
        <Link to={linkTo}>
          {linkText} <ArrowRight size={16} className="ml-2" />
        </Link>
      </Button>
    </div>
  );
};

export default FeatureCategory;
