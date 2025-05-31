
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  RefreshCw,
  FileText,
  Lock,
  Database,
  Globe,
  Code,
  Users
} from 'lucide-react';
import { securityAuditor, SecurityAuditResult } from '@/utils/securityAudit';
import { checkSecurityHeaders, isConnectionSecure } from '@/utils/encryptionUtils';
import { toast } from 'sonner';

const ComprehensiveSecurityAudit = () => {
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAuditTime, setLastAuditTime] = useState<Date | null>(null);

  const performFullAudit = async () => {
    setIsLoading(true);
    try {
      console.log('Starting comprehensive security audit...');
      
      // Perform the main security audit
      const result = await securityAuditor.performComprehensiveAudit();
      
      // Add additional security checks
      const additionalChecks = await performAdditionalSecurityChecks();
      
      // Merge results
      const enhancedResult = {
        ...result,
        issues: [...result.issues, ...additionalChecks.issues],
        recommendations: [...result.recommendations, ...additionalChecks.recommendations]
      };
      
      // Recalculate score with additional checks
      enhancedResult.score = calculateEnhancedSecurityScore(enhancedResult.issues);
      enhancedResult.compliant = enhancedResult.score >= 85;
      
      setAuditResult(enhancedResult);
      setLastAuditTime(new Date());
      
      console.log('Security audit completed:', enhancedResult);
      toast.success('Security audit completed successfully');
    } catch (error) {
      console.error('Security audit failed:', error);
      toast.error('Failed to complete security audit');
    } finally {
      setIsLoading(false);
    }
  };

  const performAdditionalSecurityChecks = async () => {
    const issues: any[] = [];
    const recommendations: any[] = [];

    // Check connection security
    if (!isConnectionSecure()) {
      issues.push({
        id: 'insecure-connection',
        severity: 'critical' as const,
        category: 'Connection Security',
        title: 'Insecure Connection',
        description: 'Application is not served over HTTPS',
        remediation: 'Enable HTTPS/TLS encryption for all connections'
      });
    }

    // Check security headers
    const headerCheck = await checkSecurityHeaders();
    if (headerCheck.score < 80) {
      issues.push({
        id: 'missing-security-headers',
        severity: 'medium' as const,
        category: 'Web Security',
        title: 'Missing Security Headers',
        description: 'Important security headers are not configured',
        remediation: 'Configure Content Security Policy, HSTS, and X-Frame-Options headers'
      });
    }

    // Check for sensitive data in localStorage
    const sensitiveKeys = ['password', 'token', 'api_key', 'secret'];
    const localStorageKeys = Object.keys(localStorage);
    const exposedSensitiveData = localStorageKeys.filter(key => 
      sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))
    );

    if (exposedSensitiveData.length > 0) {
      issues.push({
        id: 'sensitive-data-in-localstorage',
        severity: 'high' as const,
        category: 'Data Security',
        title: 'Sensitive Data in Local Storage',
        description: `Found ${exposedSensitiveData.length} potentially sensitive items in localStorage`,
        remediation: 'Move sensitive data to secure server-side storage or use proper encryption',
        affectedResources: exposedSensitiveData
      });
    }

    // Check for console logs in production
    if (process.env.NODE_ENV === 'production') {
      // This would need to be checked during build time
      recommendations.push({
        id: 'remove-console-logs',
        priority: 'medium' as const,
        title: 'Remove Console Logs in Production',
        description: 'Console logs may expose sensitive information in production',
        implementation: 'Use build tools to remove console.log statements in production builds',
        estimatedEffort: '1 hour'
      });
    }

    // Check for proper error handling
    recommendations.push({
      id: 'error-handling-review',
      priority: 'high' as const,
      title: 'Review Error Handling',
      description: 'Ensure errors don\'t expose sensitive information to users',
      implementation: 'Implement proper error sanitization and logging',
      estimatedEffort: '2-4 hours'
    });

    // Check authentication implementation
    recommendations.push({
      id: 'auth-security-review',
      priority: 'high' as const,
      title: 'Authentication Security Review',
      description: 'Review authentication flows for security best practices',
      implementation: 'Implement session timeouts, secure password policies, and rate limiting',
      estimatedEffort: '4-6 hours'
    });

    return { issues, recommendations };
  };

  const calculateEnhancedSecurityScore = (issues: any[]): number => {
    let score = 100;

    for (const issue of issues) {
      switch (issue.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 8;
          break;
        case 'low':
          score -= 3;
          break;
      }
    }

    return Math.max(0, score);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'Excellent - Your security posture is very strong';
    if (score >= 70) return 'Good - Some improvements recommended';
    if (score >= 50) return 'Fair - Several security issues need attention';
    return 'Poor - Critical security issues require immediate action';
  };

  useEffect(() => {
    performFullAudit();
  }, []);

  if (isLoading && !auditResult) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Performing comprehensive security audit...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!auditResult) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg font-medium">Unable to complete security audit</p>
            <Button onClick={performFullAudit} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const criticalIssues = auditResult.issues.filter(i => i.severity === 'critical');
  const highIssues = auditResult.issues.filter(i => i.severity === 'high');
  const mediumIssues = auditResult.issues.filter(i => i.severity === 'medium');
  const lowIssues = auditResult.issues.filter(i => i.severity === 'low');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comprehensive Security Audit</h2>
          <p className="text-muted-foreground">
            Complete security assessment of your QuillSwitch application
          </p>
        </div>
        <Button onClick={performFullAudit} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Re-run Audit
        </Button>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Security Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-4xl font-bold ${getScoreColor(auditResult.score)}`}>
                  {auditResult.score}/100
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {getScoreDescription(auditResult.score)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  {auditResult.compliant ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {auditResult.compliant ? 'Compliant' : 'Non-compliant'}
                  </span>
                </div>
                {lastAuditTime && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last audit: {lastAuditTime.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <Progress value={auditResult.score} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Issue Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{criticalIssues.length}</div>
            <div className="text-sm text-muted-foreground">Critical Issues</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{highIssues.length}</div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Info className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{mediumIssues.length}</div>
            <div className="text-sm text-muted-foreground">Medium Priority</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{lowIssues.length}</div>
            <div className="text-sm text-muted-foreground">Low Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="issues">Security Issues</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Issues Found</CardTitle>
              <CardDescription>
                {auditResult.issues.length} total issues requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {auditResult.issues.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">No security issues detected!</p>
                    <p className="text-muted-foreground">Your application follows security best practices.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {auditResult.issues.map((issue) => (
                      <Alert key={issue.id} className="border-l-4 border-l-current">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getSeverityColor(issue.severity)}>
                                {issue.severity.toUpperCase()}
                              </Badge>
                              <span className="font-medium">{issue.title}</span>
                            </div>
                            <AlertDescription className="mb-2">
                              {issue.description}
                            </AlertDescription>
                            <div className="text-sm">
                              <strong>Category:</strong> {issue.category}
                            </div>
                            <div className="text-sm">
                              <strong>Fix:</strong> {issue.remediation}
                            </div>
                            {issue.affectedResources && (
                              <div className="text-sm mt-1">
                                <strong>Affected:</strong> {issue.affectedResources.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>
                {auditResult.recommendations.length} recommendations to improve security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {auditResult.recommendations.map((rec) => (
                    <Card key={rec.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority.toUpperCase()} PRIORITY
                          </Badge>
                          <span className="font-medium">{rec.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rec.description}
                        </p>
                        <div className="text-sm">
                          <strong>Implementation:</strong> {rec.implementation}
                        </div>
                        <div className="text-sm">
                          <strong>Estimated Effort:</strong> {rec.estimatedEffort}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(
              auditResult.issues.reduce((acc, issue) => {
                acc[issue.category] = (acc[issue.category] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([category, count]) => (
              <Card key={category}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4" />
                    <span className="font-medium">{category}</span>
                  </div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">
                    {count === 1 ? 'issue' : 'issues'} found
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveSecurityAudit;
