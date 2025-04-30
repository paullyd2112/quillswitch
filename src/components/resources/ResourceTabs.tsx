
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OverviewTabContent from "./OverviewTabContent";
import { useLocation, useNavigate } from "react-router-dom";

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
      <TabsList className="grid w-full grid-cols-1 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default ResourceTabs;
