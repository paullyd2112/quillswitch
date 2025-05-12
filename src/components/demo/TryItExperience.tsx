import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Database, ArrowRight, ChevronDown, ChevronUp, Search, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CrmSystem {
  id: string;
  name: string;
  logo: string;
  isConnected: boolean;
}

const crmSystems: CrmSystem[] = [
  { id: "salesforce", name: "Salesforce", logo: "sf-logo", isConnected: false },
  { id: "hubspot", name: "HubSpot", logo: "hs-logo", isConnected: false },
  { id: "zoho", name: "Zoho CRM", logo: "zoho-logo", isConnected: false },
  { id: "pipedrive", name: "Pipedrive", logo: "pd-logo", isConnected: false },
  { id: "dynamicscrm", name: "Dynamics 365", logo: "ms-logo", isConnected: false },
  { id: "sugarcrm", name: "SugarCRM", logo: "sugar-logo", isConnected: false }
];

const dataTypes = [
  { id: "contacts", name: "Contacts", count: 250, selected: true },
  { id: "companies", name: "Companies", count: 125, selected: true },
  { id: "deals", name: "Deals/Opportunities", count: 75, selected: true },
  { id: "activities", name: "Activities & Tasks", count: 320, selected: false },
  { id: "custom", name: "Custom Objects", count: 40, selected: false }
];

