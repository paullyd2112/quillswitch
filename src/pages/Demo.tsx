
import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import DemoLayout from "@/components/layout/DemoLayout";
import TryItExperience from "@/components/demo/TryItExperience";
import MigrationDemoSection from "@/components/home/MigrationDemoSection";
import DemoFooterCta from "@/components/demo/DemoFooterCta";
import { RealtimeDemo } from "@/components/realtime/RealtimeDemo";
import { Separator } from "@/components/ui/separator";

const Demo = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Demo | QuillSwitch - Experience CRM Migration Simplified</title>
        <meta name="description" content="Experience QuillSwitch's CRM migration capabilities with our interactive demo. See how our platform simplifies the migration process." />
      </Helmet>
      
      <DemoLayout>
        <div className="container px-4 py-16 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Experience QuillSwitch in Action</h1>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            See how QuillSwitch simplifies CRM migration with our interactive demo. 
            Compare our approach with traditional methods and discover the difference.
          </p>

          <div className="space-y-16">
            {/* Real-Time Collaboration Demo */}
            <section id="realtime-collaboration">
              <h2 className="text-2xl font-bold mb-6">Real-Time Collaboration</h2>
              <RealtimeDemo />
            </section>
            
            <Separator />
            
            {/* Interactive Demo Section */}
            <section id="migration-visualizer">
              <h2 className="text-2xl font-bold mb-6">Interactive Migration Visualizer</h2>
              <MigrationDemoSection />
            </section>
            
            <Separator />
            
            {/* Try It Yourself */}
            <section id="try-it-experience">
              <h2 className="text-2xl font-bold mb-6">Try It Yourself</h2>
              <TryItExperience />
            </section>
            
            {/* CTA Footer */}
            <section className="pt-8">
              <DemoFooterCta />
            </section>
          </div>
        </div>
      </DemoLayout>
    </>
  );
};

export default Demo;
