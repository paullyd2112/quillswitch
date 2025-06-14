
import React from "react";
import { Helmet } from "react-helmet";
import { TooltipProvider } from "@/components/ui/tooltip";
import FadeIn from "@/components/animations/FadeIn";
import PricingLayout from "@/components/layout/PricingLayout";
import SavingsCalculator from "@/components/pricing/SavingsCalculator";
import PricingHero from "@/components/pricing/PricingHero";
import PricingTiers from "@/components/pricing/PricingTiers";
import ValueComparison from "@/components/pricing/ValueComparison";
import RecordDefinition from "@/components/pricing/RecordDefinition";
import FeaturesIncluded from "@/components/pricing/FeaturesIncluded";

const PricingEstimator: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Pricing | QuillSwitch - Affordable CRM Migration Solutions</title>
        <meta name="description" content="Transparent pricing for QuillSwitch CRM migration services. Calculate your savings and compare our affordable plans." />
      </Helmet>
      
      <PricingLayout>
        <TooltipProvider>
          <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute top-1/3 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            </div>
            
            <div className="container relative mx-auto px-4 py-8 z-10">
              <div className="max-w-6xl mx-auto space-y-12">
                {/* Hero section */}
                <section id="pricing-hero">
                  <PricingHero />
                </section>

                {/* Savings Calculator */}
                <section id="savings-calculator">
                  <FadeIn delay="100">
                    <SavingsCalculator />
                  </FadeIn>
                </section>

                {/* Pricing Tiers */}
                <section id="pricing-tiers">
                  <PricingTiers />
                </section>

                {/* Value Comparison */}
                <section id="value-comparison">
                  <ValueComparison />
                </section>

                {/* Record Definition */}
                <RecordDefinition />

                {/* Features Included */}
                <section id="features-included">
                  <FeaturesIncluded />
                </section>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </PricingLayout>
    </>
  );
};

export default PricingEstimator;
