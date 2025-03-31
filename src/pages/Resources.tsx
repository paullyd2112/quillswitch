
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import { Card, CardContent } from "@/components/ui/card";
import { Info, HelpCircle, BookOpen, FileQuestion, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <div className="grid gap-8 mt-10">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-brand-500" />
                  About QuillSwitch
                </h3>
                <p className="text-muted-foreground mb-4">
                  QuillSwitch was created to simplify data migration between CRMs and other enterprise systems.
                  Our platform reduces the typical technical challenges and risks associated with migrations.
                </p>
                <Button variant="outline" asChild>
                  <a href="/about">Learn More</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileQuestion className="h-5 w-5 text-brand-500" />
                  Frequently Asked Questions
                </h3>
                <p className="text-muted-foreground">
                  Find answers to common questions about our platform, migration processes,
                  and best practices for successful data transitions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-brand-500" />
                  Knowledge Base
                </h3>
                <p className="text-muted-foreground">
                  Access our comprehensive collection of articles, guides, and documentation
                  to better understand migration concepts and platform features.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-brand-500" />
                  Tutorials and Guides
                </h3>
                <p className="text-muted-foreground">
                  Step-by-step instructions to help you make the most of QuillSwitch,
                  from initial setup to advanced migration scenarios.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-brand-500" />
                  Contact Support
                </h3>
                <p className="text-muted-foreground">
                  Need personalized assistance? Our support team is ready to help you
                  with any questions or challenges you encounter.
                </p>
              </CardContent>
            </Card>
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default Resources;
