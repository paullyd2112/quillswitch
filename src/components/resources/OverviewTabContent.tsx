
import React from "react";
import ResourceCard from "@/components/resources/ResourceCard";
import { Info, BookOpen, MessageCircle } from "lucide-react";

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
        icon={MessageCircle}
        title="Contact Support"
        description="Need personalized assistance? Our support team is ready to help you with any questions or challenges you encounter."
      />
    </div>
  );
};

export default OverviewTabContent;
