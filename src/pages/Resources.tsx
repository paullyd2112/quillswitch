
import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import ResourceTabs from "@/components/resources/ResourceTabs";
import BaseLayout from "@/components/layout/BaseLayout";

const Resources = () => {
  return (
    <BaseLayout>
      <ContentSection 
        title="Resources & Support"
        description="Get help and learn more about QuillSwitch migration platform."
        centered
      >
        <ResourceTabs />
      </ContentSection>
    </BaseLayout>
  );
};

export default Resources;
