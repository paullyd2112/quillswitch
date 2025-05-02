
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { storeSecureData, getSecureData, encryptData } from "@/utils/encryptionUtils";

interface ConnectedSystem {
  id: string;
  name: string;
  type: "source" | "destination" | "related";
  status: "connected" | "pending" | "error";
  icon?: string;
  errorMessage?: string;
  connectionDate?: Date;
}

interface ConnectionContextType {
  connectedSystems: ConnectedSystem[];
  isConnecting: boolean;
  currentSystem: string | null;
  connectSystem: (systemId: string, type: "source" | "destination" | "related", apiKey?: string) => void;
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

  // Load connected systems from secure storage on initialization
  useEffect(() => {
    const loadConnectedSystems = () => {
      const storedSystems = getSecureData("connected_systems");
      if (storedSystems) {
        try {
          const parsedSystems = JSON.parse(storedSystems);
          if (Array.isArray(parsedSystems)) {
            setConnectedSystems(parsedSystems);
          }
        } catch (error) {
          console.error("Failed to parse stored connected systems", error);
        }
      }
    };
    
    loadConnectedSystems();
  }, []);

  // Save connected systems to secure storage whenever they change
  useEffect(() => {
    if (connectedSystems.length > 0) {
      storeSecureData("connected_systems", JSON.stringify(connectedSystems));
    }
  }, [connectedSystems]);

  const connectSystem = async (
    systemId: string, 
    type: "source" | "destination" | "related",
    apiKey?: string
  ) => {
    try {
      setIsConnecting(true);
      setCurrentSystem(systemId);
      
      // Require API key for all connections
      if (!apiKey) {
        toast.error(`API key is required to connect to ${systemId}`);
        return;
      }

      // Store the API key securely
      const secureKeyId = `api_key_${systemId}`;
      const encryptedApiKey = encryptData(apiKey);
      storeSecureData(secureKeyId, encryptedApiKey);
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
          connectionDate: new Date()
        }
      ]);
      
      toast.success(`Successfully connected to ${systemId}`);
    } catch (error) {
      toast.error(`Failed to connect to ${systemId}`);
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
      setCurrentSystem(null);
    }
  };

  const disconnectSystem = (systemId: string) => {
    // Remove the stored API key when disconnecting
    const secureKeyId = `api_key_${systemId}`;
    localStorage.removeItem(`secure_${secureKeyId}`);
    
    setConnectedSystems(prev => prev.filter(system => system.id !== systemId));
    toast.success(`Disconnected from ${systemId}`);
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
      // Simulate API key validation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo, consider certain keys "invalid" to show error handling
      if (apiKey === "invalid_permissions") {
        return {
          valid: false,
          message: `QuillSwitch doesn't have permission to access required data in ${systemId}`
        };
      }
      
      // Check for common test/demo API keys that shouldn't be used in production
      if (apiKey.includes("test") || apiKey.includes("demo") || apiKey.includes("example")) {
        return {
          valid: false,
          message: `This appears to be a test API key. Please use a production key for ${systemId}`
        };
      }
      
      return { valid: true };
    } catch (error) {
      console.error("Validation error:", error);
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
        disconnectSystem,
        validateConnection,
        showHelpGuide
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
