
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
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="h-6 w-1 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></div>
          Try QuillSwitch Migration
        </CardTitle>
        <CardDescription>
          Experience a simulated CRM migration using sample data
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-8">
            <TabsTrigger value="connect" disabled={activeTab !== "connect" && !isConnectStepComplete}>
              1. Connect CRMs
            </TabsTrigger>
            <TabsTrigger value="select" disabled={activeTab !== "select" && !isSelectStepComplete}>
              2. Select Data
            </TabsTrigger>
            <TabsTrigger value="map" disabled={activeTab !== "map" && !isMappingStepComplete}>
              3. Map Fields
            </TabsTrigger>
            <TabsTrigger value="validate" disabled={activeTab !== "validate" && !isValidationStepComplete}>
              4. Validate
            </TabsTrigger>
            <TabsTrigger value="migrate" disabled={activeTab === "migrate" ? false : !isValidationStepComplete}>
              5. Migrate
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
