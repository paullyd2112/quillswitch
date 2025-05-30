
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

interface DestinationCrmStepProps {
  formData: SetupFormData;
  multiDestinationEnabled: boolean;
  setMultiDestinationEnabled: (enabled: boolean) => void;
  selectedDestinationCrms: string[];
  handleDestinationCrmToggle: (crmId: string) => void;
  handleApiKeyChange: (crmId: string, value: string) => void;
  handleCustomCrmNameChange: (crmId: string, value: string) => void;
  customCrmNames: Record<string, string>;
  destinationCrmOptions: CrmSystem[];
}

const DestinationCrmStep: React.FC<DestinationCrmStepProps> = ({
  formData,
  multiDestinationEnabled,
  setMultiDestinationEnabled,
  selectedDestinationCrms,
  handleDestinationCrmToggle,
  handleApiKeyChange,
  handleCustomCrmNameChange,
  customCrmNames,
  destinationCrmOptions
}) => {
  const { connectedSystems } = useConnection();
  const [selectedSystem, setSelectedSystem] = useState<any>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  // Get connected destination CRMs
  const connectedDestinationCrms = connectedSystems.filter(system => system.type === "destination");
  
  const handleConnectCrm = (crmId: string) => {
    const systemConfig = crmSystems.find(system => 
      system.id === crmId && system.connectionType === "destination"
    );
    
    if (systemConfig) {
      setSelectedSystem(systemConfig);
      setShowConnectionModal(true);
    }
  };

  const isConnected = (crmId: string) => {
    return connectedDestinationCrms.some(system => system.id === crmId);
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
  
  const renderDestinationCrmOptions = () => {
    const popularOptions = destinationCrmOptions.filter(crm => crm.popular);
    const otherOptions = destinationCrmOptions.filter(crm => !crm.popular);
    
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {popularOptions.map(crm => {
            const connected = isConnected(crm.id);
            const isSelected = multiDestinationEnabled 
              ? selectedDestinationCrms.includes(crm.id)
              : formData.destinationCrm === crm.id;
            
            return (
              <div 
                key={crm.id}
                className={`border rounded-md p-3 transition-colors ${
                  isSelected ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
                } ${connected ? "border-green-200 dark:border-green-800" : ""}`}
              >
                <div className="flex items-start gap-2 mb-3">
                  {multiDestinationEnabled ? (
                    <Checkbox 
                      checked={selectedDestinationCrms.includes(crm.id)} 
                      onCheckedChange={() => handleDestinationCrmToggle(crm.id)}
                      className="mt-1"
                      disabled={!connected}
                    />
                  ) : (
                    <RadioGroup value={formData.destinationCrm} onValueChange={(value) => handleDestinationCrmToggle(value)}>
                      <RadioGroupItem 
                        value={crm.id} 
                        id={`destination-${crm.id}`} 
                        className="mt-1"
                        disabled={!connected}
                      />
                    </RadioGroup>
                  )}
                  <div className="flex-1">
                    <Label htmlFor={`destination-${crm.id}`} className="font-medium cursor-pointer">
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
                  const isSelected = multiDestinationEnabled 
                    ? selectedDestinationCrms.includes(crm.id)
                    : formData.destinationCrm === crm.id;
                  
                  return (
                    <div 
                      key={crm.id}
                      className={`border rounded-md p-3 transition-colors ${
                        isSelected ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
                      } ${connected ? "border-green-200 dark:border-green-800" : ""}`}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        {multiDestinationEnabled ? (
                          <Checkbox 
                            checked={selectedDestinationCrms.includes(crm.id)} 
                            onCheckedChange={() => handleDestinationCrmToggle(crm.id)}
                            className="mt-1"
                            disabled={!connected}
                          />
                        ) : (
                          <RadioGroup value={formData.destinationCrm} onValueChange={(value) => handleDestinationCrmToggle(value)}>
                            <RadioGroupItem 
                              value={crm.id} 
                              id={`destination-${crm.id}`} 
                              className="mt-1"
                              disabled={!connected}
                            />
                          </RadioGroup>
                        )}
                        <div className="flex-1">
                          <Label htmlFor={`destination-${crm.id}`} className="font-medium cursor-pointer">
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

  const connectedCount = connectedDestinationCrms.length;
  const selectedConnectedCount = multiDestinationEnabled 
    ? selectedDestinationCrms.filter(crmId => isConnected(crmId)).length
    : (formData.destinationCrm && isConnected(formData.destinationCrm) ? 1 : 0);

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Destination CRM Configuration</h3>
      <p className="text-muted-foreground mb-6">
        Configure access to your target CRM system where your data will be migrated to.
      </p>
      
      <div className="space-y-6">
        {connectedCount === 0 && (
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              You need to connect at least one destination CRM to proceed. Click "Connect" on any CRM below to get started.
            </AlertDescription>
          </Alert>
        )}

        {connectedCount > 0 && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              You have {connectedCount} destination CRM{connectedCount > 1 ? 's' : ''} connected. 
              {selectedConnectedCount > 0 && ` ${selectedConnectedCount} selected for migration.`}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-start space-x-2 p-3 bg-muted/40 rounded-md">
          <Checkbox 
            id="multi-destination" 
            checked={multiDestinationEnabled}
            onCheckedChange={(checked) => setMultiDestinationEnabled(checked === true)}
          />
          <div>
            <Label htmlFor="multi-destination" className="font-medium">Do you want to migrate to multiple CRMs?</Label>
            <p className="text-xs text-muted-foreground">Enable this to select and configure multiple destination CRMs</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{multiDestinationEnabled ? "Select Destination CRMs" : "Destination CRM Platform"}</Label>
          {renderDestinationCrmOptions()}
        </div>
      </div>

      {selectedSystem && (
        <ConnectionModal
          system={selectedSystem}
          type="destination"
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

export default DestinationCrmStep;
