
import { useState, useEffect } from 'react';
import { ConnectionStatus, ConnectionHealth, SystemHealth } from '@/types/connectionHealth';
import { Connector } from '@/types/connectors';
import { apiClient } from '@/services/migration/apiClient';

export function useConnectionHealth(connectors?: Connector[]) {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'unknown',
    connections: [],
    lastUpdated: new Date()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check the health of a single connector
  const checkConnectorHealth = async (connector: Connector): Promise<ConnectionHealth> => {
    try {
      // For demo purposes, we'll simulate API response with random statuses
      // In a real implementation, this would call the API client to check the connector's health
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const statuses: ConnectionStatus[] = ['healthy', 'healthy', 'healthy', 'degraded', 'failed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const responseTime = Math.floor(Math.random() * 800) + 100;
      
      return {
        id: `health-${connector.id}`,
        connectorId: connector.id,
        status: randomStatus,
        lastChecked: new Date(),
        responseTime,
        uptime: randomStatus === 'healthy' ? 99.9 : randomStatus === 'degraded' ? 95 : 80,
        errorCount: randomStatus === 'healthy' ? 0 : randomStatus === 'degraded' ? 2 : 8,
        lastError: randomStatus === 'failed' ? 'Connection timeout' : undefined,
        metrics: {
          apiCalls24h: Math.floor(Math.random() * 1000) + 100,
          successRate: randomStatus === 'healthy' ? 99.8 : randomStatus === 'degraded' ? 94 : 70,
          averageResponseTime: responseTime
        }
      };
    } catch (e) {
      console.error(`Failed to check health for connector ${connector.id}:`, e);
      return {
        id: `health-${connector.id}`,
        connectorId: connector.id,
        status: 'unknown',
        lastChecked: new Date(),
        errorCount: 1,
        lastError: e instanceof Error ? e.message : 'Unknown error'
      };
    }
  };

  // Determine overall system health based on individual connections
  const calculateOverallHealth = (connections: ConnectionHealth[]): ConnectionStatus => {
    if (connections.length === 0) return 'unknown';
    
    const failedCount = connections.filter(c => c.status === 'failed').length;
    const degradedCount = connections.filter(c => c.status === 'degraded').length;
    const healthyCount = connections.filter(c => c.status === 'healthy').length;
    
    if (failedCount > 0 && failedCount / connections.length > 0.2) {
      return 'failed';
    } else if (degradedCount > 0 || failedCount > 0) {
      return 'degraded';
    } else if (healthyCount === connections.length) {
      return 'healthy';
    }
    
    return 'unknown';
  };

  // Fetch health status for all connectors
  const fetchHealthStatus = async () => {
    if (!connectors || connectors.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const connectionHealths = await Promise.all(
        connectors.map(connector => checkConnectorHealth(connector))
      );
      
      const overall = calculateOverallHealth(connectionHealths);
      
      setSystemHealth({
        overall,
        connections: connectionHealths,
        lastUpdated: new Date()
      });
    } catch (e) {
      console.error('Failed to fetch connection health:', e);
      setError(e instanceof Error ? e.message : 'Failed to check connection health');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh connection health
  const refreshHealth = () => {
    fetchHealthStatus();
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchHealthStatus();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchHealthStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [connectors]);

  return {
    systemHealth,
    isLoading,
    error,
    refreshHealth
  };
}
