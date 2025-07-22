import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  AlertTriangle, 
  Database, 
  Clock, 
  Shield, 
  Wifi, 
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { MigrationError } from "../automated-mapping/types";

interface ErrorCategoryPanelProps {
  errors: MigrationError[];
  onErrorResolve?: (errorId: string) => void;
}

const ErrorCategoryPanel: React.FC<ErrorCategoryPanelProps> = ({ 
  errors, 
  onErrorResolve 
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getErrorIcon = (type: MigrationError['type']) => {
    switch (type) {
      case 'validation':
        return <Database className="h-4 w-4" />;
      case 'api_limit':
        return <Clock className="h-4 w-4" />;
      case 'permission':
        return <Shield className="h-4 w-4" />;
      case 'network':
        return <Wifi className="h-4 w-4" />;
      case 'timeout':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: MigrationError['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBadgeVariant = (severity: MigrationError['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'outline';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Group errors by type
  const errorGroups = errors.reduce((groups, error) => {
    if (!groups[error.type]) {
      groups[error.type] = [];
    }
    groups[error.type].push(error);
    return groups;
  }, {} as Record<string, MigrationError[]>);

  const getActionableSteps = (error: MigrationError) => {
    const baseSteps = error.suggestedAction ? [error.suggestedAction] : [];
    
    switch (error.type) {
      case 'api_limit':
        return [
          ...baseSteps,
          "Consider upgrading your API plan",
          "Implement rate limiting in migration settings",
          "Contact your CRM administrator"
        ];
      case 'validation':
        return [
          ...baseSteps,
          "Review field mapping configuration",
          "Check required field settings",
          "Validate source data format"
        ];
      case 'permission':
        return [
          ...baseSteps,
          "Review API permissions in your CRM",
          "Contact your system administrator",
          "Run permission audit"
        ];
      case 'network':
        return [
          ...baseSteps,
          "Check your internet connection",
          "Verify firewall settings",
          "Try again in a few minutes"
        ];
      default:
        return baseSteps;
    }
  };

  if (errors.length === 0) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-emerald-800 mb-2">
            No Errors Detected
          </h3>
          <p className="text-emerald-600">
            Your migration is running smoothly without any issues.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          Error Analysis ({errors.length} total)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(errorGroups).map(([errorType, errorList]) => {
          const totalCount = errorList.reduce((sum, error) => sum + error.count, 0);
          const highestSeverity = errorList.reduce((highest, error) => {
            const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
            return severityOrder[error.severity] > severityOrder[highest.severity] 
              ? error 
              : highest;
          });
          
          return (
            <Collapsible 
              key={errorType}
              open={expandedCategories.has(errorType)}
              onOpenChange={() => toggleCategory(errorType)}
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-3 h-auto border border-border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {getErrorIcon(errorType as MigrationError['type'])}
                    <div className="text-left">
                      <p className="font-medium capitalize">
                        {errorType.replace('_', ' ')} Errors
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {totalCount} occurrences across {errorList.length} error{errorList.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityBadgeVariant(highestSeverity.severity)}>
                      {highestSeverity.severity}
                    </Badge>
                    {expandedCategories.has(errorType) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-3 mt-3">
                {errorList.map((error) => (
                  <div 
                    key={error.id} 
                    className={`p-4 rounded-lg border ${getSeverityColor(error.severity)}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{error.message}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Count: {error.count}</span>
                          {error.recordId && <span>Record: {error.recordId}</span>}
                          {error.fieldName && <span>Field: {error.fieldName}</span>}
                        </div>
                      </div>
                      <Badge variant={getSeverityBadgeVariant(error.severity)}>
                        {error.severity}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Suggested Actions:</h5>
                      <ul className="text-sm space-y-1">
                        {getActionableSteps(error).map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-current/20">
                      <div className="text-xs text-muted-foreground">
                        First: {new Date(error.firstOccurred).toLocaleString()} | 
                        Last: {new Date(error.lastOccurred).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        {onErrorResolve && (
                          <Button 
                            size="sm" 
                            variant="default" 
                            className="text-xs"
                            onClick={() => onErrorResolve(error.id)}
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ErrorCategoryPanel;