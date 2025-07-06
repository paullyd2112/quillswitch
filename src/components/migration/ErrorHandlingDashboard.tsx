import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { MigrationErrorHandler, MigrationError } from '@/services/migration/errorHandling/MigrationErrorHandler';
import { MigrationRecoveryService } from '@/services/migration/recovery/MigrationRecoveryService';
import { DataValidator, ValidationResult } from '@/services/migration/validation/DataValidator';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Undo2, Shield } from 'lucide-react';

interface ErrorHandlingDashboardProps {
  projectId: string;
}

const ErrorHandlingDashboard: React.FC<ErrorHandlingDashboardProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<MigrationError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recoveryState, setRecoveryState] = useState<any>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    loadErrorData();
    validateRecoveryState();
  }, [projectId]);

  const loadErrorData = async () => {
    setIsLoading(true);
    try {
      const unresolvedErrors = await MigrationErrorHandler.getUnresolvedErrors(projectId);
      setErrors(unresolvedErrors);
    } catch (error) {
      console.error('Failed to load error data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load error information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateRecoveryState = async () => {
    try {
      const state = await MigrationRecoveryService.validateRecoveryState(projectId);
      setRecoveryState(state);
    } catch (error) {
      console.error('Failed to validate recovery state:', error);
    }
  };

  const resolveError = async (errorId: string, resolutionNotes: string) => {
    try {
      await MigrationErrorHandler.markErrorResolved(errorId, resolutionNotes);
      toast({
        title: "Error Resolved",
        description: "Error has been marked as resolved"
      });
      loadErrorData();
    } catch (error) {
      toast({
        title: "Resolution Failed",
        description: "Failed to resolve error",
        variant: "destructive"
      });
    }
  };

  const initiateRollback = async (rollbackType: 'full' | 'partial' | 'object_type', objectTypes: string[] = []) => {
    setIsRecovering(true);
    try {
      const rollbackId = await MigrationRecoveryService.initiateRollback(
        projectId,
        rollbackType,
        objectTypes
      );
      
      toast({
        title: "Rollback Started",
        description: `${rollbackType} rollback has been initiated`
      });
      
      // Refresh data after rollback
      setTimeout(() => {
        loadErrorData();
        validateRecoveryState();
      }, 2000);
    } catch (error) {
      toast({
        title: "Rollback Failed",
        description: "Failed to initiate rollback",
        variant: "destructive"
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const getErrorSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getErrorIcon = (errorType: string) => {
    switch (errorType) {
      case 'auth_error':
      case 'permission_error':
        return <Shield className="h-4 w-4" />;
      case 'network_error':
      case 'rate_limit':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading error data...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Error Handling & Recovery Dashboard
            <Button onClick={loadErrorData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{errors.length}</div>
              <div className="text-sm text-muted-foreground">Unresolved Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {errors.filter(e => (e.error_details as any)?.retryable).length}
              </div>
              <div className="text-sm text-muted-foreground">Retryable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {errors.filter(e => (e.error_details as any)?.severity === 'high' || (e.error_details as any)?.severity === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
          </div>

          {recoveryState && !recoveryState.isConsistent && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Recovery State Issues Detected:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {recoveryState.issues.map((issue: string, index: number) => (
                    <li key={index} className="text-sm">{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="errors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="errors">Active Errors</TabsTrigger>
          <TabsTrigger value="recovery">Recovery Options</TabsTrigger>
          <TabsTrigger value="validation">Data Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="errors" className="space-y-4">
          {errors.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                No unresolved errors found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {errors.map((error) => (
                <Card key={error.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getErrorIcon(error.error_type)}
                        <h4 className="font-medium">{error.error_type.replace('_', ' ').toUpperCase()}</h4>
                        <Badge className={getErrorSeverityColor((error.error_details as any)?.severity || 'medium')}>
                          {(error.error_details as any)?.severity || 'medium'}
                        </Badge>
                        {(error.error_details as any)?.retryable && (
                          <Badge variant="outline">Retryable</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {(error.error_details as any)?.user_message || error.error_message}
                      </p>
                      
                      <div className="text-xs text-muted-foreground">
                        <span>Object: {error.object_type_id}</span>
                        {error.record_id && <span className="ml-2">Record: {error.record_id}</span>}
                        <span className="ml-2">Time: {new Date(error.created_at!).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveError(error.id!, 'Manually resolved via dashboard')}
                    >
                      Mark Resolved
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recovery" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Retry Failed Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Reset failed records to retry migration automatically
                </p>
                <Button
                  onClick={() => initiateRollback('partial', [])}
                  disabled={isRecovering}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry Failed
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rollback Object Type</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Rollback specific object types to restart migration
                </p>
                <Button
                  variant="outline"
                  onClick={() => initiateRollback('object_type', ['contacts'])}
                  disabled={isRecovering}
                  className="w-full"
                >
                  <Undo2 className="h-4 w-4 mr-1" />
                  Rollback Type
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Full Project Rollback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Reset entire project to pre-migration state
                </p>
                <Button
                  variant="destructive"
                  onClick={() => initiateRollback('full', [])}
                  disabled={isRecovering}
                  className="w-full"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Full Rollback
                </Button>
              </CardContent>
            </Card>
          </div>

          {recoveryState?.recommendations && recoveryState.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recovery Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recoveryState.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Validation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Data validation rules help prevent migration errors by checking data quality before migration.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Active Validations:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Email format validation</li>
                      <li>• Required field checks</li>
                      <li>• Duplicate record detection</li>
                      <li>• Phone number formatting</li>
                      <li>• Date format validation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Data Quality Checks:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Name consistency validation</li>
                      <li>• Contact information completeness</li>
                      <li>• Business logic validation</li>
                      <li>• Cross-field dependencies</li>
                      <li>• Historical data integrity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ErrorHandlingDashboard;