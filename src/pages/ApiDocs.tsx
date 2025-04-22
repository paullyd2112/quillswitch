
import React, { useState } from "react";
import ContentSection from "@/components/layout/ContentSection";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import BaseLayout from "@/components/layout/BaseLayout";
import ApiDocsHeader from "@/components/api-docs/ApiDocsHeader";
import ApiDocsSidebar from "@/components/api-docs/ApiDocsSidebar";
import ApiDocsTabs from "@/components/api-docs/ApiDocsTabs";

const ApiDocs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <BaseLayout className="bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <ApiDocsHeader />
      
      <ContentSection className="py-12 pb-32">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <ApiDocsSidebar 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </div>
          
          <div className="md:col-span-9">
            <GlassPanel>
              <ApiDocsTabs 
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </GlassPanel>
          </div>
        </div>
      </ContentSection>
    </BaseLayout>
  );
};

export default ApiDocs;
