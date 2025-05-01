
import React, { createContext, useState, useContext } from "react";
import { toast } from "sonner";

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

  const connectSystem = async (
    systemId: string, 
    type: "source" | "destination" | "related",
    apiKey?: string
  ) => {
    try {
      setIsConnecting(true);
      setCurrentSystem(systemId);
      
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
    setConnectedSystems(prev => prev.filter(system => system.id !== systemId));
    toast.success(`Disconnected from ${systemId}`);
  };

  const validateConnection = async (systemId: string, apiKey: string): Promise<{ valid: boolean; message?: string }> => {
    // Simulate API key validation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple validation: API key must be at least 10 characters
    if (!apiKey || apiKey.length < 10) {
      return { 
        valid: false, 
        message: "API key must be at least 10 characters long" 
      };
    }
    
    // For demo, consider certain keys "invalid" to show error handling
    if (apiKey === "invalid_permissions") {
      return {
        valid: false,
        message: `QuillSwitch doesn't have permission to access required data in ${systemId}`
      };
    }
    
    return { valid: true };
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
