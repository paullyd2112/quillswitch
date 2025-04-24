
import React from 'react';
import { ConnectionStatus } from '@/types/connectionHealth';
import { CheckCircle, AlertCircle, XCircle, HelpCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface ConnectionHealthIndicatorProps {
  status: ConnectionStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
  lastChecked?: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const ConnectionHealthIndicator: React.FC<ConnectionHealthIndicatorProps> = ({
  status,
  className,
  size = 'md',
  showLabel = false,
  showTooltip = true,
  lastChecked,
  onRefresh,
  isLoading = false
}) => {
  const getIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="text-green-500" />;
      case 'degraded':
        return <AlertCircle className="text-amber-500" />;
      case 'failed':
        return <XCircle className="text-red-500" />;
      default:
        return <HelpCircle className="text-gray-400" />;
    }
  };
  
  const getLabel = () => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'degraded':
        return 'Degraded';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };
  
  const getTooltipContent = () => {
    let content = `Status: ${getLabel()}`;
    
    if (lastChecked) {
      content += `\nLast checked: ${lastChecked.toLocaleTimeString()}`;
    }
    
    switch (status) {
      case 'healthy':
        content += '\nAll systems operating normally';
        break;
      case 'degraded':
        content += '\nSome services experiencing slowdowns';
        break;
      case 'failed':
        content += '\nCritical connection issues detected';
        break;
      default:
        content += '\nUnable to determine connection status';
    }
    
    return content;
  };
  
  const iconSizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  
  const indicator = (
    <div className={cn(
      "flex items-center gap-2",
      className
    )}>
      <div className={cn(
        "transition-all",
        iconSizeClass,
        isLoading && "animate-pulse"
      )}>
        {getIcon()}
      </div>
      {showLabel && (
        <span className={cn(
          "font-medium",
          status === 'healthy' && "text-green-600 dark:text-green-500",
          status === 'degraded' && "text-amber-600 dark:text-amber-500",
          status === 'failed' && "text-red-600 dark:text-red-500",
          status === 'unknown' && "text-gray-500 dark:text-gray-400"
        )}>
          {getLabel()}
        </span>
      )}
      {onRefresh && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRefresh}
          className="h-6 w-6"
          disabled={isLoading}
        >
          <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
        </Button>
      )}
    </div>
  );
  
  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {indicator}
        </TooltipTrigger>
        <TooltipContent>
          <p className="whitespace-pre-line text-sm">{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return indicator;
};

export default ConnectionHealthIndicator;
