
import React, { createContext, useContext } from "react";
import { useProjectData } from "./useProjectData";
import { useProjectActions } from "./useProjectActions";
import { DashboardContextType } from "./types";
import LoadingIndicator from "./LoadingIndicator";

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
  const {
    project,
    stages,
    objectTypes,
    errors,
    activities,
    fieldMappings,
    selectedObjectTypeId,
    isLoading,
    setSelectedObjectTypeId,
    setFieldMappings,
    setActivities,
    setProject
  } = useProjectData({ projectId });

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
