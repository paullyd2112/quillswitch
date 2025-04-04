
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import ResourceTabs from "@/components/resources/ResourceTabs";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ContentSection 
          title="Resources & Support"
          description="Get help and learn more about QuillSwitch migration platform."
          centered
        >
          <ResourceTabs />
        </ContentSection>
      </div>
    </div>
  );
};

export default Resources;
