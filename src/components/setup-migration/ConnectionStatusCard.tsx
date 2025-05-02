
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ExternalLink, Info } from "lucide-react";
import { useConnection } from "@/contexts/ConnectionContext";

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

const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({ handleNeedConnection }) => {
  const { connectedSystems } = useConnection();

  // Check for connected source and destination CRMs
  const sourceCrms = connectedSystems.filter(system => system.type === "source");
  const destinationCrms = connectedSystems.filter(system => system.type === "destination");
  
  const hasSourceCrm = sourceCrms.length > 0;
  const hasDestinationCrm = destinationCrms.length > 0;

  const getCrmUrl = (crmId: string) => {
    return crmBaseUrls[crmId.toLowerCase()] || `https://${crmId}.com`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Status</CardTitle>
        <CardDescription>
          Check the status of your CRM connections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              hasSourceCrm 
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            }`}>
              {hasSourceCrm ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <div>
              <h3 className="font-medium">Source CRM</h3>
              <p className="text-xs text-muted-foreground">Your original CRM system</p>
            </div>
          </div>
          
          <div>
            {hasSourceCrm ? (
              <a 
                href={getCrmUrl(sourceCrms[0]?.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 dark:text-green-400 font-medium hover:underline inline-flex items-center gap-1"
              >
                Connected: {sourceCrms[0]?.name}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNeedConnection}
              >
                Connect Source
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              hasDestinationCrm 
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            }`}>
              {hasDestinationCrm ? <Check className="h-4 w-4" /> : "2"}
            </div>
            <div>
              <h3 className="font-medium">Destination CRM</h3>
              <p className="text-xs text-muted-foreground">Your target CRM system</p>
            </div>
          </div>
          
          <div>
            {hasDestinationCrm ? (
              <a 
                href={getCrmUrl(destinationCrms[0]?.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 dark:text-green-400 font-medium hover:underline inline-flex items-center gap-1"
              >
                Connected: {destinationCrms[0]?.name}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNeedConnection}
              >
                Connect Destination
              </Button>
            )}
          </div>
        </div>
        
        {/* Related Tools Status */}
        <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium">Related Tools</h3>
              <p className="text-xs text-muted-foreground">Other tools and applications</p>
            </div>
          </div>
          
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNeedConnection}
            >
              Manage Tools
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionStatusCard;
