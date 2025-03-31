
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Info, 
  HelpCircle, 
  BookOpen, 
  MessageCircle 
} from "lucide-react";
import ResourceCard from "@/components/resources/ResourceCard";
import FaqSection from "@/components/resources/FaqSection";

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
            <ResourceCard
              icon={Info}
              title="About QuillSwitch"
              description="QuillSwitch was created to simplify data migration between CRMs and other enterprise systems. Our platform reduces the typical technical challenges and risks associated with migrations."
              linkHref="/about"
              linkText="Learn More"
            />

            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <FaqSection />
              </CardContent>
            </Card>
            
            <ResourceCard
              icon={BookOpen}
              title="Knowledge Base"
              description="Access our comprehensive collection of articles, guides, and documentation to better understand migration concepts and platform features."
            />
            
            <ResourceCard
              icon={HelpCircle}
              title="Tutorials and Guides"
              description="Step-by-step instructions to help you make the most of QuillSwitch, from initial setup to advanced migration scenarios."
            />

            <ResourceCard
              icon={MessageCircle}
              title="Contact Support"
              description="Need personalized assistance? Our support team is ready to help you with any questions or challenges you encounter."
            />
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default Resources;
