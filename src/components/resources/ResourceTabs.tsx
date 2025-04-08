
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
    
    // Force close any open dropdowns by triggering a click outside event
    const closeDropdowns = () => {
      document.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    };
    
    // Small timeout to make sure the click event happens after tab change renders
    setTimeout(closeDropdowns, 50);
  }, [tabParam, defaultTab, navigate]);
  
  const handleTabChange = (value: string) => {
    // First close any open dropdowns
    document.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));
    
    // Then navigate to the new tab
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
