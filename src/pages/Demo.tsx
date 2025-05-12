
import React from "react";
import { Helmet } from "react-helmet";
import BaseLayout from "@/components/layout/BaseLayout";
import ProductComparison from "@/components/demo/ProductComparison";
import TryItExperience from "@/components/demo/TryItExperience";
import MigrationDemoSection from "@/components/home/MigrationDemoSection";
import CommonChallenges from "@/components/demo/CommonChallenges";
import ExpertKnowledgeBase from "@/components/demo/ExpertKnowledgeBase";
import DemoFooterCta from "@/components/demo/DemoFooterCta";
import { Separator } from "@/components/ui/separator";

const Demo = () => {
  return (
    <>
      <Helmet>
        <title>Demo | QuillSwitch - Experience CRM Migration Simplified</title>
        <meta name="description" content="Experience QuillSwitch's CRM migration capabilities with our interactive demo. See how our platform simplifies the migration process." />
      </Helmet>
      
      <BaseLayout>
        <div className="container px-4 py-16 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Experience QuillSwitch in Action</h1>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            See how QuillSwitch simplifies CRM migration with our interactive demo. 
            Compare our approach with traditional methods and discover the difference.
          </p>

          <div className="space-y-16">
            {/* Interactive Demo Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Interactive Migration Visualizer</h2>
              <MigrationDemoSection />
            </section>
            
            <Separator />
            
            {/* Try It Yourself */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Try It Yourself</h2>
              <TryItExperience />
            </section>
            
            <Separator />
            
            {/* Product Comparison */}
            <section>
              <h2 className="text-2xl font-bold mb-6">How QuillSwitch Compares</h2>
              <ProductComparison />
            </section>
            
            <Separator />
            
            {/* Common Migration Challenges */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Common Migration Challenges</h2>
              <CommonChallenges />
            </section>
            
            <Separator />
            
            {/* Expert Knowledge Base */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Expert Knowledge Base</h2>
              <ExpertKnowledgeBase />
            </section>
            
            {/* CTA Footer */}
            <section className="pt-8">
              <DemoFooterCta />
            </section>
          </div>
        </div>
      </BaseLayout>
    </>
  );
};

export default Demo;
