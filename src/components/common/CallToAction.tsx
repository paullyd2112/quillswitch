
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  darkMode?: boolean;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  darkMode = false,
}) => {
  return (
    <section className="bg-modern-card border-y border-modern-border py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-modern-text-primary">{title}</h2>
        <p className="text-xl text-modern-text-secondary mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-modern-accent hover:bg-modern-accent/90 text-white">
            <Link to={primaryButtonLink}>
              {primaryButtonText}
            </Link>
          </Button>
          
          {secondaryButtonText && secondaryButtonLink && (
            <Button asChild variant="outline" size="lg" className="border-modern-border bg-modern-card hover:bg-modern-icon text-modern-text-primary">
              <Link to={secondaryButtonLink}>
                {secondaryButtonText}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
