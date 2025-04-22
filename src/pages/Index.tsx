
import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 relative">
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      <div className="relative">
        <Navbar />
        <main className="pt-16">
          <HeroSection />
          <FeaturesSection />
          <CtaSection />
        </main>
      </div>
    </div>
  );
};

export default Index;
