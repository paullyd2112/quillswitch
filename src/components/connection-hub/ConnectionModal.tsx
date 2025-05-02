import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemConfig } from "@/config/types/connectionTypes";
import { useConnection } from "@/contexts/ConnectionContext";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Check, Info, Shield, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { maskSensitiveData } from "@/utils/encryptionUtils";

interface ConnectionModalProps {
  system: SystemConfig;
  type: "source" | "destination" | "related";
  isOpen: boolean;
  onClose: () => void;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({ 
  system, 
  type,
  isOpen, 
  onClose 
}) => {
  const { connectSystem, validateConnection, showHelpGuide } = useConnection();
  const [step, setStep] = useState<'intro' | 'api' | 'success' | 'error'>('intro');
  const [apiKey, setApiKey] = useState("");
  const [apiKeyTouched, setApiKeyTouched] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails: any] = useState(null);
  const [showSecurity, setShowSecurity] = useState(false);

  // Auto clear API key from memory when component unmounts
  useEffect(() => {
    return () => {
      setApiKey("");
    };
  }, []);

  // Clear API key from memory when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setApiKey("");
      setApiKeyTouched(false);
      setValidationState('idle');
    }
  }, [isOpen]);

  const handleConnect = () => {
    // Always go directly to API key input regardless of authType
    setStep('api');
  };

  const validateApiKeyFormat = (key: string): boolean => {
    // Reject obviously invalid formats
    if (!key || key.length < 10) return false;
    if (key.includes(' ')) return false;
    if (/^(test|demo|example)/.test(key.toLowerCase())) return false;
    
    return true;
  };

  const handleApiKeySubmit = async () => {
    // Client-side validation before sending to server
    if (!validateApiKeyFormat(apiKey)) {
      setValidationState('invalid');
      setErrorMessage("Invalid API key format. Keys should be at least 10 characters with no spaces.");
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateConnection(system.id, apiKey);
      
      if (result.valid) {
        setValidationState('valid');
        connectSystem(system.id, type, apiKey);
        setStep('success');
        // Clear the API key from the component state as soon as it's no longer needed
        setTimeout(() => setApiKey(""), 100);
      } else {
        setValidationState('invalid');
        setErrorMessage(result.message || "Invalid API key");
        
        // If there's a specific permission error, show the error dialog
        if (result.message?.includes("permission")) {
          setStep('error');
          setErrorDetails({
            type: "permissions",
            message: result.message
          });
        }
      }
    } catch (error) {
      setValidationState('invalid');
      setErrorMessage("Connection validation failed");
    } finally {
      setIsValidating(false);
    }
  };

  const handleErrorHelp = () => {
    if (errorDetails) {
      showHelpGuide(errorDetails.type, system.name);
      onClose();
    }
  };

  const handleClose = () => {
    setStep('intro');
    setApiKey("");
    setApiKeyTouched(false);
    setValidationState('idle');
    setErrorMessage("");
    setErrorDetails(null);
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 'intro':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Connect to {system.name}</DialogTitle>
              <DialogDescription>
                Connect to {system.name} by providing your API key.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {system.connectionInstructions && (
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {system.connectionInstructions}
                  </AlertDescription>
                </Alert>
              )}
              
              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 mb-4">
                <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-700 dark:text-amber-300">
                  Your API keys are encrypted and stored securely. We never share your keys with third parties.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col gap-4">
                <p>
                  Connecting to {system.name} will allow QuillSwitch to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {system.permissions?.map((permission, index) => (
                    <li key={index} className="text-sm">{permission}</li>
                  )) || (
                    <>
                      <li className="text-sm">Access your {system.name} data</li>
                      <li className="text-sm">Perform migrations on your behalf</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleConnect}>Next</Button>
            </DialogFooter>
          </>
        );
        
      case 'api':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Connect to {system.name}</DialogTitle>
              <DialogDescription>
                Provide your API key to connect securely to {system.name}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">{system.name} API Key</Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type="password" 
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setApiKeyTouched(true);
                        setValidationState('idle');
                        setErrorMessage("");
                      }}
                      onBlur={() => setApiKeyTouched(true)}
                      className={`pr-10 ${
                        validationState === 'valid' ? 'border-green-500' : 
                        validationState === 'invalid' ? 'border-red-500' : ''
                      }`}
                      placeholder={`Enter your ${system.name} API key`}
                      autoComplete="off"
                    />
                    {validationState === 'valid' && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                        <Check className="h-5 w-5" />
                      </div>
                    )}
                    {validationState === 'invalid' && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                        <X className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  {validationState === 'invalid' && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  )}
                  {apiKeyTouched && apiKey && apiKey.length < 10 && validationState !== 'invalid' && (
                    <p className="text-sm text-amber-500">API key should be at least 10 characters</p>
                  )}
                </div>
                
                <div className="bg-muted p-3 rounded-md space-y-3">
                  <button 
                    onClick={() => setShowSecurity(!showSecurity)} 
                    className="text-sm font-medium flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <Shield className="h-3 w-3" /> How we protect your API keys
                  </button>
                  
                  {showSecurity && (
                    <div className="text-xs space-y-2 text-muted-foreground border-t pt-2 mt-1">
                      <p>• Your API keys are encrypted before being stored</p>
                      <p>• Keys are never transmitted to third parties</p>
                      <p>• We implement zero-knowledge design principles</p>
                      <p>• Keys are stored in secure, isolated storage</p>
                    </div>
                  )}
                  
                  {system.apiKeyHelp && (
                    <>
                      <h4 className="text-sm font-medium">Where to find your API key</h4>
                      <p className="text-xs text-muted-foreground">{system.apiKeyHelp}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button 
                onClick={handleApiKeySubmit} 
                disabled={!apiKey || apiKey.length < 10 || isValidating}
              >
                {isValidating ? 'Validating...' : 'Connect'}
              </Button>
            </DialogFooter>
          </>
        );
        
      case 'success':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
                <Check className="h-5 w-5" />
                Successfully Connected
              </DialogTitle>
              <DialogDescription>
                Your {system.name} account has been connected successfully.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                <p className="text-green-800 dark:text-green-300">
                  QuillSwitch can now access your {system.name} data according to the permissions you granted.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          {renderStepContent()}
        </DialogContent>
      </Dialog>
      
      {/* Error Dialog */}
      {step === 'error' && errorDetails && (
        <AlertDialog open={true} onOpenChange={() => setStep('api')}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600 dark:text-red-400">
                Connection Issue
              </AlertDialogTitle>
              <AlertDialogDescription>
                {errorDetails.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">How to fix this issue:</h4>
                <ul className="text-sm space-y-2">
                  <li>• Check if your API key has the right permissions</li>
                  <li>• Make sure you're using an API key and not a personal token</li>
                  <li>• Verify you have admin access in your {system.name} account</li>
                </ul>
              </div>
            </div>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setStep('api')}>
                Try Again
              </Button>
              <Button onClick={handleErrorHelp} variant="default">
                View Help Guide
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default ConnectionModal;
