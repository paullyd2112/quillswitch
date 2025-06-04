
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Zap,
  Settings,
  ExternalLink
} from 'lucide-react';
import { DetectedIntegration } from '@/services/autoConnector/autoConnectorService';
import { SystemIcon } from '@/config/utils/iconUtils';

interface DetectedIntegrationCardProps {
  integration: DetectedIntegration;
  onReconnect: (integrationId: string) => void;
}

const DetectedIntegrationCard: React.FC<DetectedIntegrationCardProps> = ({
  integration,
  onReconnect
}) => {
  const getCapabilityBadge = () => {
    switch (integration.reconnectionCapability) {
      case 'full':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Auto-Reconnect
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            <Settings className="h-3 w-3 mr-1" />
            Assisted Setup
          </Badge>
        );
      case 'basic':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Basic Setup
          </Badge>
        );
      case 'manual':
        return (
          <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            Manual Setup
          </Badge>
        );
    }
  };

  const getActionButton = () => {
    switch (integration.reconnectionCapability) {
      case 'full':
        return (
          <Button 
            onClick={() => onReconnect(integration.id)}
            size="sm"
            className="w-full"
          >
            <Zap className="h-3 w-3 mr-1" />
            Auto-Reconnect
          </Button>
        );
      case 'partial':
      case 'basic':
        return (
          <Button 
            onClick={() => onReconnect(integration.id)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Settings className="h-3 w-3 mr-1" />
            Guided Setup
          </Button>
        );
      case 'manual':
        return (
          <Button 
            onClick={() => onReconnect(integration.id)}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Setup Instructions
          </Button>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
              <SystemIcon initial={integration.name.substring(0, 2).toUpperCase()} color="blue-500" />
            </div>
            <div>
              <CardTitle className="text-sm">{integration.name}</CardTitle>
              <p className="text-xs text-muted-foreground capitalize">{integration.category.replace('-', ' ')}</p>
            </div>
          </div>
          {getCapabilityBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Confidence Score */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Detection Confidence</span>
            <span>{Math.round(integration.confidence * 100)}%</span>
          </div>
          <Progress value={integration.confidence * 100} className="h-2" />
        </div>

        {/* Data Found */}
        <div>
          <h4 className="text-sm font-medium mb-2">Data Patterns Found</h4>
          <div className="flex flex-wrap gap-1">
            {integration.dataFound.slice(0, 3).map((data, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs"
              >
                {data.replace('_', ' ')}
              </Badge>
            ))}
            {integration.dataFound.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{integration.dataFound.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Setup Time */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Setup Time:</span>
          <span className="font-medium">{integration.estimatedSetupTime} min</span>
        </div>

        {/* Credentials Needed */}
        <div>
          <h4 className="text-sm font-medium mb-1">Required:</h4>
          <p className="text-xs text-muted-foreground">
            {integration.credentialsNeeded.join(', ')}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectedIntegrationCard;
