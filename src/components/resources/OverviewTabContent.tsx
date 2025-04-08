
import React from "react";
import ResourceCardsList from "@/components/resources/ResourceCardsList";
import { Info, MessageCircle } from "lucide-react";
import { ResourceCardItem } from "@/components/resources/types";

const OverviewTabContent = () => {
  const resourceCards: ResourceCardItem[] = [
    {
      icon: Info,
      title: "About QuillSwitch",
      description: "QuillSwitch was created to simplify data migration between CRMs and other enterprise systems. Our platform reduces the typical technical challenges and risks associated with migrations.",
      linkHref: "/about",
      linkText: "Learn More"
    },
    {
      icon: MessageCircle,
      title: "Contact Support",
      description: "Need personalized assistance? Our support team is ready to help you with any questions or challenges you encounter."
    }
  ];

  return <ResourceCardsList cards={resourceCards} />;
};

export default OverviewTabContent;
