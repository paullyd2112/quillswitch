
import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CtaSection from "@/components/home/CtaSection";
import PreMigrationToolSection from "@/components/home/PreMigrationToolSection";
import RoiCalculatorSection from "@/components/home/RoiCalculatorSection";
import ApiPlaygroundPreview from "@/components/home/ApiPlaygroundPreview";
import PersonalizedPlansSection from "@/components/home/PersonalizedPlansSection";
import FeatureComparisonSection from "@/components/home/FeatureComparisonSection";
import MigrationHistorySection from "@/components/home/MigrationHistorySection";
import MappingVisualizerPreview from "@/components/home/MappingVisualizerPreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PreMigrationToolSection />
      <RoiCalculatorSection />
      <ApiPlaygroundPreview />
      <PersonalizedPlansSection />
      <FeatureComparisonSection />
      <MigrationHistorySection />
      <MappingVisualizerPreview />
      <CtaSection />
    </div>
  );
};

export default Index;
