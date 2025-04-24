
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ConnectionHealthIndicator from './ConnectionHealthIndicator';
import { SystemHealth } from '@/types/connectionHealth';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface ConnectionHealthWidgetProps {
  systemHealth: SystemHealth;
  isLoading: boolean;
  onRefresh: () => void;
  variant?: 'small' | 'medium';
}

const ConnectionHealthWidget: React.FC<ConnectionHealthWidgetProps> = ({
  systemHealth,
  isLoading,
  onRefresh,
  variant = 'medium'
}) => {
  const navigate = useNavigate();
  
  // Count connections by status
  const healthyCounts = systemHealth.connections.filter(c => c.status === 'healthy').length;
  const degradedCounts = systemHealth.connections.filter(c => c.status === 'degraded').length;
  const failedCounts = systemHealth.connections.filter(c => c.status === 'failed').length;
  const totalConnections = systemHealth.connections.length;
  
  const handleViewDetails = () => {
    navigate('/integrations?tab=health');
  };
  
  if (variant === 'small') {
    return (
      <Card className="bg-muted/40 shadow-sm">
        <CardContent className="p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ConnectionHealthIndicator status={systemHealth.overall} size="sm" />
            <span className="text-sm font-medium">Connection Health</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleViewDetails}>
                <Info className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View connection health details</p>
            </TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <ConnectionHealthIndicator 
              status={systemHealth.overall} 
              showLabel
              size="sm"
            />
            <span className="text-xs text-muted-foreground">
              Last checked: {format(systemHealth.lastUpdated, 'HH:mm')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRefresh} disabled={isLoading}>
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleViewDetails}>Details</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="py-1.5 px-1 bg-muted/30 rounded">
            <div className="text-green-600 dark:text-green-500 font-medium">{healthyCounts}</div>
            <div className="text-xs text-muted-foreground">Healthy</div>
          </div>
          <div className="py-1.5 px-1 bg-muted/30 rounded">
            <div className="text-amber-600 dark:text-amber-500 font-medium">{degradedCounts}</div>
            <div className="text-xs text-muted-foreground">Degraded</div>
          </div>
          <div className="py-1.5 px-1 bg-muted/30 rounded">
            <div className="text-red-600 dark:text-red-500 font-medium">{failedCounts}</div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionHealthWidget;
