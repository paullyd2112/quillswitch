
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTabContent from "./OverviewTabContent";
import GuidesTabContent from "./GuidesTabContent";
import TutorialsTabContent from "./TutorialsTabContent";

const ResourceTabs = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <OverviewTabContent />
        </TabsContent>
        
        <TabsContent value="guides" className="mt-6">
          <GuidesTabContent />
        </TabsContent>
        
        <TabsContent value="tutorials" className="mt-6">
          <TutorialsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceTabs;
