
import React from "react";
import ResourceCard from "@/components/resources/ResourceCard";
import { ResourceCardItem } from "@/components/resources/types";

interface ResourceCardsListProps {
  cards: ResourceCardItem[];
}

const ResourceCardsList = ({ cards }: ResourceCardsListProps) => {
  return (
    <div className="space-y-8">
      {cards.map((card, index) => (
        <ResourceCard
          key={`resource-card-${index}`}
          icon={card.icon}
          title={card.title}
          description={card.description}
          linkHref={card.linkHref}
          linkText={card.linkText}
        />
      ))}
    </div>
  );
};

export default ResourceCardsList;
