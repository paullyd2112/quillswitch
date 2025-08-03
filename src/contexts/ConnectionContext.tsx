import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { crmLog } from "@/utils/logging/consoleReplacer";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { initiateNangoOAuth, NangoProvider } from "@/lib/nango";
import { supabase } from "@/integrations/supabase/client";

interface ConnectedSystem {
  id: string;
  name: string;
  type: "source" | "destination" | "related";
  status: "connected" | "connecting" | "error";
  connectionDate: Date;
  authMethod: "oauth" | "api_key";
  connectedAt?: string;
  lastSync?: string;
}

interface ConnectionContextType {
  connectedSystems: ConnectedSystem[];
  isConnecting: boolean;
  currentSystem: string | null;
  connectSystem: (systemId: string, type: "source" | "destination" | "related") => void;
  connectWithOAuth: (systemId: string, type: "source" | "destination" | "related") => Promise<void>;
  validateConnection: (systemId: string) => Promise<boolean>;
  showHelpGuide: (systemId: string) => void;
}

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};

interface ConnectionProviderProps {
  children: ReactNode;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
  const [connectedSystems, setConnectedSystems] = useState<ConnectedSystem[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentSystem, setCurrentSystem] = useState<string | null>(null);
  const { toast } = useToast();
  const { session, isLoading: sessionLoading } = useSessionContext();

  // Load connected systems from Supabase
  const loadConnectedSystems = async () => {
    if (!session?.user) return;

    try {
      const { data: credentials, error } = await supabase
        .from('service_credentials')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('credential_type', 'oauth_token');

      if (error) {
        console.error('Error loading connected systems:', error);
        return;
      }

      const systems: ConnectedSystem[] = credentials.map(cred => ({
        id: cred.service_name,
        name: cred.credential_name,
        type: "source", // Default, could be enhanced with metadata
        status: "connected" as const,
        connectionDate: new Date(cred.created_at),
        authMethod: "oauth" as const,
        connectedAt: cred.created_at,
        lastSync: cred.last_used || cred.updated_at
      }));

      setConnectedSystems(systems);
    } catch (error) {
      console.error('Failed to load connected systems:', error);
    }
  };

  useEffect(() => {
    if (session && !sessionLoading) {
      loadConnectedSystems();
    }
  }, [session, sessionLoading]);

  const connectWithOAuth = async (
    systemId: string, 
    type: "source" | "destination" | "related"
  ): Promise<void> => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to connect systems.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsConnecting(true);
      setCurrentSystem(systemId);
      
      // Check if system is already connected
      if (connectedSystems.some(system => system.id === systemId)) {
        toast({
          title: "Already connected",
          description: `${systemId} is already connected`,
          variant: "default"
        });
        return;
      }
      
      console.log(`Starting ${systemId} OAuth flow via Nango`);
      
      // Use Nango for OAuth flow - same as CRM connections
      const result = await initiateNangoOAuth(systemId as NangoProvider, session.user.id);
      
      if (result.success && result.result) {
        // The connection will be stored in the database by the useCrmConnections hook
        // Just update the local state
        const newSystem: ConnectedSystem = {
          id: systemId,
          name: systemId.charAt(0).toUpperCase() + systemId.slice(1),
          type: type,
          status: 'connected',
          connectionDate: new Date(),
          authMethod: 'oauth',
          connectedAt: new Date().toISOString(),
          lastSync: new Date().toISOString()
        };
        
        setConnectedSystems(prev => [...prev, newSystem]);
        
        toast({
          title: "Connected successfully!",
          description: `Successfully connected to ${systemId}`,
        });
        
        // Reload connected systems to get the actual database state
        await loadConnectedSystems();
      } else {
        throw new Error(result.error?.message || `Failed to connect to ${systemId}`);
      }
    } catch (error: any) {
      console.error(`Failed to connect to ${systemId}:`, error);
      crmLog.error('OAuth connection error', error instanceof Error ? error : undefined, { systemId, type });
      
      toast({
        title: "Connection failed",
        description: error.message || `Failed to connect to ${systemId}`,
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
      setCurrentSystem(null);
    }
  };

  const connectSystem = (systemId: string, type: "source" | "destination" | "related") => {
    // Default to OAuth connection
    connectWithOAuth(systemId, type);
  };

  const validateConnection = async (systemId: string): Promise<boolean> => {
    try {
      // Find the credential for this system
      const { data: credential, error } = await supabase
        .from('service_credentials')
        .select('id')
        .eq('service_name', systemId)
        .eq('user_id', session?.user?.id)
        .single();

      if (error || !credential) {
        return false;
      }

      // Test the connection based on the system type
      if (systemId === 'salesforce') {
        const { data, error: testError } = await supabase.functions.invoke('test-salesforce-connection', {
          body: { credentialId: credential.id }
        });
        
        return data?.success || false;
      }
      
      // For other systems, assume valid if credential exists
      return true;
    } catch (error) {
      console.error(`Failed to validate ${systemId} connection:`, error);
      return false;
    }
  };

  const showHelpGuide = (systemId: string) => {
    // Open help documentation or guide
    toast({
      title: "Help Guide",
      description: `Opening help guide for ${systemId}...`,
    });
    // Could open a modal or redirect to documentation
  };

  const value: ConnectionContextType = {
    connectedSystems,
    isConnecting,
    currentSystem,
    connectSystem,
    connectWithOAuth,
    validateConnection,
    showHelpGuide,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};