const TryItExperience: React.FC = () => {
  const [activeTab, setActiveTab] = useState("connect");
  const [sourceCrm, setSourceCrm] = useState<CrmSystem | null>(null);
  const [targetCrm, setTargetCrm] = useState<CrmSystem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDataTypes, setSelectedDataTypes] = useState(dataTypes.filter(dt => dt.selected).map(dt => dt.id));
  const [mappingProgress, setMappingProgress] = useState(0);
  const [isFieldMappingComplete, setIsFieldMappingComplete] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [isValidationComplete, setIsValidationComplete] = useState(false);
  const [isMigrating, setIsMigrating] = useState(isValidationComplete);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [isMigrationComplete, setIsMigrationComplete] = useState(false);
  const [migrationStats, setMigrationStats] = useState({
    recordsMigrated: 0,
    recordsPerSecond: 0,
    timeElapsed: 0,
    errors: 0,
    warnings: 2
  });

  const filteredCrmSystems = crmSystems.filter(crm => 
    crm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSourceCrm = (crm: CrmSystem) => {
    setSourceCrm({...crm, isConnected: true});
    
    // If they selected the same CRM for both source and target, reset target
    if (targetCrm && targetCrm.id === crm.id) {
      setTargetCrm(null);
    }
  };

  const handleSelectTargetCrm = (crm: CrmSystem) => {
    setTargetCrm({...crm, isConnected: true});
    
    // If they selected the same CRM for both source and target, reset source
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
    
    return () => clearInterval(interval);
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
    
    return () => clearInterval(interval);
  };

  const handleStartMigration = () => {
    setIsMigrating(true);
    setMigrationProgress(0);
    setIsMigrationComplete(false);
    
    const totalRecords = dataTypes
      .filter(dt => selectedDataTypes.includes(dt.id))
      .reduce((acc, dt) => acc + dt.count, 0);
    
    let recordsMigrated = 0;
    let timeCounter = 0;
    
    const interval = setInterval(() => {
      timeCounter += 0.3; // 0.3 seconds per interval
      
      // Calculate records to migrate in this interval (vary it to simulate real-world conditions)
      const recordsThisInterval = Math.floor(Math.random() * 20) + 10;
      recordsMigrated = Math.min(totalRecords, recordsMigrated + recordsThisInterval);
      
      // Update progress
      const progress = (recordsMigrated / totalRecords) * 100;
      setMigrationProgress(progress);
      
      // Update stats
      setMigrationStats({
        recordsMigrated,
        recordsPerSecond: Math.floor(recordsMigrated / timeCounter),
        timeElapsed: Math.floor(timeCounter),
        errors: progress > 70 ? 3 : 0, // Simulate some errors appearing after 70%
        warnings: 2
      });
      
      // Check if migration is complete
      if (recordsMigrated >= totalRecords) {
        clearInterval(interval);
        setIsMigrating(false);
        setIsMigrationComplete(true);
      }
    }, 300);
    
    return () => clearInterval(interval);
  };

  // Check if ready to proceed to next steps
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          
          {/* Connect CRMs Tab */}
          <TabsContent value="connect">
            <div className="space-y-6">
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Connect Your CRMs</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Source CRM Selection */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Select Source CRM</h4>
                    
                    <Input
                      type="search"
                      placeholder="Search CRM..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCrmSystems.length > 0 ? (
                        filteredCrmSystems.map(crm => (
                          <div
                            key={crm.id}
                            className={`p-3 rounded-md cursor-pointer transition-colors ${
                              sourceCrm?.id === crm.id
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                            onClick={() => handleSelectSourceCrm(crm)}
                          >
                            {crm.name}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No CRM systems match your search.
                        </div>
                      )}
                    </div>
                    
                    {sourceCrm && (
                      <div className="flex items-center gap-2 mt-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{sourceCrm.name} connected</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Target CRM Selection */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Select Target CRM</h4>
                    
                    <Input
                      type="search"
                      placeholder="Search CRM..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCrmSystems.length > 0 ? (
                        filteredCrmSystems.map(crm => (
                          <div
                            key={crm.id}
                            className={`p-3 rounded-md cursor-pointer transition-colors ${
                              targetCrm?.id === crm.id
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                            onClick={() => handleSelectTargetCrm(crm)}
                          >
                            {crm.name}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No CRM systems match your search.
                        </div>
                      )}
                    </div>
                    
                    {targetCrm && (
                      <div className="flex items-center gap-2 mt-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{targetCrm.name} connected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleProceedToNextStep}
                  disabled={!isConnectStepComplete}
                >
                  Next: Select Data <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Select Data Tab */}
          <TabsContent value="select">
            <div className="space-y-6">
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Select Data Types to Migrate</h3>
                
                <p className="text-muted-foreground mb-4">
                  Choose the types of data you want to migrate from {sourceCrm?.name} to {targetCrm?.name}.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataTypes.map(dataType => (
                    <div
                      key={dataType.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedDataTypes.includes(dataType.id)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                      onClick={() => handleToggleDataType(dataType.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{dataType.name}</div>
                        <div className="text-sm text-muted-foreground">{dataType.count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("connect")}
                >
                  Back: Connect CRMs
                </Button>
                <Button 
                  onClick={handleProceedToNextStep}
                  disabled={!isSelectStepComplete}
                >
                  Next: Map Fields <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Map Fields Tab */}
          <TabsContent value="map">
            <div className="space-y-6">
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Map Fields</h3>
                
                <p className="text-muted-foreground mb-4">
                  Simulate field mapping between {sourceCrm?.name} and {targetCrm?.name}.
                </p>
                
                {!isFieldMappingComplete ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Mapping progress</span>
                        <span className="font-medium">{Math.round(mappingProgress)}%</span>
                      </div>
                      <Progress value={mappingProgress} className="h-2" />
                    </div>
                    
                    <Button onClick={handleStartFieldMapping} className="w-full">
                      Start Automatic Field Mapping
                    </Button>
                  </div>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                    <div className="flex items-center text-green-700 dark:text-green-400">
                      <Check className="h-5 w-5 mr-2" />
                      <div className="font-medium">Field Mapping Completed</div>
                    </div>
                    <div className="mt-2 text-green-600 dark:text-green-500 text-sm">
                      All fields have been automatically mapped between {sourceCrm?.name} and {targetCrm?.name}.
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("select")}
                >
                  Back: Select Data
                </Button>
                <Button 
                  onClick={handleProceedToNextStep}
                  disabled={!isMappingStepComplete}
                >
                  Next: Validate <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Validate Tab */}
          <TabsContent value="validate">
            <div className="space-y-6">
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Validate Your Data</h3>
                
                <p className="text-muted-foreground mb-4">
                  Run a validation check to ensure data integrity before migration.
                </p>
                
                {!isValidating && !isValidationComplete ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Validation progress</span>
                        <span className="font-medium">{Math.round(validationProgress)}%</span>
                      </div>
                      <Progress value={validationProgress} className="h-2" />
                    </div>
                    
                    <Button onClick={handleRunValidation} className="w-full">
                      Run Data Validation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {isValidationComplete ? (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                        <div className="flex items-center text-green-700 dark:text-green-400">
                          <Check className="h-5 w-5 mr-2" />
                          <div className="font-medium">Validation Completed</div>
                        </div>
                        <div className="mt-2 text-green-600 dark:text-green-500 text-sm">
                          All data has been successfully validated between {sourceCrm?.name} and {targetCrm?.name}.
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mr-3"></div>
                          <div className="text-blue-600 dark:text-blue-400">
                            Validating data... {Math.round(validationProgress)}% complete
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("map")}
                >
                  Back: Map Fields
                </Button>
                <Button 
                  onClick={handleProceedToNextStep}
                  disabled={!isValidationStepComplete}
                >
                  Next: Migrate <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Migrate Tab */}
          <TabsContent value="migrate">
            <div className="space-y-8">
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Start Your Migration</h3>
                
                <div className="space-y-6">
                  <p className="text-muted-foreground mb-4">
                    You're ready to migrate your data from {sourceCrm?.name} to {targetCrm?.name}.
                    Click the button below to start the full migration process.
                  </p>
                  
                  {!isMigrating && migrationProgress === 0 && !isMigrationComplete ? (
                    <Button onClick={handleStartMigration} className="w-full">
                      Start Full Migration
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Migration progress</span>
                          <span className="font-medium">{Math.round(migrationProgress)}%</span>
                        </div>
                        <Progress value={migrationProgress} className="h-2" />
                      </div>
                      
                      {isMigrating && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mr-3"></div>
                            <div className="text-blue-600 dark:text-blue-400">
                              Migration in progress... {Math.round(migrationProgress)}% complete
                            </div>
                          </div>
                          <div className="text-sm text-blue-500 dark:text-blue-400 mt-2">
                            {migrationStats.recordsMigrated} of {dataTypes
                              .filter(dt => selectedDataTypes.includes(dt.id))
                              .reduce((acc, dt) => acc + dt.count, 0)} records migrated
                          </div>
                        </div>
                      )}
                      
                      {isMigrationComplete && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                          <div className="flex items-center text-green-700 dark:text-green-400">
                            <Check className="h-5 w-5 mr-2" />
                            <div className="font-medium">Migration Completed Successfully</div>
                          </div>
                          <div className="mt-2 text-green-600 dark:text-green-500 text-sm">
                            Your data migration from {sourceCrm?.name} to {targetCrm?.name} has been completed. 
                            {migrationStats.recordsMigrated} records were successfully migrated.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {(isMigrating || isMigrationComplete) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
                    <h4 className="font-medium mb-4">Migration Statistics</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-muted-foreground mb-1">
                          Records Migrated
                        </div>
                        <div className="font-bold">
                          {migrationStats.recordsMigrated.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-muted-foreground mb-1">
                          Migration Speed
                        </div>
                        <div className="font-bold">
                          {migrationStats.recordsPerSecond} records/sec
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-muted-foreground mb-1">
                          Time Elapsed
                        </div>
                        <div className="font-bold">
                          {formatTime(migrationStats.timeElapsed)}
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-muted-foreground mb-1">
                          Status
                        </div>
                        <div className="font-bold text-blue-600 dark:text-blue-400">
                          {isMigrationComplete ? "Completed" : "In Progress"}
                        </div>
                      </div>
                    </div>
                    
                    {migrationProgress > 70 && (
                      <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5" />
                          <div>
                            <div className="font-medium text-amber-700 dark:text-amber-400">
                              Migration Issues
                            </div>
                            <div className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                              <div className="flex justify-between">
                                <span>Errors:</span>
                                <span className="font-medium">{migrationStats.errors}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Warnings:</span>
                                <span className="font-medium">{migrationStats.warnings}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
                    <h4 className="font-medium mb-4">Migration Details</h4>
                    
                    <div className="space-y-4">
                      {selectedDataTypes.map(typeId => {
                        const dataType = dataTypes.find(dt => dt.id === typeId);
                        if (!dataType) return null;
                        
                        const typeMigrationProgress = isMigrationComplete ? 100 : 
                          typeId === "contacts" ? Math.min(100, migrationProgress * 1.2) :
                          typeId === "companies" ? Math.min(100, migrationProgress * 0.9) :
                          Math.min(100, migrationProgress * 0.8);
                          
                        return (
                          <div key={typeId} className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{dataType.name}</div>
                              <div className="text-xs">
                                {Math.round((typeMigrationProgress / 100) * dataType.count)} / {dataType.count}
                              </div>
                            </div>
                            
                            <Progress value={typeMigrationProgress} className="h-1.5 mb-2" />
                            
                            <div className="text-xs text-right text-muted-foreground">
                              {Math.round(typeMigrationProgress)}%
                            </div>
                          </div>
                        );
                      })}
                      
                      {isMigrationComplete && (
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <h5 className="font-medium mb-3">Next Steps</h5>
                          
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <div className="rounded-full w-5 h-5 bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-2 mt-0.5">
                                <Check className="h-3 w-3" />
                              </div>
                              <span className="text-sm">Migration completed successfully</span>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="rounded-full w-5 h-5 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 mr-2 mt-0.5">
                                2
                              </div>
                              <span className="text-sm">View detailed migration report</span>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="rounded-full w-5 h-5 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 mr-2 mt-0.5">
                                3
                              </div>
                              <span className="text-sm">Verify data in target CRM</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("validate")}
                  disabled={isMigrating}
                >
                  Back: Validation
                </Button>
                {isMigrationComplete && (
                  <Button>
                    View Migration Report
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TryItExperience;
