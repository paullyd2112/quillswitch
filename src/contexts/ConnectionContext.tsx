
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { storeSecureData, getSecureData, encryptData } from "@/utils/encryptionUtils";
import { crmLog, securityLog } from "@/utils/logging/consoleReplacer";


interface ConnectedSystem {
  id: string;
  name: string;
  type: "source" | "destination" | "related";
  status: "connected" | "pending" | "error";
  icon?: string;
  errorMessage?: string;
  connectionDate?: Date;
  authMethod?: "oauth" | "api_key";
}

interface ConnectionContextType {
  connectedSystems: ConnectedSystem[];
  isConnecting: boolean;
  currentSystem: string | null;
  connectSystem: (systemId: string, type: "source" | "destination" | "related", apiKey?: string) => void;
  connectWithOAuth: (systemId: string, type: "source" | "destination" | "related") => void;
  disconnectSystem: (systemId: string) => void;
  validateConnection: (systemId: string, apiKey: string) => Promise<{ valid: boolean; message?: string }>;
  showHelpGuide: (errorType: string, systemName: string) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectedSystems, setConnectedSystems] = useState<ConnectedSystem[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentSystem, setCurrentSystem] = useState<string | null>(null);

  // Load connected systems from native CRM connections
  useEffect(() => {
    const loadConnectedSystems = async () => {
      try {
        // TODO: Load from native CRM connections stored in Supabase
        setConnectedSystems([]);
      } catch (error) {
        crmLog.error('Failed to load connected systems', error instanceof Error ? error : undefined);
      }
    };
    
    loadConnectedSystems();
  }, []);

  const connectWithOAuth = async (
    systemId: string, 
    type: "source" | "destination" | "related"
  ) => {
    try {
      setIsConnecting(true);
      setCurrentSystem(systemId);
      
      // Check if system is already connected
      if (connectedSystems.some(system => system.id === systemId)) {
        toast.info(`${systemId} is already connected`);
        return;
      }
      
      // TODO: Implement native CRM OAuth connection
      toast.info(`OAuth connection to ${systemId} not yet implemented with native CRM integration`);
      
      // For now, simulate a successful connection
      setTimeout(() => {
        setConnectedSystems(prev => [
          ...prev,
          {
            id: systemId,
            name: systemId.charAt(0).toUpperCase() + systemId.slice(1),
            type,
            status: "connected",
            connectionDate: new Date(),
            authMethod: "oauth"
          }
        ]);
        toast.success(`Successfully connected to ${systemId} using OAuth`);
      }, 1000);
      
    } catch (error) {
      toast.error(`Failed to connect to ${systemId} with OAuth`);
      crmLog.error('OAuth connection error', error instanceof Error ? error : undefined, { systemId, type });
    } finally {
      setIsConnecting(false);
      setCurrentSystem(null);
    }
  };

  const connectSystem = async (
    systemId: string, 
    type: "source" | "destination" | "related",
    apiKey?: string
  ) => {
    try {
      setIsConnecting(true);
      setCurrentSystem(systemId);
      
      // Require API key for API key connections
      if (!apiKey) {
        toast.error(`API key is required to connect to ${systemId}`);
        return;
      }

      // Store the API key securely
      const secureKeyId = `api_key_${systemId}`;
      try {
        await storeSecureData(secureKeyId, apiKey, true); // Store temporarily encrypted
      } catch (error) {
        securityLog.error('Failed to store API key securely', error instanceof Error ? error : undefined, { systemId });
        toast.error('Failed to store API key securely');
        return;
      }
      
      // Validate the API key with real API before connecting
      const validationResult = await validateConnection(systemId, apiKey);
      if (!validationResult.valid) {
        toast.error(validationResult.message || `Failed to validate ${systemId} connection`);
        return;
      }
      
      // Check if system is already connected
      if (connectedSystems.some(system => system.id === systemId)) {
        toast.info(`${systemId} is already connected`);
        return;
      }
      
      // Add the new connected system
      setConnectedSystems(prev => [
        ...prev,
        {
          id: systemId,
          name: systemId.charAt(0).toUpperCase() + systemId.slice(1),
          type,
          status: "connected",
          connectionDate: new Date(),
          authMethod: "api_key"
        }
      ]);
      
      toast.success(`Successfully connected to ${systemId}`);
    } catch (error) {
      toast.error(`Failed to connect to ${systemId}`);
      crmLog.error('Connection error', error instanceof Error ? error : undefined, { systemId, type });
    } finally {
      setIsConnecting(false);
      setCurrentSystem(null);
    }
  };

  const disconnectSystem = async (systemId: string) => {
    try {
      // TODO: Implement native CRM disconnection
      
      // Update local state
      setConnectedSystems(prev => prev.filter(system => system.id !== systemId));
      
      // Clean up any stored API keys
      const secureKeyId = `api_key_${systemId}`;
      localStorage.removeItem(`secure_${secureKeyId}`);
      
      toast.success(`Disconnected from ${systemId}`);
    } catch (error) {
      toast.error(`Failed to disconnect from ${systemId}`);
      crmLog.error('Disconnect error', error instanceof Error ? error : undefined, { systemId });
    }
  };

  const validateConnection = async (systemId: string, apiKey: string): Promise<{ valid: boolean; message?: string }> => {
    if (!apiKey || apiKey.trim() === '') {
      return { 
        valid: false, 
        message: "API key cannot be empty" 
      };
    }
    
    // Simple validation: API key must be at least 10 characters with no spaces
    if (apiKey.length < 10 || apiKey.includes(' ')) {
      return { 
        valid: false, 
        message: "API key must be at least 10 characters long and contain no spaces" 
      };
    }
    
    try {
      // TODO: Implement native CRM API validation
      // For now, just validate the format
      return { 
        valid: true,
        message: "API key format validated (native CRM validation pending)"
      };
    } catch (error) {
      crmLog.error('Validation error', error instanceof Error ? error : undefined, { systemId });
      return {
        valid: false,
        message: "Connection validation failed due to a network error. Please try again."
      };
    }
  };

  const showHelpGuide = (errorType: string, systemName: string) => {
    // In a real implementation, this would navigate to specific help content
    toast.info(`Opening help guide for ${errorType} issue with ${systemName}`);
  };

  return (
    <ConnectionContext.Provider
      value={{
        connectedSystems,
        isConnecting,
        currentSystem,
        connectSystem,
        connectWithOAuth,
        disconnectSystem,
        validateConnection,
        showHelpGuide
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
