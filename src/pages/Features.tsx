
import React from "react";
import FeaturesHero from "@/components/features/FeaturesHero";
import FeaturesCategories from "@/components/features/FeaturesCategories";
import FeatureDeepDive from "@/components/features/FeatureDeepDive";
import FeaturesCta from "@/components/features/FeaturesCta";

const Features = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <FeaturesHero />
      <FeaturesCategories />
      <FeatureDeepDive />
      <FeaturesCta />
    </div>
  );
};

export default Features;
