
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Connector } from "@/types/connectors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Link } from "lucide-react";

interface ConnectorCardProps {
  connector: Connector;
}

const ConnectorCard: React.FC<ConnectorCardProps> = ({ connector }) => {
  const { name, description, category, popular, features, setupComplexity } = connector;

  // Create a colored icon based on the connector name
  const getConnectorIcon = (name: string) => {
    const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-cyan-500'];
    const colorIndex = name.length % colors.length;
    
    return (
      <div className={`h-12 w-12 rounded ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-sm`}>
        {initials}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {getConnectorIcon(name)}
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">
                  {category}
                </Badge>
                {popular && <Badge className="bg-brand-500">Popular</Badge>}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-1">
        <CardDescription className="text-sm mb-4">{description}</CardDescription>
        
        <div className="mt-2">
          <h4 className="text-xs font-medium text-muted-foreground mb-1">TOP FEATURES</h4>
          <ul className="text-sm space-y-1">
            {features.slice(0, 3).map((feature) => (
              <li key={feature.id} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{feature.name}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 text-xs">
          <span className="font-medium">Setup: </span>
          <span className="capitalize">{setupComplexity}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-4 flex gap-3">
        <Button className="flex-1">Connect</Button>
        <Button variant="outline" size="icon">
          <Link className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectorCard;
