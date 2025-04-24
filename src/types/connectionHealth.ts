
export type ConnectionStatus = 'healthy' | 'degraded' | 'failed' | 'unknown';

export interface ConnectionHealth {
  id: string;
  connectorId: string;
  status: ConnectionStatus;
  lastChecked: Date;
  responseTime?: number; // in ms
  uptime?: number; // percentage
  errorCount?: number;
  lastError?: string;
  metrics?: {
    apiCalls24h?: number;
    successRate?: number;
    averageResponseTime?: number;
  };
}

export type SystemHealth = {
  overall: ConnectionStatus;
  connections: ConnectionHealth[];
  lastUpdated: Date;
};
