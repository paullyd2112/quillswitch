
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ExternalLink, Info, KeyRound } from "lucide-react";
import { useConnection } from "@/contexts/ConnectionContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ConnectionStatusCardProps {
  handleNeedConnection: () => void;
}

// CRM base URLs for external links
const crmBaseUrls: Record<string, string> = {
  salesforce: "https://login.salesforce.com/",
  hubspot: "https://app.hubspot.com/login",
  dynamics: "https://dynamics.microsoft.com/",
  zoho: "https://accounts.zoho.com/signin",
  pipedrive: "https://app.pipedrive.com/auth/login",
  monday: "https://auth.monday.com/",
  freshsales: "https://www.freshworks.com/freshsales-crm/login/",
  activecampaign: "https://www.activecampaign.com/login/",
  netsuite: "https://system.netsuite.com/pages/customerlogin.jsp",
  copper: "https://app.copper.com/users/sign_in",
  keap: "https://accounts.keap.com/",
  "zendesk-sell": "https://www.zendesk.com/sell/",
  sugarcrm: "https://www.sugarcrm.com/login/",
  creatio: "https://login.creatio.com/",
  "less-annoying": "https://www.lessannoyingcrm.com/login/",
  capsule: "https://capsulecrm.com/login",
  nutshell: "https://app.nutshell.com/login",
  bitrix24: "https://www.bitrix24.com/auth/",
  engagebay: "https://app.engagebay.com/login",
  clickup: "https://app.clickup.com/login",
  odoo: "https://www.odoo.com/web/login",
  salesflare: "https://app.salesflare.com/login",
  apptivo: "https://www.apptivo.com/app/login.jsp",
  agilecrm: "https://www.agilecrm.com/login",
  planfix: "https://accounts.planfix.com/login"
};

// Default CRM options
const defaultCrmOptions = [
  { id: "salesforce", name: "Salesforce" },
  { id: "hubspot", name: "HubSpot" },
  { id: "dynamics", name: "Microsoft Dynamics 365" },
  { id: "zoho", name: "Zoho CRM" },
  { id: "pipedrive", name: "Pipedrive" }
];

