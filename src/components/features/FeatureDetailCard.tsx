
import React from "react";
import { CheckCircle } from "lucide-react";

interface FeatureDetailCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  isReversed?: boolean;
}

const FeatureDetailCard = ({
  icon,
  title,
  description,
  benefits,
  isReversed = false
}: FeatureDetailCardProps) => {
  return (
    <div className="mb-16">
      <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
        <div className="w-full">
          <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
            {icon}
            <h3 className="text-2xl font-semibold mb-3">{title}</h3>
            <p className="text-muted-foreground mb-4">
              {description}
            </p>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetailCard;
