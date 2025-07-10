import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Users,
  Building2,
  Target,
  TrendingUp
} from "lucide-react";
import { useDemoAccess } from "@/hooks/useDemoAccess";
import { useRealDataDemo } from "@/hooks/useRealDataDemo";
import { unifiedApiService } from "@/services/unified/UnifiedApiService";
import { useToast } from "@/hooks/use-toast";

interface RealDataDemoProps {
  userEmail?: string;
}

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
  const [connections, setConnections] = useState<any[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(["contacts", "accounts"]);
  const [step, setStep] = useState<"access" | "connect" | "configure" | "extract" | "results">("access");

  const dataTypeOptions = [
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
        
        // Load available connections
        const userConnections = await unifiedApiService.getUserConnections();
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

  const renderAccessStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Real Data Migration Demo</h2>
        <p className="text-muted-foreground mb-6">
          Experience QuillSwitch with your actual CRM data. We'll extract up to 100 records 
          for a complete migration simulation.
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security First:</strong> Your data is encrypted, never stored permanently, 
          and automatically deleted after 24 hours. We only extract a small sample for the demo.
        </AlertDescription>
      </Alert>

      {accessInfo && (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Demo Access Status</h3>
                <p className="text-sm text-muted-foreground">
                  Domain: {email.split('@')[1]}
                </p>
                <p className="text-sm text-muted-foreground">
                  Record Limit: {accessInfo.recordLimit} records
                </p>
                {accessInfo.remainingDemos !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    Remaining Demos: {accessInfo.remainingDemos}
                  </p>
                )}
              </div>
              <Badge variant={accessInfo.canAccess ? "default" : "destructive"}>
                {accessInfo.canAccess ? "Approved" : "Blocked"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {accessInfo?.canAccess && (
        <div className="flex justify-center">
          <Button onClick={() => setStep("connect")} size="lg">
            Start Real Data Demo
          </Button>
        </div>
      )}

      {!accessInfo?.canAccess && accessInfo?.reason && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {accessInfo.reason}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderConnectStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Connect Your CRMs</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select your source and destination CRM systems. If you haven't connected your CRMs yet, 
          you can do so in a new tab.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="h-full">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Database className="h-5 w-5" />
              Source CRM
            </CardTitle>
            <CardDescription>Where your data currently lives</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {connections.length > 0 ? (
              <div className="space-y-3 flex-1">
                {connections.map((conn) => (
                  <Button
                    key={conn.id}
                    variant={selectedSource === conn.id ? "default" : "outline"}
                    className="w-full justify-start h-auto p-4 relative z-10"
                    onClick={() => setSelectedSource(conn.id)}
                  >
                    <Database className="mr-3 h-4 w-4 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{conn.name}</div>
                      <div className="text-xs opacity-70">({conn.type})</div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 flex-1 flex flex-col justify-center">
                <Database className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                <p className="text-sm text-muted-foreground mb-6">
                  No CRM connections found
                </p>
                <Button 
                  onClick={handleConnectCrm} 
                  variant="outline" 
                  className="mx-auto relative z-10 pointer-events-auto"
                  style={{ pointerEvents: 'auto' }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect Your CRMs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Database className="h-5 w-5" />
              Destination CRM
            </CardTitle>
            <CardDescription>Where you want to migrate your data</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {connections.length > 0 ? (
              <div className="space-y-3 flex-1">
                {connections
                  .filter(conn => conn.id !== selectedSource)
                  .map((conn) => (
                    <Button
                      key={conn.id}
                      variant={selectedDestination === conn.id ? "default" : "outline"}
                      className="w-full justify-start h-auto p-4 relative z-10"
                      onClick={() => setSelectedDestination(conn.id)}
                    >
                      <Database className="mr-3 h-4 w-4 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">{conn.name}</div>
                        <div className="text-xs opacity-70">({conn.type})</div>
                      </div>
                    </Button>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 flex-1 flex flex-col justify-center">
                <Database className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                <p className="text-sm text-muted-foreground mb-6">
                  No CRM connections found
                </p>
                <Button 
                  onClick={handleConnectCrm} 
                  variant="outline" 
                  className="mx-auto relative z-10 pointer-events-auto"
                  style={{ pointerEvents: 'auto' }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect Your CRMs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between max-w-5xl mx-auto">
        <Button variant="outline" onClick={() => setStep("access")}>
          Back
        </Button>
        <Button 
          onClick={() => setStep("configure")}
          disabled={!selectedSource || !selectedDestination}
        >
          Next: Configure Demo
        </Button>
      </div>
    </div>
  );

  const renderConfigureStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Configure Your Demo</h2>
        <p className="text-muted-foreground">
          Select the types of data you want to extract for the migration demo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Types to Extract</CardTitle>
          <CardDescription>
            We'll extract up to {accessInfo?.recordLimit || 100} total records across all selected types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataTypeOptions.map((dataType) => {
              const Icon = dataType.icon;
              const isSelected = selectedDataTypes.includes(dataType.id);
              
              return (
                <Button
                  key={dataType.id}
                  variant={isSelected ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => {
                    if (isSelected) {
                      setSelectedDataTypes(prev => prev.filter(id => id !== dataType.id));
                    } else {
                      setSelectedDataTypes(prev => [...prev, dataType.id]);
                    }
                  }}
                >
                  <div className="flex items-center w-full mb-2">
                    <Icon className="mr-2 h-5 w-5" />
                    <span className="font-medium">{dataType.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground text-left">
                    {dataType.description}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("connect")}>
          Back
        </Button>
        <Button 
          onClick={handleStartDemo}
          disabled={selectedDataTypes.length === 0}
        >
          <Zap className="mr-2 h-4 w-4" />
          Start Real Data Extraction
        </Button>
      </div>
    </div>
  );

  const renderExtractionStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Extracting Your Data</h2>
        <p className="text-muted-foreground mb-6">
          Securely extracting your real CRM data for the migration demo...
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Extraction Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(extractionProgress)}%</span>
            </div>
            <Progress value={extractionProgress} className="w-full" />
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedDataTypes.length}
                </div>
                <div className="text-sm text-muted-foreground">Data Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {accessInfo?.recordLimit || 100}
                </div>
                <div className="text-sm text-muted-foreground">Max Records</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your data is encrypted in transit and will be automatically deleted after the demo session expires.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Data Extraction Complete!</h2>
        <p className="text-muted-foreground">
          Successfully extracted {extractedData.reduce((total, data) => total + data.totalCount, 0)} records 
          from your CRM for the migration demo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {extractedData.map((data) => (
          <Card key={data.objectType}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {data.totalCount}
                </div>
                <div className="text-sm font-medium capitalize">
                  {data.objectType}
                </div>
                <div className="text-xs text-muted-foreground">
                  records extracted
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
          <CardDescription>
            Your real data is ready for the complete migration experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Data Mapping</div>
                <div className="text-sm text-muted-foreground">
                  Review and customize how your fields will be mapped between CRMs
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Validation & Preview</div>
                <div className="text-sm text-muted-foreground">
                  Validate your data and preview the migration results
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Simulation Migration</div>
                <div className="text-sm text-muted-foreground">
                  Experience the complete migration process with your real data
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg" onClick={() => window.location.href = '/app/try-it'}>
          Continue with Migration Demo
        </Button>
      </div>
    </div>
  );

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
        {step === "access" && renderAccessStep()}
        {step === "connect" && renderConnectStep()}
        {step === "configure" && renderConfigureStep()}
        {step === "extract" && renderExtractionStep()}
        {step === "results" && renderResultsStep()}
      </CardContent>
    </Card>
  );
};

export default RealDataDemo;