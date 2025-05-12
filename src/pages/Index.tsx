
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";

const Index = () => {
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to QuillSwitch</h1>
        <p className="text-lg mb-4">
          Your simplified CRM data migration platform.
        </p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p>
            Start your first migration by connecting your CRM systems and following our guided process.
          </p>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Index;
