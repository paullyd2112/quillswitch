
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface CallToActionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  className?: string;
  darkMode?: boolean;
}

const CallToAction = ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  className = "",
  darkMode = false,
}: CallToActionProps) => {
  const navigate = useNavigate();
  
  // Determine if the primary link is internal or external
  const isPrimaryInternal = !primaryButtonLink.startsWith('http');
  
  // Determine if the secondary link is internal or external
  const isSecondaryInternal = secondaryButtonLink ? !secondaryButtonLink.startsWith('http') : true;
  
  const containerClasses = darkMode
    ? `py-24 px-4 md:px-8 bg-brand-600/10 ${className}`
    : `py-16 px-4 md:px-6 bg-gray-50 dark:bg-slate-900/80 ${className}`;
    
  const titleClasses = darkMode
    ? "text-4xl font-bold mb-6 text-white"
    : "text-3xl font-bold mb-4 text-slate-900 dark:text-white";
    
  const descriptionClasses = darkMode
    ? "text-xl text-slate-300 max-w-2xl mx-auto mb-10"
    : "text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto";
    
  const primaryButtonClasses = darkMode
    ? "gap-2 bg-brand-600 hover:bg-brand-700"
    : "gap-2 bg-brand-500 hover:bg-brand-600 text-white";
    
  const secondaryButtonClasses = darkMode
    ? "gap-2 border-slate-700 hover:bg-slate-800 text-gray-300"
    : "gap-2";

  return (
    <section className={containerClasses}>
      <div className="container max-w-6xl mx-auto text-center">
        <h2 className={titleClasses}>{title}</h2>
        <p className={descriptionClasses}>{description}</p>
        
        <div className={`flex ${secondaryButtonText ? "flex-col sm:flex-row" : ""} justify-center gap-4`}>
          {isPrimaryInternal ? (
            <Button size="lg" onClick={() => navigate(primaryButtonLink)} className={primaryButtonClasses}>
              {primaryButtonText} <ArrowRight size={16} />
            </Button>
          ) : (
            <Button size="lg" className={primaryButtonClasses} asChild>
              <a href={primaryButtonLink}>{primaryButtonText} <ArrowRight size={16} /></a>
            </Button>
          )}
          
          {secondaryButtonText && secondaryButtonLink && (
            isSecondaryInternal ? (
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate(secondaryButtonLink)} 
                className={secondaryButtonClasses}
              >
                {secondaryButtonText}
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="outline" 
                className={secondaryButtonClasses}
                asChild
              >
                <a href={secondaryButtonLink}>{secondaryButtonText}</a>
              </Button>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
