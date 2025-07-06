import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { unifiedApiService, UnifiedConnection, ConnectionHealth } from '@/services/unified/UnifiedApiService';
import { Loader2, CheckCircle, AlertTriangle, XCircle, ExternalLink, Trash2, TestTube } from 'lucide-react';

interface UnifiedConnectionManagerProps {
  onConnectionChange?: () => void;
}

const UnifiedConnectionManager: React.FC<UnifiedConnectionManagerProps> = ({ onConnectionChange }) => {
  const { toast } = useToast();
  const [connections, setConnections] = useState<UnifiedConnection[]>([]);
  const [availableIntegrations, setAvailableIntegrations] = useState<Array<{id: string, name: string, category: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionHealth, setConnectionHealth] = useState<Record<string, ConnectionHealth>>({});
  const [testingConnections, setTestingConnections] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [connectionsData, integrationsData] = await Promise.all([
        unifiedApiService.getUserConnections(),
        unifiedApiService.getAvailableIntegrations()
      ]);
      
      setConnections(connectionsData);
      setAvailableIntegrations(integrationsData);
    } catch (error) {
      console.error('Failed to load connection data:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load connection information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (integrationId: string) => {
    try {
      const { authUrl } = await unifiedApiService.initiateConnection(integrationId);
      
      // Open auth URL in new window
      const popup = window.open(
        authUrl,
        'unified-auth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for successful connection
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Refresh connections after popup closes
          setTimeout(() => {
            loadData();
            onConnectionChange?.();
          }, 1000);
        }
      }, 1000);

      toast({
        title: "Connection Started",
        description: "Complete the authorization in the popup window",
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to the service",
        variant: "destructive"
      });
    }
  };

  const handleTestConnection = async (connectionId: string) => {
    setTestingConnections(prev => new Set([...prev, connectionId]));
    
    try {
      const health = await unifiedApiService.testConnection(connectionId);
      setConnectionHealth(prev => ({ ...prev, [connectionId]: health }));
      
      toast({
        title: health.status === 'healthy' ? "Connection Healthy" : "Connection Issues",
        description: health.status === 'healthy' 
          ? "Connection is working properly" 
          : `Issues found: ${health.issues.join(', ')}`,
        variant: health.status === 'healthy' ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Connection test failed:', error);
      toast({
        title: "Test Failed",
        description: "Failed to test connection",
        variant: "destructive"
      });
    } finally {
      setTestingConnections(prev => {
        const newSet = new Set(prev);
        newSet.delete(connectionId);
        return newSet;
      });
    }
  };

  const handleRemoveConnection = async (connectionId: string, connectionName: string) => {
    if (!confirm(`Are you sure you want to remove the connection to ${connectionName}?`)) {
      return;
    }

    try {
      await unifiedApiService.removeConnection(connectionId);
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      onConnectionChange?.();
      
      toast({
        title: "Connection Removed",
        description: `Successfully removed connection to ${connectionName}`,
      });
    } catch (error) {
      console.error('Failed to remove connection:', error);
      toast({
        title: "Removal Failed",
        description: error instanceof Error ? error.message : "Failed to remove connection",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string, health?: ConnectionHealth) => {
    if (health) {
      switch (health.status) {
        case 'healthy':
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'warning':
          return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        case 'error':
          return <XCircle className="h-4 w-4 text-red-500" />;
      }
    }

    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string, health?: ConnectionHealth) => {
    if (health) {
      switch (health.status) {
        case 'healthy':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'warning':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'error':
          return 'bg-red-100 text-red-800 border-red-200';
      }
    }

    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading connections...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Connections</CardTitle>
        </CardHeader>
        <CardContent>
          {connections.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No active connections found. Connect to a CRM system below to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {connections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(connection.status, connectionHealth[connection.id])}
                    <div>
                      <div className="font-medium">{connection.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Connected on {new Date(connection.created_at).toLocaleDateString()}
                        {connection.last_sync && (
                          <span className="ml-2">
                            • Last sync: {new Date(connection.last_sync).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(connection.status, connectionHealth[connection.id])}>
                      {connectionHealth[connection.id]?.status || connection.status}
                    </Badge>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestConnection(connection.id)}
                      disabled={testingConnections.has(connection.id)}
                    >
                      {testingConnections.has(connection.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveConnection(connection.id, connection.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableIntegrations.map((integration) => {
              const isAlreadyConnected = connections.some(conn => conn.type === integration.id);
              
              return (
                <div key={integration.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{integration.name}</h3>
                    <Badge variant="outline">{integration.category}</Badge>
                  </div>
                  
                  <Button
                    onClick={() => handleConnect(integration.id)}
                    disabled={isAlreadyConnected}
                    className="w-full"
                    variant={isAlreadyConnected ? "secondary" : "default"}
                  >
                    {isAlreadyConnected ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Connected
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedConnectionManager;