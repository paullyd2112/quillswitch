
import React from "react";
import ResourceCard from "@/components/resources/ResourceCard";
import { Info, BookOpen, MessageCircle, FileQuestion, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OverviewTabContent = () => {
  return (
    <div className="space-y-8">
      <ResourceCard
        icon={Info}
        title="About QuillSwitch"
        description="QuillSwitch was created to simplify data migration between CRMs and other enterprise systems. Our platform reduces the typical technical challenges and risks associated with migrations."
        linkHref="/about"
        linkText="Learn More"
      />
      
      <ResourceCard
        icon={BookOpen}
        title="Knowledge Base"
        description="Access our comprehensive collection of articles, guides, and documentation to better understand migration concepts and platform features."
        linkHref="/knowledge-base"
        linkText="Browse Knowledge Base"
      >
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Button variant="outline" size="sm" asChild className="justify-start">
            <a href="/knowledge-base?category=getting-started">
              <HelpCircle className="mr-1.5 h-4 w-4" />
              Getting Started
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="justify-start">
            <a href="/knowledge-base?category=technical-guides">
              <FileQuestion className="mr-1.5 h-4 w-4" />
              Technical Guides
            </a>
          </Button>
        </div>
      </ResourceCard>

      <ResourceCard
        icon={MessageCircle}
        title="Contact Support"
        description="Need personalized assistance? Our support team is ready to help you with any questions or challenges you encounter."
      />
    </div>
  );
};

export default OverviewTabContent;
