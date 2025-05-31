
import { useState } from "react";
import { CrmSystem, DataType, MigrationStats, TabType } from "../types";
import { crmSystems, dataTypes as initialDataTypes } from "../data";

export const useTryItExperience = () => {
  const [activeTab, setActiveTab] = useState<TabType>("connect");
  const [sourceCrm, setSourceCrm] = useState<CrmSystem | null>(null);
  const [targetCrm, setTargetCrm] = useState<CrmSystem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDataTypes, setSelectedDataTypes] = useState(
    initialDataTypes.filter(dt => dt.selected).map(dt => dt.id)
  );
  const [mappingProgress, setMappingProgress] = useState(0);
  const [isFieldMappingComplete, setIsFieldMappingComplete] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [isValidationComplete, setIsValidationComplete] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [isMigrationComplete, setIsMigrationComplete] = useState(false);
  const [migrationStats, setMigrationStats] = useState<MigrationStats>({
    recordsMigrated: 0,
    recordsPerSecond: 0,
    timeElapsed: 0
  });

  const filteredCrmSystems = crmSystems.filter(crm => 
    crm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSourceCrm = (crm: CrmSystem) => {
    setSourceCrm({...crm, isConnected: true});
    if (targetCrm && targetCrm.id === crm.id) {
      setTargetCrm(null);
    }
  };

  const handleSelectTargetCrm = (crm: CrmSystem) => {
    setTargetCrm({...crm, isConnected: true});
    if (sourceCrm && sourceCrm.id === crm.id) {
      setSourceCrm(null);
    }
  };

  const handleToggleDataType = (id: string) => {
    setSelectedDataTypes(prev => 
      prev.includes(id)
        ? prev.filter(dt => dt !== id)
        : [...prev, id]
    );
  };

  const handleStartFieldMapping = () => {
    setMappingProgress(0);
    setIsFieldMappingComplete(false);
    
    const interval = setInterval(() => {
      setMappingProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsFieldMappingComplete(true);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleRunValidation = () => {
    setIsValidating(true);
    setValidationProgress(0);
    setIsValidationComplete(false);
    
    const interval = setInterval(() => {
      setValidationProgress(prev => {
        const newProgress = prev + Math.random() * 8;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsValidating(false);
          setIsValidationComplete(true);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handleStartMigration = () => {
    setIsMigrating(true);
    setMigrationProgress(0);
    setIsMigrationComplete(false);
    
    const totalRecords = initialDataTypes
      .filter(dt => selectedDataTypes.includes(dt.id))
      .reduce((acc, dt) => acc + dt.count, 0);
    
    let recordsMigrated = 0;
    let timeCounter = 0;
    
    const interval = setInterval(() => {
      timeCounter += 0.3;
      const recordsThisInterval = Math.floor(Math.random() * 20) + 15;
      recordsMigrated = Math.min(totalRecords, recordsMigrated + recordsThisInterval);
      
      const progress = (recordsMigrated / totalRecords) * 100;
      setMigrationProgress(progress);
      
      setMigrationStats({
        recordsMigrated,
        recordsPerSecond: Math.floor(recordsMigrated / timeCounter),
        timeElapsed: Math.floor(timeCounter)
      });
      
      if (recordsMigrated >= totalRecords) {
        clearInterval(interval);
        setIsMigrating(false);
        setIsMigrationComplete(true);
      }
    }, 300);
  };

  const isConnectStepComplete = sourceCrm && targetCrm;
  const isSelectStepComplete = selectedDataTypes.length > 0;
  const isMappingStepComplete = isFieldMappingComplete;
  const isValidationStepComplete = isValidationComplete;

  const canProceedToNextStep = () => {
    if (activeTab === "connect") return isConnectStepComplete;
    if (activeTab === "select") return isSelectStepComplete;
    if (activeTab === "map") return isMappingStepComplete;
    if (activeTab === "validate") return isValidationStepComplete;
    return false;
  };

  const handleProceedToNextStep = () => {
    if (activeTab === "connect") setActiveTab("select");
    else if (activeTab === "select") setActiveTab("map");
    else if (activeTab === "map") setActiveTab("validate");
    else if (activeTab === "validate") setActiveTab("migrate");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return {
    // State
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
    dataTypes: initialDataTypes,
    
    // Computed state
    isConnectStepComplete,
    isSelectStepComplete,
    isMappingStepComplete,
    isValidationStepComplete,
    
    // Actions
    setActiveTab,
    setSearchTerm,
    handleSelectSourceCrm,
    handleSelectTargetCrm,
    handleToggleDataType,
    handleStartFieldMapping,
    handleRunValidation,
    handleStartMigration,
    canProceedToNextStep,
    handleProceedToNextStep,
    formatTime
  };
};
