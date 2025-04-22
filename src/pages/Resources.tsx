
import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import ResourceTabs from "@/components/resources/ResourceTabs";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
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
