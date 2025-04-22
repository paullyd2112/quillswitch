
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import FeaturesHero from "@/components/features/FeaturesHero";
import FeaturesCategories from "@/components/features/FeaturesCategories";
import FeatureDeepDive from "@/components/features/FeatureDeepDive";
import FeaturesCta from "@/components/features/FeaturesCta";

const Features = () => {
  return (
    <BaseLayout className="bg-slate-950 text-slate-300">
      <FeaturesHero />
      <FeaturesCategories />
      <FeatureDeepDive />
      <FeaturesCta />
    </BaseLayout>
  );
};

export default Features;
