
import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import DemoLayout from "@/components/layout/DemoLayout";
import TryItExperience from "@/components/demo/TryItExperience";
import MigrationDemoSection from "@/components/home/MigrationDemoSection";
import DemoFooterCta from "@/components/demo/DemoFooterCta";
import DemoNavigation from "@/components/demo/DemoNavigation";

import ApiEndpointTester from "@/components/testing/ApiEndpointTester";
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
        <DemoNavigation />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          <div className="container px-4 py-20 max-w-7xl mx-auto relative">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
                <span className="text-sm font-medium text-primary">Interactive Demo Experience</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text text-transparent leading-tight">
                Experience QuillSwitch
                <br />
                <span className="text-primary">in Action</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                See how QuillSwitch transforms CRM migration with our interactive demo. 
                Experience real-time collaboration, automated field mapping, and seamless data transfer.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <div className="chip bg-primary/10 text-primary border border-primary/20">
                  ✨ Real-time collaboration
                </div>
                <div className="chip bg-secondary/10 text-secondary-foreground border border-secondary/20">
                  🚀 Automated mapping
                </div>
                <div className="chip bg-accent/10 text-accent-foreground border border-accent/20">
                  🔒 Enterprise security
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Sections */}
        <div className="container px-4 pb-16 max-w-7xl mx-auto">
          <div className="space-y-24">
            {/* Real-Time Collaboration Demo */}
            <section id="realtime-collaboration" className="scroll-mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">
                  Real-Time Collaboration
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Watch multiple team members collaborate on migrations in real-time with live presence indicators and instant updates.
                </p>
              </div>
              <div className="glass-panel p-8">
                <RealtimeDemo />
              </div>
            </section>
            
            <Separator className="opacity-30" />
            
            {/* Interactive Demo Section */}
            <section id="migration-visualizer" className="scroll-mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">
                  Interactive Migration Visualizer
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Watch our AI-powered migration engine in action with live progress tracking and performance metrics.
                </p>
              </div>
              <div className="glass-panel p-8">
                <MigrationDemoSection />
              </div>
            </section>
            
            <Separator className="opacity-30" />
            
            {/* Try It Yourself */}
            <section id="try-it-experience" className="scroll-mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">
                  Try It Yourself
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Experience the complete migration workflow from CRM connection to data transfer with our guided simulation.
                </p>
              </div>
              <TryItExperience />
            </section>
            
            <Separator className="opacity-30" />
            
            {/* API Testing */}
            <section id="api-testing" className="scroll-mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">
                  API Testing
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Test API functionality and endpoint reliability with our native migration tools.
                </p>
              </div>
              <div className="space-y-8">
                <ApiEndpointTester />
              </div>
            </section>
            
            {/* CTA Footer */}
            <section className="pt-12">
              <DemoFooterCta />
            </section>
          </div>
        </div>
      </DemoLayout>
    </>
  );
};

export default Demo;
