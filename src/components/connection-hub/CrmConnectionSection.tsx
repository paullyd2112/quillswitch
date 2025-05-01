
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import CrmSystemCard from "./CrmSystemCard";
import { crmSystems } from "@/config/connectionSystems";

interface CrmConnectionSectionProps {
  step: string;
  title: string;
  description: string;
  type: "source" | "destination";
}

const CrmConnectionSection: React.FC<CrmConnectionSectionProps> = ({
  step,
  title,
  description,
  type
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  
  // Filter the CRM systems based on type
  const typedSystems = crmSystems.filter(system => 
    system.connectionType === type && 
    (searchTerm === "" || 
     system.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Get popular systems first
  const popularSystems = typedSystems.filter(system => system.popular);
  const otherSystems = typedSystems.filter(system => !system.popular);
  
  // Combined systems with popular first
  const displaySystems = [...popularSystems, ...otherSystems];
  
  return (
    <Card className="border-2 border-slate-200 dark:border-slate-800">
      <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-medium">
            {step}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="relative w-full md:w-auto flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search CRM systems..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={category === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setCategory("all")}
              >
                All
              </Badge>
              <Badge
                variant={category === "popular" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setCategory("popular")}
              >
                Popular
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displaySystems.map(system => (
              <CrmSystemCard
                key={`${system.id}-${system.connectionType}`}
                system={system}
                type={type}
              />
            ))}
            
            {displaySystems.length === 0 && (
              <div className="col-span-full p-8 text-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">No matching CRM systems found.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrmConnectionSection;
