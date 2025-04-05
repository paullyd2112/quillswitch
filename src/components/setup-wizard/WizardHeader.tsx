
import React from "react";
import { Badge } from "@/components/ui/badge";
import FadeIn from "@/components/animations/FadeIn";

const WizardHeader: React.FC = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
              Migration Setup
            </Badge>
          </FadeIn>
          <FadeIn delay="100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              CRM Migration Wizard
            </h1>
          </FadeIn>
          <FadeIn delay="200">
            <p className="text-xl text-muted-foreground mb-8">
              Configure your CRM migration in just a few steps to switch platforms seamlessly
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default WizardHeader;
