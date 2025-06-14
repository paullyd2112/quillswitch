
import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import DemoLayout from "@/components/layout/DemoLayout";
import ProductComparison from "@/components/demo/ProductComparison";
import TryItExperience from "@/components/demo/TryItExperience";
import MigrationDemoSection from "@/components/home/MigrationDemoSection";
import CommonChallenges from "@/components/demo/CommonChallenges";
import ExpertKnowledgeBase from "@/components/demo/ExpertKnowledgeBase";
import DemoFooterCta from "@/components/demo/DemoFooterCta";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, FileText } from "lucide-react";
import MigrationPerformanceChart from "@/components/home/migration-demo/MigrationPerformanceChart";
import { useDemoReports } from "@/hooks/migration-demo/use-demo-reports";
import { toast } from "@/hooks/use-toast";

const Demo = () => {
  const { historyPoints } = useDemoReports();
  const navigate = useNavigate();
  
  const handleViewAllReports = () => {
    toast({
      title: "Demo Feature",
      description: "This would open a detailed reports dashboard in the full product.",
    });
    // In a real app, this would navigate to a reports page
    // navigate("/app/reports");
  };
  
  const handleDownloadPDF = () => {
    toast({
      title: "Demo Feature", 
      description: "This would download a detailed migration report as PDF in the full product.",
    });
    // In a real app, this would trigger a PDF download
    console.log("Demo: PDF download triggered");
  };
  
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
            
            <Separator />
            
            {/* Migration Reports Section */}
            <section id="migration-reports">
              <h2 className="text-2xl font-bold mb-6">Detailed Migration Reports</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-6 text-muted-foreground">
                    QuillSwitch provides comprehensive migration reports that give you insight into every aspect 
                    of your migration process. Track progress, identify issues, and measure performance with 
                    detailed analytics and visualizations.
                  </p>
                  
                  <div className="space-y-4">
                    <Card className="border border-border shadow-sm">
                      <CardContent className="p-4">
                        <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                          <FileBarChart className="h-5 w-5 text-brand-500" />
                          Performance Analytics
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Track migration speed, resource utilization, and throughput rates with 
                          real-time performance monitoring.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-border shadow-sm">
                      <CardContent className="p-4">
                        <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-brand-500" />
                          Data Quality Reports
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Ensure data integrity with comprehensive validation reports that identify 
                          and resolve inconsistencies before they become problems.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <Card className="h-full border border-border shadow-sm bg-slate-100/30 dark:bg-slate-800/30">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex-1 min-h-[300px] bg-card rounded-md border border-border p-4 mb-4 overflow-hidden">
                        <MigrationPerformanceChart progressHistory={historyPoints} />
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={handleDownloadPDF}>
                          Download PDF
                        </Button>
                        <Button onClick={handleViewAllReports}>
                          View All Reports
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
            
            <Separator />
            
            {/* Product Comparison */}
            <section id="product-comparison">
              <h2 className="text-2xl font-bold mb-6">How QuillSwitch Compares</h2>
              <ProductComparison />
            </section>
            
            <Separator />
            
            {/* Common Migration Challenges */}
            <section id="common-challenges">
              <h2 className="text-2xl font-bold mb-6">Common Migration Challenges</h2>
              <CommonChallenges />
            </section>
            
            <Separator />
            
            {/* Expert Knowledge Base */}
            <section id="expert-knowledge">
              <h2 className="text-2xl font-bold mb-6">Expert Knowledge Base</h2>
              <ExpertKnowledgeBase />
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
