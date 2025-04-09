
import React from "react";
import Navbar from "@/components/layout/Navbar";
import FeaturesHero from "@/components/features/FeaturesHero";
import FeaturesCategories from "@/components/features/FeaturesCategories";
import FeatureDeepDive from "@/components/features/FeatureDeepDive";
import FeaturesCta from "@/components/features/FeaturesCta";

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50">
      <Navbar />
      <FeaturesHero />
      <FeaturesCategories />
      <FeatureDeepDive />
      <FeaturesCta />
    </div>
  );
};

export default Features;
