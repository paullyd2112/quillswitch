import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import RealDataDemo from "@/components/demo/RealDataDemo";

const RealDataDemoPage: React.FC = () => {
  return (
    <BaseLayout>
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <RealDataDemo />
      </div>
    </BaseLayout>
  );
};

export default RealDataDemoPage;