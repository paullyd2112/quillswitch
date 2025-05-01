
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import ToolCard from "./ToolCard";
import { relatedApps } from "@/config/connectionSystems";

interface IntegratedToolsSectionProps {
  step: string;
  title: string;
  description: string;
}

const IntegratedToolsSection: React.FC<IntegratedToolsSectionProps> = ({
  step,
  title,
  description
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Get unique categories
  const categories = Array.from(
    new Set(relatedApps.map(tool => tool.category))
  ).filter(Boolean);
  
  // Filter tools based on search and category
  const filteredTools = relatedApps.filter(tool => 
    (selectedCategory === "all" || tool.category === selectedCategory) &&
    (searchTerm === "" || tool.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
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
                placeholder="Search tools..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Badge>
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTools.map(tool => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
              />
            ))}
            
            {filteredTools.length === 0 && (
              <div className="col-span-full p-8 text-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">No matching tools found.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegratedToolsSection;
