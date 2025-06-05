
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import FadeIn from "@/components/animations/FadeIn";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SavingsCalculator from "@/components/pricing/SavingsCalculator";
import PricingHero from "@/components/pricing/PricingHero";
import PricingTiers from "@/components/pricing/PricingTiers";
import ValueComparison from "@/components/pricing/ValueComparison";
import RecordDefinition from "@/components/pricing/RecordDefinition";
import FeaturesIncluded from "@/components/pricing/FeaturesIncluded";

const PricingEstimator: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <TooltipProvider>
        <div className="min-h-screen bg-background relative overflow-hidden pt-20">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-1/3 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container relative mx-auto px-4 py-8 pt-16 z-10">
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Hero section */}
              <PricingHero />

              {/* Savings Calculator */}
              <FadeIn delay="100">
                <SavingsCalculator />
              </FadeIn>

              {/* Pricing Tiers */}
              <PricingTiers />

              {/* Value Comparison */}
              <ValueComparison />

              {/* Record Definition */}
              <RecordDefinition />

              {/* Features Included */}
              <FeaturesIncluded />
            </div>
          </div>
        </div>
      </TooltipProvider>
      <Footer />
    </div>
  );
};

export default PricingEstimator;
