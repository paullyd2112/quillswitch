
import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/layout/Footer";

const LandingPage = () => {
  return (
    <div className="bg-friendly-bg text-friendly-text-primary min-h-screen font-nunito">
      <main>
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
