
import React from "react";
import { Wand2, Database, Shield, GitMerge, ListChecks, BellRing, Calendar, UploadCloud } from "lucide-react";
import ContentSection from "@/components/layout/ContentSection";
import SlideUp from "@/components/animations/SlideUp";
import FeatureCard from "@/components/ui-elements/FeatureCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
  return (
    <ContentSection>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Powerful Features for Seamless Migrations</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Our comprehensive toolkit simplifies every aspect of CRM migration, from initial data mapping to ongoing synchronization.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <SlideUp delay="none">
          <FeatureCard
            icon={<Wand2 className="h-10 w-10 text-brand-500" />}
            title="Intelligent Field Mapping"
            description="Advanced pattern-based field mapping with smart suggestions and similarity detection"
          />
        </SlideUp>
        <SlideUp delay="100">
          <FeatureCard
            icon={<GitMerge className="h-10 w-10 text-brand-500" />}
            title="Delta Synchronization"
            description="Keep your data in sync with incremental updates after the initial migration"
          />
        </SlideUp>
        <SlideUp delay="200">
          <FeatureCard
            icon={<ListChecks className="h-10 w-10 text-brand-500" />}
            title="Data Validation"
            description="Ensure data quality with customizable validation rules and quality checks"
          />
        </SlideUp>
        <SlideUp delay="300">
          <FeatureCard
            icon={<BellRing className="h-10 w-10 text-brand-500" />}
            title="Real-time Notifications"
            description="Stay informed with webhooks and in-app notifications about migration progress"
          />
        </SlideUp>
        <SlideUp delay="400">
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-brand-500" />}
            title="Data Security"
            description="Enterprise-grade security with encrypted data transfer and zero storage"
          />
        </SlideUp>
        <SlideUp delay="500">
          <FeatureCard
            icon={<Calendar className="h-10 w-10 text-brand-500" />}
            title="Scheduled Migrations"
            description="Plan and execute migrations during off-hours with flexible scheduling"
          />
        </SlideUp>
      </div>
      
      <div className="text-center">
        <Button asChild className="gap-2">
          <Link to="/features">
            View All Features <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </ContentSection>
  );
};

export default FeaturesSection;
