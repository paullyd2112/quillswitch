
import React, { createContext, useContext, useState } from "react";
import { useProjectData } from "./useProjectData";
import { useProjectActions } from "./useProjectActions";
import { DashboardContextType } from "./types";
import LoadingIndicator from "./LoadingIndicator";
import { LoadingFallback } from "@/components/pages/migration";

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export const DashboardProvider: React.FC<{ 
  children: React.ReactNode; 
  projectId: string;
}> = ({ children, projectId }) => {
  const [loadError, setLoadError] = useState<Error | null>(null);

  const {
    project,
    stages,
    objectTypes,
    errors,
    activities,
    fieldMappings,
    selectedObjectTypeId,
    isLoading,
    isRefreshing,
    hasError,
    errorMessage,
    setSelectedObjectTypeId,
    setFieldMappings,
    setActivities,
    setProject
  } = useProjectData({ 
    projectId, 
    onError: (error) => setLoadError(error),
    retryOnError: true,
    autoRetryCount: 2
  });

  const {
    isProcessing,
    handleObjectTypeSelect: baseHandleObjectTypeSelect,
    refreshFieldMappings,
    handleToggleMigrationStatus,
    handleSaveDeltaConfig
  } = useProjectActions({
    project,
    selectedObjectTypeId,
    setFieldMappings,
    setActivities,
    setProject
  });

  // Wrapper to also update the selected ID in state
  const handleObjectTypeSelect = (objectTypeId: string) => {
    setSelectedObjectTypeId(objectTypeId);
    baseHandleObjectTypeSelect(objectTypeId);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (loadError || hasError) {
    return (
      <LoadingFallback 
        error={loadError || new Error(errorMessage || "Failed to load project data")}
        autoRetryCount={2}
      />
    );
  }

  // Handle case when project not found
  if (!project) {
    return (
      <LoadingFallback 
        error={new Error("Migration project not found. It may have been deleted or you don't have access to it.")}
      />
    );
  }

  const value: DashboardContextType = {
    project,
    projectId,
    stages,
    objectTypes,
    errors,
    activities,
    selectedObjectTypeId,
    fieldMappings,
    isProcessing,
    isLoading: isLoading || isRefreshing,
    handleObjectTypeSelect,
    handleToggleMigrationStatus,
    handleSaveDeltaConfig,
    refreshFieldMappings,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
