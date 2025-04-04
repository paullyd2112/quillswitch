
import React, { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OverviewTabContent from "./OverviewTabContent";
import FaqTabContent from "./FaqTabContent";
import { useLocation, useNavigate } from "react-router-dom";

const ResourceTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  
  // Default to 'overview' if no tab is specified
  const defaultTab = tabParam || 'overview';
  
  useEffect(() => {
    // Update the URL if needed when tab changes directly in the component
    if (!tabParam && defaultTab !== 'overview') {
      navigate(`/resources?tab=${defaultTab}`, { replace: true });
    }
  }, [tabParam, defaultTab, navigate]);
  
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
        <TabsTrigger value="faq">FAQ</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTabContent />
      </TabsContent>
      
      <TabsContent value="faq">
        <FaqTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default ResourceTabs;
