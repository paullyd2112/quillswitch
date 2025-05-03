
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MigrationStatusCard from "../MigrationStatusCard";
import MigrationClarityDashboard from "./MigrationClarityDashboard";
import MigrationSuccessSummary from "./MigrationSuccessSummary";
import { useMigrationDashboard } from "./context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ListChecks, Settings2, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  const { project, isLoading } = useMigrationDashboard();
  
  const handleProceedToDataSelection = () => {
    setActiveTab("data");
  };
  
  const handleFinishMigration = () => {
    // Navigate to the dashboard or home page
    window.location.href = "/dashboard";
  };
  
  const handleViewMigrationHistory = () => {
    setActiveTab("history");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clarity">Clarity</TabsTrigger>
          <TabsTrigger value="data">Data Selection</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="summary">Results</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        {project?.status === "completed" && (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Settings
          </Button>
        )}
      </div>
      
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6">
          <MigrationStatusCard project={project} />
          
          {project?.status === "pending" && (
            <div className="p-6 border rounded-lg bg-brand-50 text-center">
              <h3 className="text-lg font-medium text-brand-800 mb-2">Ready to Begin Migration</h3>
              <p className="text-brand-600 mb-4">Your systems are connected and ready for migration.</p>
              <Button 
                onClick={() => setActiveTab("clarity")}
                className="bg-brand-600 hover:bg-brand-700 gap-2"
              >
                View Migration Analysis <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {project?.status === "in_progress" && (
            <div className="p-6 border rounded-lg bg-blue-50 text-center">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Migration In Progress</h3>
              <p className="text-blue-600 mb-4">Your migration is currently running.</p>
              <Button 
                variant="outline"
                onClick={() => setActiveTab("summary")}
                className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                View Live Progress <Zap className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {project?.status === "completed" && (
            <div className="p-6 border rounded-lg bg-green-50 text-center">
              <h3 className="text-lg font-medium text-green-800 mb-2">Migration Complete</h3>
              <p className="text-green-600 mb-4">Your migration has been successfully completed.</p>
              <Button 
                onClick={() => setActiveTab("summary")}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                View Results <Check className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="clarity">
        <MigrationClarityDashboard projectId={project?.id} onProceed={handleProceedToDataSelection} />
      </TabsContent>
      
      <TabsContent value="data">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Select Data to Migrate</h2>
          <p className="text-muted-foreground">Choose which types of data you want to migrate from your source CRM(s).</p>
          
          <Separator />
          
          {/* Data selection form would go here */}
          <div className="p-8 border border-dashed rounded-lg text-center">
            <p className="text-muted-foreground mb-4">Data Selection Component will be implemented here</p>
            <Button 
              onClick={() => setActiveTab("mapping")}
              className="bg-brand-600 hover:bg-brand-700"
            >
              Continue to Field Mapping
            </Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="mapping">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Field Mapping</h2>
          <p className="text-muted-foreground">Review and adjust how fields map between your source and destination CRMs.</p>
          
          <Separator />
          
          {/* Field mapping component would go here */}
          <div className="p-8 border border-dashed rounded-lg text-center">
            <p className="text-muted-foreground mb-4">Field Mapping Component will be implemented here</p>
            <Button 
              onClick={() => setActiveTab("summary")}
              className="bg-brand-600 hover:bg-brand-700"
            >
              Start Migration
            </Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="summary">
        <MigrationSuccessSummary 
          projectId={project?.id} 
          onFinish={handleFinishMigration}
          onViewHistory={handleViewMigrationHistory}
        />
      </TabsContent>
      
      <TabsContent value="history">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Migration History</h2>
          <p className="text-muted-foreground">View the complete history of your migration activities.</p>
          
          <Separator />
          
          {/* Migration history component would go here */}
          <div className="p-8 border border-dashed rounded-lg text-center">
            <p className="text-muted-foreground mb-4">Migration History Component will be implemented here</p>
            <Button 
              variant="outline"
              onClick={() => setActiveTab("overview")}
            >
              Back to Overview
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
