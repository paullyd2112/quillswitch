import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { secureCredentialService } from "@/services/security/secureCredentialService";

interface ConnectedSystem {
  id: string;
  name: string;
  type: "source" | "destination" | "related";
  status: "connected" | "pending" | "error";
  icon?: string;
  errorMessage?: string;
  connectionDate?: Date;
  authMethod?: "oauth" | "api_key";
  credentialId?: string; // Reference to secure credential
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

  // Load connected systems from secure storage on initialization
  useEffect(() => {
    const loadConnectedSystems = async () => {
      try {
        // Load from secure credential service instead of localStorage
        const result = await secureCredentialService.listCredentials();
        if (result.success && result.credentials) {
          const systems: ConnectedSystem[] = result.credentials
            .filter(cred => cred.metadata?.connectionType)
            .map(cred => ({
              id: cred.serviceName,
              name: cred.serviceName.charAt(0).toUpperCase() + cred.serviceName.slice(1),
              type: cred.metadata?.connectionType as "source" | "destination" | "related",
              status: "connected" as const,
              connectionDate: new Date(),
              authMethod: cred.credentialType === 'oauth_token' ? 'oauth' : 'api_key',
              credentialId: cred.id
            }));
          setConnectedSystems(systems);
        }
      } catch (error) {
        console.error("Failed to load connected systems", error);
        // Fallback to localStorage for existing users during transition
        const storedSystems = localStorage.getItem("connected_systems");
        if (storedSystems) {
          try {
            const parsedSystems = JSON.parse(storedSystems);
            if (Array.isArray(parsedSystems)) {
              setConnectedSystems(parsedSystems);
              // Schedule migration of these systems
              setTimeout(() => migrateLegacyConnections(parsedSystems), 1000);
            }
          } catch (parseError) {
            console.error("Failed to parse stored connected systems", parseError);
          }
        }
      }
    };
    
    loadConnectedSystems();
  }, []);

  // Migration function for legacy localStorage connections
  const migrateLegacyConnections = async (legacySystems: ConnectedSystem[]) => {
    console.log("Migrating legacy connections to secure storage...");
    for (const system of legacySystems) {
      try {
        // Get the API key from localStorage if it exists
        const apiKey = localStorage.getItem(`secure_api_key_${system.id}`);
        if (apiKey) {
          await secureCredentialService.storeCredential({
            serviceName: system.id,
            credentialName: `${system.name} Connection`,
            credentialType: system.authMethod === 'oauth' ? 'oauth_token' : 'api_key',
            credentialValue: apiKey,
            environment: 'production',
            metadata: {
              connectionType: system.type,
              migrated: true,
              originalConnectionDate: system.connectionDate?.toISOString()
            }
          });
          
          // Clean up localStorage
          localStorage.removeItem(`secure_api_key_${system.id}`);
        }
      } catch (error) {
        console.error(`Failed to migrate connection for ${system.id}:`, error);
      }
    }
    
    // Clean up legacy storage
    localStorage.removeItem("connected_systems");
    toast.success("Legacy connections migrated to secure storage");
  };

  const connectWithOAuth = async (
    systemId: string, 
    type: "source" | "destination" | "related"
  ) => {
    try {
      setIsConnecting(true);
      setCurrentSystem(systemId);
      
      // Simulate OAuth flow - in a real app, this would redirect to the OAuth provider
      toast.info(`Starting OAuth flow for ${systemId}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if system is already connected
      if (connectedSystems.some(system => system.id === systemId)) {
        toast.info(`${systemId} is already connected`);
        return;
      }
      
      // For demo purposes, simulate a successful OAuth token
      const oauthToken = `oauth_${systemId}_${Date.now()}_demo_token`;
      
      // Store OAuth token securely
      const result = await secureCredentialService.storeCredential({
        serviceName: systemId,
        credentialName: `${systemId} OAuth Connection`,
        credentialType: 'oauth_token',
        credentialValue: oauthToken,
        environment: 'production',
        metadata: {
          connectionType: type,
          oauthProvider: systemId,
          connectedAt: new Date().toISOString()
        }
      });
      
      if (result.success) {
        // Add the new connected system
        setConnectedSystems(prev => [
          ...prev,
          {
            id: systemId,
            name: systemId.charAt(0).toUpperCase() + systemId.slice(1),
            type,
            status: "connected",
            connectionDate: new Date(),
            authMethod: "oauth",
            credentialId: result.id
          }
        ]);
        
        toast.success(`Successfully connected to ${systemId} using OAuth`);
      } else {
        throw new Error(result.error || 'Failed to store OAuth token');
      }
    } catch (error) {
      toast.error(`Failed to connect to ${systemId} with OAuth`);
      console.error("OAuth connection error:", error);
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

      // Store the API key securely using the secure credential service
      const result = await secureCredentialService.storeCredential({
        serviceName: systemId,
        credentialName: `${systemId} API Connection`,
        credentialType: 'api_key',
        credentialValue: apiKey,
        environment: 'production',
        metadata: {
          connectionType: type,
          connectedAt: new Date().toISOString()
        }
      });
      
      if (result.success) {
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
            connectionDate: new Date(),
            authMethod: "api_key",
            credentialId: result.id
          }
        ]);
        
        toast.success(`Successfully connected to ${systemId}`);
      } else {
        throw new Error(result.error || 'Failed to store API key securely');
      }
    } catch (error) {
      toast.error(`Failed to connect to ${systemId}`);
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
      setCurrentSystem(null);
    }
  };

  const disconnectSystem = async (systemId: string) => {
    try {
      const system = connectedSystems.find(s => s.id === systemId);
      if (system?.credentialId) {
        // Delete the credential from secure storage
        await secureCredentialService.deleteCredential(system.credentialId);
      }
      
      // Remove from local state
      setConnectedSystems(prev => prev.filter(system => system.id !== systemId));
      toast.success(`Disconnected from ${systemId}`);
    } catch (error) {
      console.error("Error disconnecting system:", error);
      toast.error(`Failed to disconnect from ${systemId}`);
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
