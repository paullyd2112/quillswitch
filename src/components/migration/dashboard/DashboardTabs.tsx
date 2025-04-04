
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  ArrowUpDown,
  AlertTriangle,
  Activity,
  FileText,
  Settings,
  ListChecks,
  Clock
} from "lucide-react";
import { useDashboard } from "./DashboardContext";
import OverviewTab from "./tabs/OverviewTab";
import DataMappingTab from "./tabs/DataMappingTab";
import ValidationTab from "./tabs/ValidationTab";
import DeltaTab from "./tabs/DeltaTab";
import ErrorsTab from "./tabs/ErrorsTab";
import ActivityTab from "./tabs/ActivityTab";
import ReportsTab from "./tabs/ReportsTab";
import SettingsTab from "./tabs/SettingsTab";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  const { project } = useDashboard();

  if (!project) return null;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="overflow-auto">
        <TabsList className="mb-8">
          <TabsTrigger value="overview" className="gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="data-mapping" className="gap-1.5">
            <ArrowUpDown className="h-4 w-4" />
            <span>Data Mapping</span>
          </TabsTrigger>
          <TabsTrigger value="validation" className="gap-1.5">
            <ListChecks className="h-4 w-4" />
            <span>Validation</span>
          </TabsTrigger>
          <TabsTrigger value="delta" className="gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Delta Sync</span>
          </TabsTrigger>
          <TabsTrigger value="errors" className="gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span>Errors & Issues</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1.5">
            <Activity className="h-4 w-4" />
            <span>Activity Log</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5">
            <FileText className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="overview">
        <OverviewTab />
      </TabsContent>
      
      <TabsContent value="data-mapping">
        <DataMappingTab />
      </TabsContent>

      <TabsContent value="validation">
        <ValidationTab />
      </TabsContent>

      <TabsContent value="delta">
        <DeltaTab />
      </TabsContent>
      
      <TabsContent value="errors">
        <ErrorsTab />
      </TabsContent>
      
      <TabsContent value="activity">
        <ActivityTab />
      </TabsContent>
      
      <TabsContent value="reports">
        <ReportsTab />
      </TabsContent>
      
      <TabsContent value="settings">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
