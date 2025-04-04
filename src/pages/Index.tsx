
import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import MigrationDemoSection from "@/components/home/MigrationDemoSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <MigrationDemoSection />
      <CtaSection />
    </div>
  );
};

export default Index;
