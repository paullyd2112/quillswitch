
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OverviewTabContent from "./OverviewTabContent";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const ResourceTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  
  // Default to 'overview' if no tab is specified
  const defaultTab = tabParam || 'overview';
  
  const handleTabChange = (value: string) => {
    navigate(`/resources?tab=${value}`, { replace: true });
  };
  
  return (
    <Tabs 
      defaultValue={defaultTab} 
      className="w-full mt-6"
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTabContent />
      </TabsContent>
      
      <TabsContent value="knowledge">
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <BookOpen className="h-12 w-12 text-brand-500" />
          <h3 className="text-xl font-semibold">Browse the Knowledge Base</h3>
          <p className="text-muted-foreground max-w-2xl">
            Our Knowledge Base contains detailed articles, guides, and documentation to help you navigate the QuillSwitch platform.
          </p>
          <Button size="lg" onClick={() => navigate('/knowledge-base')}>
            View Knowledge Base
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ResourceTabs;
