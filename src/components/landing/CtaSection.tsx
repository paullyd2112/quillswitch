
import React from "react";
import CallToAction from "@/components/common/CallToAction";

const CtaSection = () => {
  return (
    <CallToAction
      title="Ready to Simplify Your CRM Migration?"
      description="Start your migration journey today and experience a seamless, intelligent transfer of your critical business data."
      primaryButtonText="Start Migration"
      primaryButtonLink="/migrations/setup"
      secondaryButtonText="View Features"
      secondaryButtonLink="/features"
      darkMode={true}
    />
  );
};

export default CtaSection;
