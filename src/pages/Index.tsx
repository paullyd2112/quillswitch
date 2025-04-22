
import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <Navbar />
      <div className="pt-16 hero-gradient">
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </div>
    </div>
  );
};

export default Index;
