
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConnectTab from "./try-it-experience/tabs/ConnectTab";
import SelectTab from "./try-it-experience/tabs/SelectTab";
import MapTab from "./try-it-experience/tabs/MapTab";
import ValidateTab from "./try-it-experience/tabs/ValidateTab";
import MigrateTab from "./try-it-experience/tabs/MigrateTab";
import { useTryItExperience } from "./try-it-experience/hooks/useTryItExperience";
import { TabType } from "./try-it-experience/types";

const TryItExperience: React.FC = () => {
  const {
    activeTab,
    sourceCrm,
    targetCrm,
    searchTerm,
    selectedDataTypes,
    mappingProgress,
    isFieldMappingComplete,
    isValidating,
    validationProgress,
    isValidationComplete,
    isMigrating,
    migrationProgress,
    isMigrationComplete,
    migrationStats,
    filteredCrmSystems,
    dataTypes,
    isConnectStepComplete,
    isSelectStepComplete,
    isMappingStepComplete,
    isValidationStepComplete,
    setActiveTab,
    setSearchTerm,
    handleSelectSourceCrm,
    handleSelectTargetCrm,
    handleToggleDataType,
    handleStartFieldMapping,
    handleRunValidation,
    handleStartMigration,
    handleProceedToNextStep,
    formatTime
  } = useTryItExperience();

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
  };

  return (
    <Card className="glass-panel border-primary/20 shadow-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-3xl">
          <div className="relative">
            <div className="h-8 w-2 bg-gradient-to-b from-primary via-primary/80 to-accent rounded-full"></div>
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/40 to-accent/40 rounded-full blur-sm -z-10"></div>
          </div>
          <span className="bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">
            Try QuillSwitch Migration
          </span>
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Experience a complete simulated CRM migration workflow using realistic sample data
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-8 h-auto p-1 bg-secondary/50 backdrop-blur-sm">
            <TabsTrigger 
              value="connect" 
              disabled={activeTab !== "connect" && !isConnectStepComplete}
              className="flex flex-col items-center p-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
            >
              <span className="font-semibold text-sm">Step 1</span>
              <span className="text-xs opacity-80">Connect CRMs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="select" 
              disabled={activeTab !== "select" && !isSelectStepComplete}
              className="flex flex-col items-center p-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
            >
              <span className="font-semibold text-sm">Step 2</span>
              <span className="text-xs opacity-80">Select Data</span>
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              disabled={activeTab !== "map" && !isMappingStepComplete}
              className="flex flex-col items-center p-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
            >
              <span className="font-semibold text-sm">Step 3</span>
              <span className="text-xs opacity-80">Map Fields</span>
            </TabsTrigger>
            <TabsTrigger 
              value="validate" 
              disabled={activeTab !== "validate" && !isValidationStepComplete}
              className="flex flex-col items-center p-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
            >
              <span className="font-semibold text-sm">Step 4</span>
              <span className="text-xs opacity-80">Validate</span>
            </TabsTrigger>
            <TabsTrigger 
              value="migrate" 
              disabled={activeTab === "migrate" ? false : !isValidationStepComplete}
              className="flex flex-col items-center p-4 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
            >
              <span className="font-semibold text-sm">Step 5</span>
              <span className="text-xs opacity-80">Migrate</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect">
            <ConnectTab
              sourceCrm={sourceCrm}
              targetCrm={targetCrm}
              searchTerm={searchTerm}
              filteredCrmSystems={filteredCrmSystems}
              onSearchChange={setSearchTerm}
              onSelectSourceCrm={handleSelectSourceCrm}
              onSelectTargetCrm={handleSelectTargetCrm}
              onNext={handleProceedToNextStep}
              isComplete={!!isConnectStepComplete}
            />
          </TabsContent>
          
          <TabsContent value="select">
            <SelectTab
              dataTypes={dataTypes}
              selectedDataTypes={selectedDataTypes}
              sourceCrm={sourceCrm?.name || ""}
              targetCrm={targetCrm?.name || ""}
              onToggleDataType={handleToggleDataType}
              onNext={handleProceedToNextStep}
              onBack={() => setActiveTab("connect")}
              isComplete={!!isSelectStepComplete}
            />
          </TabsContent>
          
          <TabsContent value="map">
            <MapTab
              sourceCrm={sourceCrm?.name || ""}
              targetCrm={targetCrm?.name || ""}
              mappingProgress={mappingProgress}
              isFieldMappingComplete={isFieldMappingComplete}
              onStartFieldMapping={handleStartFieldMapping}
              onNext={handleProceedToNextStep}
              onBack={() => setActiveTab("select")}
              isComplete={!!isMappingStepComplete}
            />
          </TabsContent>
          
          <TabsContent value="validate">
            <ValidateTab
              sourceCrm={sourceCrm?.name || ""}
              targetCrm={targetCrm?.name || ""}
              validationProgress={validationProgress}
              isValidating={isValidating}
              isValidationComplete={isValidationComplete}
              onRunValidation={handleRunValidation}
              onNext={handleProceedToNextStep}
              onBack={() => setActiveTab("map")}
              isComplete={!!isValidationStepComplete}
            />
          </TabsContent>
          
          <TabsContent value="migrate">
            <MigrateTab
              sourceCrm={sourceCrm?.name || ""}
              targetCrm={targetCrm?.name || ""}
              selectedDataTypes={selectedDataTypes}
              dataTypes={dataTypes}
              migrationProgress={migrationProgress}
              isMigrating={isMigrating}
              isMigrationComplete={isMigrationComplete}
              migrationStats={migrationStats}
              onStartMigration={handleStartMigration}
              onBack={() => setActiveTab("validate")}
              formatTime={formatTime}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TryItExperience;
