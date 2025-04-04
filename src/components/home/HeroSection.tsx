
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import FadeIn from "@/components/animations/FadeIn";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
              CRM Migration Made Simple
            </Badge>
          </FadeIn>
          <FadeIn delay="100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Seamless CRM Migration, Simplified
            </h1>
          </FadeIn>
          <FadeIn delay="200">
            <p className="text-xl text-muted-foreground mb-8">
              Painlessly migrate from Salesforce to HubSpot, or between any other CRMs, 
              without expensive consultants or complicated processes.
            </p>
          </FadeIn>
          <FadeIn delay="300">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link to="/migrations/setup">
                  Start Migration <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/api-docs">
                  API Documentation
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
