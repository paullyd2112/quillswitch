
import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/layout/Footer";
import BaseLayout from "@/components/layout/BaseLayout";

const LandingPage = () => {
  return (
    <BaseLayout>
      <main>
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </BaseLayout>
  );
};

export default LandingPage;
