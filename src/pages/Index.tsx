
import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 hero-gradient">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
};

export default Index;
