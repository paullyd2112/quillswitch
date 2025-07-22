import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Download,
  RefreshCw,
  Lock,
  Unlock
} from "lucide-react";
import { PermissionAudit } from "../automated-mapping/types";

interface PermissionAuditPanelProps {
  audits: PermissionAudit[];
  onRefreshAudit?: () => void;
  onDownloadReport?: () => void;
}

const PermissionAuditPanel: React.FC<PermissionAuditPanelProps> = ({
  audits,
  onRefreshAudit,
  onDownloadReport
}) => {
  const [selectedService, setSelectedService] = useState<string>(audits[0]?.service || '');

  const getRiskLevelColor = (riskLevel: PermissionAudit['riskLevel']) => {
    switch (riskLevel) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          badge: 'destructive' as const
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          badge: 'outline' as const
        };
      case 'low':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          badge: 'secondary' as const
        };
    }
  };

  const getOverallRiskLevel = () => {
    if (audits.some(audit => audit.riskLevel === 'high')) return 'high';
    if (audits.some(audit => audit.riskLevel === 'medium')) return 'medium';
    return 'low';
  };

  const getTotalExcessivePermissions = () => {
    return audits.reduce((total, audit) => total + audit.excessivePermissions.length, 0);
  };

  const getTotalMissingPermissions = () => {
    return audits.reduce((total, audit) => total + audit.missingPermissions.length, 0);
  };

  const currentAudit = audits.find(audit => audit.service === selectedService) || audits[0];

  if (!currentAudit) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No Permission Audits Available
          </h3>
          <p className="text-muted-foreground mb-4">
            Connect your CRM services to begin permission auditing.
          </p>
          {onRefreshAudit && (
            <Button onClick={onRefreshAudit}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Initial Audit
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Permission Audit Report
          </CardTitle>
          <div className="flex items-center gap-2">
            {onDownloadReport && (
              <Button variant="outline" size="sm" onClick={onDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            )}
            {onRefreshAudit && (
              <Button variant="outline" size="sm" onClick={onRefreshAudit}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`${getRiskLevelColor(getOverallRiskLevel()).bg} ${getRiskLevelColor(getOverallRiskLevel()).border} border`}>
              <CardContent className="p-4 text-center">
                <Shield className={`h-8 w-8 mx-auto mb-2 ${getRiskLevelColor(getOverallRiskLevel()).text}`} />
                <p className={`text-2xl font-bold ${getRiskLevelColor(getOverallRiskLevel()).text}`}>
                  {getOverallRiskLevel().toUpperCase()}
                </p>
                <p className="text-sm text-muted-foreground">Overall Risk Level</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-4 text-center">
                <Unlock className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-700">
                  {getTotalExcessivePermissions()}
                </p>
                <p className="text-sm text-red-600">Excessive Permissions</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4 text-center">
                <Lock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-700">
                  {getTotalMissingPermissions()}
                </p>
                <p className="text-sm text-amber-600">Missing Permissions</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Audit */}
      <Card>
        <CardHeader>
          <CardTitle>Service-Specific Audits</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedService} onValueChange={setSelectedService}>
            <TabsList className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full">
              {audits.map((audit) => (
                <TabsTrigger 
                  key={audit.service} 
                  value={audit.service}
                  className="flex items-center gap-2"
                >
                  {audit.service}
                  <Badge variant={getRiskLevelColor(audit.riskLevel).badge} className="text-xs">
                    {audit.riskLevel}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {audits.map((audit) => (
              <TabsContent key={audit.service} value={audit.service} className="space-y-6">
                {/* Risk Alert */}
                {audit.riskLevel !== 'low' && (
                  <Alert className={`${getRiskLevelColor(audit.riskLevel).border} ${getRiskLevelColor(audit.riskLevel).bg}`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className={getRiskLevelColor(audit.riskLevel).text}>
                      <strong>{audit.riskLevel.toUpperCase()} RISK DETECTED:</strong> This service has{' '}
                      {audit.excessivePermissions.length > 0 && `${audit.excessivePermissions.length} excessive permissions`}
                      {audit.excessivePermissions.length > 0 && audit.missingPermissions.length > 0 && ' and '}
                      {audit.missingPermissions.length > 0 && `${audit.missingPermissions.length} missing permissions`}.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Permission Breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Required vs Granted */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        Permission Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-emerald-700 mb-2">Required Permissions ({audit.requiredPermissions.length})</h4>
                        <div className="space-y-1">
                          {audit.requiredPermissions.map((permission, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-emerald-500" />
                              <code className="bg-muted px-1 rounded text-xs">{permission}</code>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-700 mb-2">Granted Permissions ({audit.grantedPermissions.length})</h4>
                        <div className="space-y-1">
                          {audit.grantedPermissions.slice(0, 5).map((permission, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Info className="h-3 w-3 text-blue-500" />
                              <code className="bg-muted px-1 rounded text-xs">{permission}</code>
                            </div>
                          ))}
                          {audit.grantedPermissions.length > 5 && (
                            <p className="text-xs text-muted-foreground">
                              +{audit.grantedPermissions.length - 5} more permissions
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Issues */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        Permission Issues
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {audit.excessivePermissions.length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-700 mb-2">
                            Excessive Permissions ({audit.excessivePermissions.length})
                          </h4>
                          <div className="space-y-1">
                            {audit.excessivePermissions.map((permission, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <XCircle className="h-3 w-3 text-red-500" />
                                <code className="bg-red-50 text-red-800 px-1 rounded text-xs">{permission}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {audit.missingPermissions.length > 0 && (
                        <div>
                          <h4 className="font-medium text-amber-700 mb-2">
                            Missing Permissions ({audit.missingPermissions.length})
                          </h4>
                          <div className="space-y-1">
                            {audit.missingPermissions.map((permission, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                                <code className="bg-amber-50 text-amber-800 px-1 rounded text-xs">{permission}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {audit.excessivePermissions.length === 0 && audit.missingPermissions.length === 0 && (
                        <div className="text-center py-4">
                          <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                          <p className="text-emerald-700 font-medium">Perfect Permission Alignment</p>
                          <p className="text-sm text-muted-foreground">All permissions are properly configured.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                {audit.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        Security Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {audit.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-sm">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionAuditPanel;