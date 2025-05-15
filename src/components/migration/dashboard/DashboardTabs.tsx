
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MigrationStatusCard from "../MigrationStatusCard";
import MigrationClarityDashboard from "./MigrationClarityDashboard";
import MigrationSuccessSummary from "./MigrationSuccessSummary";
import { useDashboard } from "./context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ListChecks, Settings2, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  const { project, isLoading } = useDashboard();
  const navigate = useNavigate();
  
  const handleProceedToDataSelection = () => {
    setActiveTab("data");
  };
  
  const handleFinishMigration = () => {
    navigate("/app/migrations");
  };
  
  const handleViewMigrationHistory = () => {
    setActiveTab("history");
  };
  
  const handleStartNewMigration = () => {
    navigate("/setup-wizard");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        {project?.status === "completed" && (
          <Button 
            onClick={handleStartNewMigration} 
            variant="default" 
            size="sm" 
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            Start New Migration
          </Button>
        )}
      </div>
      
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6">
          <MigrationStatusCard project={project} />
          
          {project?.status === "pending" && (
            <div className="p-6 border rounded-lg bg-brand-50 dark:bg-slate-800 text-center">
              <h3 className="text-lg font-medium mb-2">Ready to Begin Migration</h3>
              <p className="text-muted-foreground mb-4">Your systems are connected and ready for migration.</p>
              <Button 
                onClick={() => setActiveTab("mapping")}
                className="gap-2"
              >
                Begin Data Mapping <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {project?.status === "in_progress" && (
            <div className="p-6 border rounded-lg bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-center">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Migration In Progress</h3>
              <p className="text-blue-600 dark:text-blue-400 mb-4">Your migration is currently running.</p>
              <Button 
                variant="outline"
                onClick={() => setActiveTab("progress")}
                className="gap-2 border-blue-300 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                View Live Progress <Zap className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {project?.status === "completed" && (
            <div className="p-6 border rounded-lg bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-center">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Migration Complete</h3>
              <p className="text-green-600 dark:text-green-400 mb-4">Your migration has been successfully completed.</p>
              <Button 
                onClick={() => setActiveTab("results")}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 gap-2"
              >
                View Results <Check className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="mapping">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Data Mapping</h2>
          <p className="text-muted-foreground">Map fields between your source and destination CRMs.</p>
          
          <Separator />
          
          {/* Data mapping component here */}
          <div className="p-8 border border-dashed rounded-lg text-center">
            <p className="text-muted-foreground mb-4">Data Mapping Component will be implemented here</p>
            <Button 
              onClick={() => setActiveTab("progress")}
              className="gap-2"
            >
              Start Migration <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="progress">
        <MigrationClarityDashboard projectId={project?.id} onProceed={() => setActiveTab("results")} />
      </TabsContent>
      
      <TabsContent value="results">
        <MigrationSuccessSummary 
          projectId={project?.id} 
          onFinish={handleFinishMigration}
          onViewHistory={() => {}}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
