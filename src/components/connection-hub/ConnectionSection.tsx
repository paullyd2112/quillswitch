
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConnectionCard from "./ConnectionCard";
import { crmSystems, relatedApps } from "@/config/connectionSystems";

interface ConnectionSectionProps {
  title: string;
  description: string;
  type: "source" | "destination" | "related";
}

const ConnectionSection: React.FC<ConnectionSectionProps> = ({ 
  title, 
  description,
  type
}) => {
  // Get the appropriate systems based on type
  const systems = type === "related" ? relatedApps : crmSystems;
  
  // For "related" type, show all related apps
  // For other types, filter on the type field
  const filteredSystems = type === "related" 
    ? systems 
    : systems.filter(system => system.connectionType === type);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSystems.map(system => (
            <ConnectionCard 
              key={system.id}
              system={system}
              type={type}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionSection;
