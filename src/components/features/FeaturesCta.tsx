
import React from "react";
import CallToAction from "@/components/common/CallToAction";

const FeaturesCta = () => {
  return (
    <CallToAction
      title="Ready to transform your CRM migration?"
      description="Start your migration today and experience the difference with QuillSwitch's powerful features."
      primaryButtonText="Start Migration"
      primaryButtonLink="/migrations/setup"
      secondaryButtonText="Learn More"
      secondaryButtonLink="/about"
      darkMode={false}
    />
  );
};

export default FeaturesCta;
