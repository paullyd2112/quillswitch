
import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/layout/Footer";

const LandingPage = () => {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <Navbar />
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
