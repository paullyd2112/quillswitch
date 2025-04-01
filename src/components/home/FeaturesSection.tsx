
import React from "react";
import { Zap, Database, Shield, Repeat } from "lucide-react";
import ContentSection from "@/components/layout/ContentSection";
import SlideUp from "@/components/animations/SlideUp";
import FeatureCard from "@/components/ui-elements/FeatureCard";

const FeaturesSection = () => {
  return (
    <ContentSection>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SlideUp delay="none">
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-brand-500" />}
            title="Automated Mapping"
            description="Smart field mapping between different CRM systems with AI assistance"
          />
        </SlideUp>
        <SlideUp delay="100">
          <FeatureCard
            icon={<Database className="h-10 w-10 text-brand-500" />}
            title="Full Data Transfer"
            description="Move contacts, deals, tickets, and custom objects between systems"
          />
        </SlideUp>
        <SlideUp delay="200">
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-brand-500" />}
            title="Data Security"
            description="Enterprise-grade security with encrypted data transfer and zero storage"
          />
        </SlideUp>
        <SlideUp delay="300">
          <FeatureCard
            icon={<Repeat className="h-10 w-10 text-brand-500" />}
            title="API-First Approach"
            description="Integrate with our APIs for programmatic migration of customer data"
          />
        </SlideUp>
      </div>
    </ContentSection>
  );
};

export default FeaturesSection;
