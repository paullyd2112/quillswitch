import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Target, TrendingUp } from "lucide-react";
import { useDemoAccess } from "@/hooks/useDemoAccess";
import { useRealDataDemo } from "@/hooks/useRealDataDemo";

import { useToast } from "@/hooks/use-toast";
import AccessStep from "./real-data-demo/steps/AccessStep";
import ConnectStep from "./real-data-demo/steps/ConnectStep";
import ConfigureStep from "./real-data-demo/steps/ConfigureStep";
import ExtractionStep from "./real-data-demo/steps/ExtractionStep";
import ResultsStep from "./real-data-demo/steps/ResultsStep";
import { 
  RealDataDemoProps, 
  Connection, 
  DataTypeOption, 
  DemoStep 
} from "./real-data-demo/types";

const RealDataDemo: React.FC<RealDataDemoProps> = ({ userEmail }) => {
  const { toast } = useToast();
  const { 
    accessInfo, 
    currentSession, 
    isLoading: accessLoading, 
    checkDemoAccess, 
    getCurrentUserEmail 
  } = useDemoAccess();
  
  const {
    isExtracting,
    extractionProgress,
    extractedData,
    extractRealData,
    validateConnections
  } = useRealDataDemo();

  const [email, setEmail] = useState(userEmail || "");
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(["contacts", "accounts"]);
  const [step, setStep] = useState<DemoStep>("access");

  const dataTypeOptions: DataTypeOption[] = [
    { id: "contacts", name: "Contacts", icon: Users, description: "People in your CRM" },
    { id: "accounts", name: "Accounts", icon: Building2, description: "Companies and organizations" },
    { id: "opportunities", name: "Opportunities", icon: Target, description: "Sales opportunities and deals" },
    { id: "leads", name: "Leads", icon: TrendingUp, description: "Potential customers" }
  ];

  useEffect(() => {
    const initializeDemo = async () => {
      try {
        const currentEmail = userEmail || await getCurrentUserEmail();
        if (currentEmail) {
          setEmail(currentEmail);
          await handleAccessCheck(currentEmail);
        }
        
        // Load available connections (placeholder for native CRM connections)
        const userConnections: Connection[] = [];
        setConnections(userConnections);
      } catch (error) {
        console.error('Demo initialization error:', error);
      }
    };

    initializeDemo();
  }, [userEmail]);

  const handleAccessCheck = async (emailToCheck: string) => {
    if (!emailToCheck) return;
    
    const access = await checkDemoAccess(emailToCheck);
    if (access?.canAccess) {
      setStep("connect");
    }
  };

  const handleStartDemo = async () => {
    if (!selectedSource || !selectedDestination) {
      toast({
        title: "Missing Connections",
        description: "Please select both source and destination CRM connections.",
        variant: "destructive"
      });
      return;
    }

    if (selectedDataTypes.length === 0) {
      toast({
        title: "No Data Selected",
        description: "Please select at least one data type to extract.",
        variant: "destructive"
      });
      return;
    }

    // Validate connections first
    const connectionsValid = await validateConnections(selectedSource, selectedDestination);
    if (!connectionsValid) return;

    setStep("extract");

    // Start real data extraction
    const session = await extractRealData({
      sourceConnectionId: selectedSource,
      destinationConnectionId: selectedDestination,
      dataTypes: selectedDataTypes,
      recordLimit: accessInfo?.recordLimit || 100
    });

    if (session) {
      setStep("results");
    }
  };

  const handleConnectCrm = () => {
    window.open('/app/connections', '_blank');
  };

  const handleToggleDataType = (dataTypeId: string) => {
    if (selectedDataTypes.includes(dataTypeId)) {
      setSelectedDataTypes(prev => prev.filter(id => id !== dataTypeId));
    } else {
      setSelectedDataTypes(prev => [...prev, dataTypeId]);
    }
  };

  const handleContinueWithDemo = () => {
    window.location.href = '/app/try-it';
  };

  if (accessLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Checking demo access...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto glass-panel border-primary/20 shadow-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-3xl">
          <div className="relative">
            <div className="h-8 w-2 bg-gradient-to-b from-primary via-primary/80 to-accent rounded-full"></div>
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/40 to-accent/40 rounded-full blur-sm -z-10"></div>
          </div>
          <span className="bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">
            Real Data Migration Demo
          </span>
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Experience QuillSwitch with your actual CRM data - secure, limited, and automatically cleaned up
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {step === "access" && (
          <AccessStep
            email={email}
            accessInfo={accessInfo}
            onNext={() => setStep("connect")}
          />
        )}
        
        {step === "connect" && (
          <ConnectStep
            connections={connections}
            selectedSource={selectedSource}
            selectedDestination={selectedDestination}
            onSelectSource={setSelectedSource}
            onSelectDestination={setSelectedDestination}
            onConnectCrm={handleConnectCrm}
            onBack={() => setStep("access")}
            onNext={() => setStep("configure")}
          />
        )}
        
        {step === "configure" && (
          <ConfigureStep
            dataTypeOptions={dataTypeOptions}
            selectedDataTypes={selectedDataTypes}
            accessInfo={accessInfo}
            onToggleDataType={handleToggleDataType}
            onBack={() => setStep("connect")}
            onStartDemo={handleStartDemo}
          />
        )}
        
        {step === "extract" && (
          <ExtractionStep
            extractionProgress={extractionProgress}
            selectedDataTypes={selectedDataTypes}
            accessInfo={accessInfo}
          />
        )}
        
        {step === "results" && (
          <ResultsStep
            extractedData={extractedData}
            onContinue={handleContinueWithDemo}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RealDataDemo;