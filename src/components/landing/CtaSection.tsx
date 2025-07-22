
import React from "react";
import CallToAction from "@/components/common/CallToAction";

const CtaSection = () => {
  return (
    <CallToAction
      title="Ready to Switch CRMs Without the Stress?"
      description="Join hundreds of businesses who've made the smart switch. Get your free migration assessment and see exactly how we'll move your data safely."
      primaryButtonText="Get Started"
      primaryButtonLink="/app/setup"
      darkMode={true}
    />
  );
};

export default CtaSection;
