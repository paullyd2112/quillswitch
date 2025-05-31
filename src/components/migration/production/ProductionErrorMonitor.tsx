
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';
import { MigrationError } from '@/services/migration/optimization/migrationErrorHandler';

interface ProductionErrorMonitorProps {
  errors: MigrationError[];
  errorStats: {
    totalErrors: number;
    errorsByType: Record<string, number>;
    errorsBySeverity: Record<string, number>;
    retryableErrors: number;
  };
  onRetryError: (errorId: string) => void;
  onClearErrors: () => void;
}

const ProductionErrorMonitor: React.FC<ProductionErrorMonitorProps> = ({
  errors,
  errorStats,
  onRetryError,
  onClearErrors
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-4">
      {/* Error Statistics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Error Monitor
            </CardTitle>
            {errorStats.totalErrors > 0 && (
              <Button variant="outline" size="sm" onClick={onClearErrors}>
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {errorStats.totalErrors === 0 ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">No errors detected</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overall Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {errorStats.totalErrors}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Errors</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {errorStats.retryableErrors}
                  </div>
                  <div className="text-sm text-muted-foreground">Retryable</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.keys(errorStats.errorsByType).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Error Types</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {errorStats.errorsBySeverity.critical || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Critical</div>
                </div>
              </div>

              {/* Error Type Breakdown */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Error Types</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(errorStats.errorsByType).map(([type, count]) => (
                    <Badge key={type} variant="outline">
                      {type}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Errors */}
      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Errors</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {errors.map((error) => (
                <Alert key={error.id} className="relative">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(error.severity)}
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(error.severity)}>
                          {error.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {error.severity}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(error.timestamp)}
                        </div>
                      </div>
                      
                      <AlertDescription className="text-sm">
                        {error.message}
                      </AlertDescription>
                      
                      {error.recordId && (
                        <div className="text-xs text-muted-foreground">
                          Record ID: {error.recordId}
                        </div>
                      )}
                      
                      {error.suggestedAction && (
                        <div className="text-xs text-blue-600">
                          💡 {error.suggestedAction}
                        </div>
                      )}
                    </div>
                    
                    {error.retryable && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRetryError(error.id)}
                        className="ml-auto"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionErrorMonitor;
