
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Globe,
  ArrowRight,
  Clock,
  Users,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

interface ConnectedTool {
  id: string;
  name: string;
  status: "connected" | "pending" | "disconnected";
  reconnectionStatus: "full" | "partial";
  category: string;
  icon: React.ReactNode;
}

interface EcosystemAutoConnectorProps {
  projectId?: string;
  onToolsConnected?: (tools: ConnectedTool[]) => void;
}

const EcosystemAutoConnector: React.FC<EcosystemAutoConnectorProps> = ({
  projectId,
  onToolsConnected
}) => {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [discoveredTools, setDiscoveredTools] = useState<ConnectedTool[]>([]);

  const mockTools: ConnectedTool[] = [
    {
      id: "salesforce",
      name: "Salesforce",
      status: "connected",
      reconnectionStatus: "full",
      category: "CRM",
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: "marketo",
      name: "Marketo",
      status: "connected",
      reconnectionStatus: "partial",
      category: "Marketing",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      id: "salesloft",
      name: "SalesLoft",
      status: "pending",
      reconnectionStatus: "partial",
      category: "Sales Engagement",
      icon: <Users className="h-4 w-4" />
    },
    {
      id: "zapier",
      name: "Zapier",
      status: "connected",
      reconnectionStatus: "full",
      category: "Automation",
      icon: <Zap className="h-4 w-4" />
    }
  ];

  const handleScanEcosystem = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setDiscoveredTools(mockTools);
          toast.success("Ecosystem scan completed! Found 4 connected tools.");
          return 100;
        }
        return prev + 20;
      });
    }, 800);
  };

  const handleToolSelection = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleAutoConnectSelected = () => {
    if (selectedTools.length === 0) {
      toast.error("Please select at least one tool to connect.");
      return;
    }
    
    toast.success(`Initiated auto-reconnection for ${selectedTools.length} tool(s).`);
    if (onToolsConnected) {
      const connectedTools = discoveredTools.filter(tool => selectedTools.includes(tool.id));
      onToolsConnected(connectedTools);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "disconnected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getReconnectionColor = (type: string) => {
    switch (type) {
      case "full": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "partial": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
              <Globe className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <CardTitle className="text-xl">Ecosystem Auto-Connector</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Automatically reconnect your integrated tools after migration
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Zap className="h-3 w-3" />
            Smart Reconnection
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan">Scan & Discover</TabsTrigger>
            <TabsTrigger value="manage">Manage Tools</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Ecosystem Discovery
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                Scan your current CRM ecosystem to discover all connected tools and assess their reconnection compatibility.
              </p>
              
              {!isScanning && discoveredTools.length === 0 && (
                <Button onClick={handleScanEcosystem} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Start Ecosystem Scan
                </Button>
              )}
              
              {isScanning && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Scanning ecosystem...</span>
                  </div>
                  <Progress value={scanProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    Discovering connected tools and analyzing reconnection capabilities
                  </p>
                </div>
              )}
            </div>
            
            {discoveredTools.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Discovered Tools ({discoveredTools.length})</h3>
                  <Button 
                    onClick={handleAutoConnectSelected}
                    disabled={selectedTools.length === 0}
                    size="sm"
                    className="gap-2"
                  >
                    Auto-Connect Selected ({selectedTools.length})
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid gap-3">
                  {discoveredTools.map((tool) => (
                    <div 
                      key={tool.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTools.includes(tool.id) 
                          ? "border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/30" 
                          : "border-border hover:bg-accent/50"
                      }`}
                      onClick={() => handleToolSelection(tool.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-md">
                            {tool.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{tool.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {tool.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`text-xs ${getStatusColor(tool.status)}`}>
                                {tool.status}
                              </Badge>
                              <Badge className={`text-xs ${getReconnectionColor(tool.reconnectionStatus)}`}>
                                {tool.reconnectionStatus === "full" ? "Full Auto-Reconnect" : "Assisted Reconnect"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {tool.reconnectionStatus === "full" && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {tool.reconnectionStatus === "partial" && (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-4">
            <div className="text-center py-8">
              <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Tool Management</h3>
              <p className="text-muted-foreground mb-4">
                Advanced tool management and reconnection settings will be available here.
              </p>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="text-center py-8">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Auto-Connector Settings</h3>
              <p className="text-muted-foreground mb-4">
                Configure auto-reconnection preferences and security settings.
              </p>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EcosystemAutoConnector;
