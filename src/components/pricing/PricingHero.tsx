
import React from "react";
import FadeIn from "@/components/animations/FadeIn";

const PricingHero: React.FC = () => {
  return (
    <FadeIn>
      <div className="text-center space-y-4">
        <div className="inline-block mb-2">
          <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            Simple, Transparent Pricing
          </span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
          Fixed-Price Migration Plans
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
          Choose the plan that fits your business size. No surprises, no hidden fees, no hourly rates.
        </p>
      </div>
    </FadeIn>
  );
};

export default PricingHero;