const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({ handleNeedConnection }) => {
  const { connectedSystems, connectSystem, validateConnection } = useConnection();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [connectionType, setConnectionType] = useState<"source" | "destination" | "related">("source");
  const [selectedCrm, setSelectedCrm] = useState(defaultCrmOptions[0]);
  const [apiKey, setApiKey] = useState("");
  const [validationError, setValidationError] = useState("");

  // Check for connected source and destination CRMs
  const sourceCrms = connectedSystems.filter(system => system.type === "source");
  const destinationCrms = connectedSystems.filter(system => system.type === "destination");
  
  const hasSourceCrm = sourceCrms.length > 0;
  const hasDestinationCrm = destinationCrms.length > 0;

  const getCrmUrl = (crmId: string) => {
    return crmBaseUrls[crmId.toLowerCase()] || `https://${crmId}.com`;
  };

  const handleOpenConnectionDialog = (type: "source" | "destination" | "related") => {
    setConnectionType(type);
    setConnectionDialogOpen(true);
    setApiKey("");
    setValidationError("");
  };

  const handleCrmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const crmId = e.target.value;
    const crmName = defaultCrmOptions.find(crm => crm.id === crmId)?.name || crmId;
    setSelectedCrm({ id: crmId, name: crmName });
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setValidationError("");
  };

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      setValidationError("API key is required");
      return;
    }

    setIsConnecting(true);
    try {
      // Validate API key
      const validationResult = await validateConnection(selectedCrm.id, apiKey);
      
      if (validationResult.valid) {
        // Connect with the validated API key
        await connectSystem(selectedCrm.id, connectionType, apiKey);
        setConnectionDialogOpen(false);
        toast.success(`Successfully connected to ${selectedCrm.name}`);
      } else {
        setValidationError(validationResult.message || "Invalid API key");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setValidationError("Connection failed. Please try again.");
      toast.error("Connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <Card className="border-slate-700 dark:border-slate-700 bg-slate-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-3xl font-semibold text-white">Connection Status</CardTitle>
          <CardDescription className="text-slate-400 text-lg">
            Check the status of your CRM connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Source CRM */}
          <div className="flex items-center justify-between p-4 rounded-md bg-slate-800 border border-slate-700">
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-semibold ${
                hasSourceCrm 
                  ? "bg-green-600/20 text-green-400" 
                  : "bg-amber-700/30 text-amber-400"
              }`}>
                {hasSourceCrm ? <Check className="h-6 w-6" /> : "1"}
              </div>
              <div>
                <h3 className="text-3xl font-normal text-white">Source CRM</h3>
                <p className="text-slate-400">Your original CRM system</p>
              </div>
            </div>
            
            <div>
              {hasSourceCrm ? (
                <a 
                  href={getCrmUrl(sourceCrms[0]?.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 font-medium hover:underline inline-flex items-center"
                >
                  Connected: {sourceCrms[0]?.name}
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              ) : (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => handleOpenConnectionDialog("source")}
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Connect Source
                </Button>
              )}
            </div>
          </div>
          
          {/* Destination CRM */}
          <div className="flex items-center justify-between p-4 rounded-md bg-slate-800 border border-slate-700">
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-semibold ${
                hasDestinationCrm 
                  ? "bg-green-600/20 text-green-400" 
                  : "bg-amber-700/30 text-amber-400"
              }`}>
                {hasDestinationCrm ? <Check className="h-6 w-6" /> : "2"}
              </div>
              <div>
                <h3 className="text-3xl font-normal text-white">Destination CRM</h3>
                <p className="text-slate-400">Your target CRM system</p>
              </div>
            </div>
            
            <div>
              {hasDestinationCrm ? (
                <a 
                  href={getCrmUrl(destinationCrms[0]?.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 font-medium hover:underline inline-flex items-center"
                >
                  Connected: {destinationCrms[0]?.name}
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              ) : (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => handleOpenConnectionDialog("destination")}
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Connect Destination
                </Button>
              )}
            </div>
          </div>
          
          {/* Related Tools */}
          <div className="flex items-center justify-between p-4 rounded-md bg-slate-800 border border-slate-700">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-900/30 text-blue-400">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-3xl font-normal text-white">Related Tools</h3>
                <p className="text-slate-400">Other tools and applications</p>
              </div>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleNeedConnection}
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                Manage Tools
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Dialog */}
      <Dialog open={connectionDialogOpen} onOpenChange={setConnectionDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Connect {connectionType === "source" ? "Source" : "Destination"} CRM</DialogTitle>
            <DialogDescription className="text-slate-400">
              Select your CRM and enter your API key to connect
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="crm-select">Select CRM</Label>
              <select
                id="crm-select"
                className="w-full p-2 border rounded-md dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                onChange={handleCrmChange}
                value={selectedCrm.id}
              >
                {defaultCrmOptions.map(crm => (
                  <option key={crm.id} value={crm.id}>{crm.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="text"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={handleApiKeyChange}
              />
              {validationError && (
                <p className="text-sm text-red-500">{validationError}</p>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md text-xs text-muted-foreground">
              <p className="font-medium mb-1">Where to find your API key:</p>
              <p>
                {selectedCrm.id === "salesforce" && "You can find your Salesforce API key in Setup > Apps > App Manager > Your Connected App > Manage > View Client Secrets."}
                {selectedCrm.id === "hubspot" && "You can find your HubSpot API key in Settings > Integrations > API Keys."}
                {selectedCrm.id === "dynamics" && "You can find your Dynamics 365 API key in Settings > Customizations > Developer Resources."}
                {selectedCrm.id === "zoho" && "You can find your Zoho API key in Setup > Developer Space > API > Generate New Token."}
                {selectedCrm.id === "pipedrive" && "You can find your Pipedrive API key in Settings > Personal Preferences > API."}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectionStatusCard;
