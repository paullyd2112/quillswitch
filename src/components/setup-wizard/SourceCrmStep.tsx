
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CrmSystem, SetupFormData } from "@/types/setupWizard";
import { useConnection } from "@/contexts/ConnectionContext";
import ConnectionModal from "@/components/connection-hub/ConnectionModal";
import { crmSystems } from "@/config/connectionSystems";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";

interface SourceCrmStepProps {
  formData: SetupFormData;
  multiCrmEnabled: boolean;
  setMultiCrmEnabled: (enabled: boolean) => void;
  selectedSourceCrms: string[];
  handleSourceCrmToggle: (crmId: string) => void;
  handleApiKeyChange: (crmId: string, value: string) => void;
  handleCustomCrmNameChange: (crmId: string, value: string) => void;
  customCrmNames: Record<string, string>;
  sourceCrmOptions: CrmSystem[];
}

const SourceCrmStep: React.FC<SourceCrmStepProps> = ({
  formData,
  multiCrmEnabled,
  setMultiCrmEnabled,
  selectedSourceCrms,
  handleSourceCrmToggle,
  handleApiKeyChange,
  handleCustomCrmNameChange,
  customCrmNames,
  sourceCrmOptions
}) => {
  const { connectedSystems, connectWithOAuth } = useConnection();
  const [selectedSystem, setSelectedSystem] = useState<any>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  // Get connected source CRMs
  const connectedSourceCrms = connectedSystems.filter(system => system.type === "source");
  
  const handleConnectCrm = (crmId: string) => {
    const systemConfig = crmSystems.find(system => 
      system.id === crmId && system.connectionType === "source"
    );
    
    if (systemConfig) {
      setSelectedSystem(systemConfig);
      setShowConnectionModal(true);
    }
  };

  const isConnected = (crmId: string) => {
    return connectedSourceCrms.some(system => system.id === crmId);
  };

  const renderConnectionStatus = (crmId: string) => {
    const connected = isConnected(crmId);
    
    if (connected) {
      return (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Connected</span>
        </div>
      );
    }
    
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleConnectCrm(crmId)}
        className="gap-2"
      >
        <Shield className="h-4 w-4" />
        Connect
      </Button>
    );
  };
  
  const renderSourceCrmOptions = () => {
    const popularOptions = sourceCrmOptions.filter(crm => crm.popular);
    const otherOptions = sourceCrmOptions.filter(crm => !crm.popular);
    
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {popularOptions.map(crm => {
            const connected = isConnected(crm.id);
            const isSelected = multiCrmEnabled 
              ? selectedSourceCrms.includes(crm.id)
              : formData.sourceCrm === crm.id;
            
            return (
              <div 
                key={crm.id}
                className={`border rounded-md p-3 transition-colors ${
                  isSelected ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
                } ${connected ? "border-green-200 dark:border-green-800" : ""}`}
              >
                <div className="flex items-start gap-2 mb-3">
                  {multiCrmEnabled ? (
                    <Checkbox 
                      checked={selectedSourceCrms.includes(crm.id)} 
                      onCheckedChange={() => handleSourceCrmToggle(crm.id)}
                      className="mt-1"
                      disabled={!connected}
                    />
                  ) : (
                    <RadioGroup value={formData.sourceCrm} onValueChange={(value) => handleSourceCrmToggle(value)}>
                      <RadioGroupItem 
                        value={crm.id} 
                        id={`source-${crm.id}`} 
                        className="mt-1"
                        disabled={!connected}
                      />
                    </RadioGroup>
                  )}
                  <div className="flex-1">
                    <Label htmlFor={`source-${crm.id}`} className="font-medium cursor-pointer">
                      {crm.name}
                    </Label>
                    {crm.description && (
                      <p className="text-xs text-muted-foreground">{crm.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  {renderConnectionStatus(crm.id)}
                  {!connected && (
                    <span className="text-xs text-muted-foreground">Connection required</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <Accordion type="single" collapsible className="mb-6">
          <AccordionItem value="more-crms">
            <AccordionTrigger className="text-sm">Show more CRM options</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                {otherOptions.map(crm => {
                  const connected = isConnected(crm.id);
                  const isSelected = multiCrmEnabled 
                    ? selectedSourceCrms.includes(crm.id)
                    : formData.sourceCrm === crm.id;
                  
                  return (
                    <div 
                      key={crm.id}
                      className={`border rounded-md p-3 transition-colors ${
                        isSelected ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
                      } ${connected ? "border-green-200 dark:border-green-800" : ""}`}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        {multiCrmEnabled ? (
                          <Checkbox 
                            checked={selectedSourceCrms.includes(crm.id)} 
                            onCheckedChange={() => handleSourceCrmToggle(crm.id)}
                            className="mt-1"
                            disabled={!connected}
                          />
                        ) : (
                          <RadioGroup value={formData.sourceCrm} onValueChange={(value) => handleSourceCrmToggle(value)}>
                            <RadioGroupItem 
                              value={crm.id} 
                              id={`source-${crm.id}`} 
                              className="mt-1"
                              disabled={!connected}
                            />
                          </RadioGroup>
                        )}
                        <div className="flex-1">
                          <Label htmlFor={`source-${crm.id}`} className="font-medium cursor-pointer">
                            {crm.name}
                          </Label>
                          {crm.description && (
                            <p className="text-xs text-muted-foreground">{crm.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        {renderConnectionStatus(crm.id)}
                        {!connected && (
                          <span className="text-xs text-muted-foreground">Connection required</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </>
    );
  };

  const connectedCount = connectedSourceCrms.length;
  const selectedConnectedCount = multiCrmEnabled 
    ? selectedSourceCrms.filter(crmId => isConnected(crmId)).length
    : (formData.sourceCrm && isConnected(formData.sourceCrm) ? 1 : 0);

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Source CRM Configuration</h3>
      <p className="text-muted-foreground mb-6">
        Configure access to your current CRM system that you want to migrate from.
      </p>
      
      <div className="space-y-6">
        {connectedCount === 0 && (
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              You need to connect at least one source CRM to proceed. Click "Connect" on any CRM below to get started.
            </AlertDescription>
          </Alert>
        )}

        {connectedCount > 0 && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              You have {connectedCount} source CRM{connectedCount > 1 ? 's' : ''} connected. 
              {selectedConnectedCount > 0 && ` ${selectedConnectedCount} selected for migration.`}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-start space-x-2 p-3 bg-muted/40 rounded-md">
          <Checkbox 
            id="multi-crm" 
            checked={multiCrmEnabled}
            onCheckedChange={(checked) => setMultiCrmEnabled(checked === true)}
          />
          <div>
            <Label htmlFor="multi-crm" className="font-medium">Do you have data in multiple CRMs?</Label>
            <p className="text-xs text-muted-foreground">Enable this to select and configure multiple source CRMs</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{multiCrmEnabled ? "Select Source CRMs" : "Source CRM Platform"}</Label>
          {renderSourceCrmOptions()}
        </div>
      </div>

      {selectedSystem && (
        <ConnectionModal
          system={selectedSystem}
          type="source"
          isOpen={showConnectionModal}
          onClose={() => {
            setShowConnectionModal(false);
            setSelectedSystem(null);
          }}
        />
      )}
    </div>
  );
};

export default SourceCrmStep;
