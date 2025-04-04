
import React from "react";
import ResourceCard from "@/components/resources/ResourceCard";
import { Info, BookOpen, Image, Presentation, MessageCircle } from "lucide-react";

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
      />

      <ResourceCard
        icon={Image}
        title="Screenshot Guides"
        description="Visual step-by-step instructions with annotated screenshots to help you navigate through common migration tasks."
        linkHref="/resources?tab=guides"
        linkText="View Guides"
      />

      <ResourceCard
        icon={Presentation}
        title="Quick Start Tutorials"
        description="Interactive slide-based tutorials that walk you through the essential steps to get started with QuillSwitch."
        linkHref="/resources?tab=tutorials"
        linkText="Start Learning"
      />

      <ResourceCard
        icon={MessageCircle}
        title="Contact Support"
        description="Need personalized assistance? Our support team is ready to help you with any questions or challenges you encounter."
      />
    </div>
  );
};

export default OverviewTabContent;
