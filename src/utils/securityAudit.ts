import { supabase } from '@/integrations/supabase/client';
import { errorHandler, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';

export interface SecurityAuditResult {
  score: number;
  issues: SecurityIssue[];
  recommendations: SecurityRecommendation[];
  compliant: boolean;
}

export interface SecurityIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  remediation: string;
  affectedResources?: string[];
}

export interface SecurityRecommendation {
  id: string;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  implementation: string;
  estimatedEffort: string;
}

export class SecurityAuditor {
  private static instance: SecurityAuditor;

  public static getInstance(): SecurityAuditor {
    if (!SecurityAuditor.instance) {
      SecurityAuditor.instance = new SecurityAuditor();
    }
    return SecurityAuditor.instance;
  }

  public async performComprehensiveAudit(): Promise<SecurityAuditResult> {
    try {
      const issues: SecurityIssue[] = [];
      const recommendations: SecurityRecommendation[] = [];

      // Audit credential security
      const credentialIssues = await this.auditCredentialSecurity();
      issues.push(...credentialIssues.issues);
      recommendations.push(...credentialIssues.recommendations);

      // Audit authentication setup
      const authIssues = await this.auditAuthenticationSecurity();
      issues.push(...authIssues.issues);
      recommendations.push(...authIssues.recommendations);

      // Audit database security
      const dbIssues = await this.auditDatabaseSecurity();
      issues.push(...dbIssues.issues);
      recommendations.push(...dbIssues.recommendations);

      // Calculate security score
      const score = this.calculateSecurityScore(issues);
      const compliant = score >= 85;

      return {
        score,
        issues,
        recommendations,
        compliant
      };
    } catch (error) {
      console.error('Security audit failed:', error);
      throw errorHandler.createError(
        ERROR_CODES.UNEXPECTED_ERROR,
        'Failed to complete security audit',
        { error }
      );
    }
  }

  private async auditCredentialSecurity(): Promise<{
    issues: SecurityIssue[];
    recommendations: SecurityRecommendation[];
  }> {
    const issues: SecurityIssue[] = [];
    const recommendations: SecurityRecommendation[] = [];

    try {
      // Check for expired credentials
      const { data: expiredCredentials, error } = await supabase
        .from('service_credentials')
        .select('id, service_name, credential_name, expires_at')
        .lt('expires_at', new Date().toISOString());

      if (error) throw error;

      if (expiredCredentials && expiredCredentials.length > 0) {
        issues.push({
          id: 'expired-credentials',
          severity: 'high',
          category: 'Credential Management',
          title: 'Expired Credentials Detected',
          description: `Found ${expiredCredentials.length} expired credentials that should be renewed immediately.`,
          remediation: 'Navigate to the Credentials Vault and update or remove expired credentials.',
          affectedResources: expiredCredentials.map(c => `${c.service_name}:${c.credential_name}`)
        });
      }

      // Check for credentials without expiry dates
      const { data: noExpiryCredentials, error: noExpiryError } = await supabase
        .from('service_credentials')
        .select('id, service_name, credential_name')
        .is('expires_at', null);

      if (noExpiryError) throw noExpiryError;

      if (noExpiryCredentials && noExpiryCredentials.length > 5) {
        issues.push({
          id: 'missing-expiry-dates',
          severity: 'medium',
          category: 'Credential Management',
          title: 'Credentials Missing Expiry Dates',
          description: `${noExpiryCredentials.length} credentials don't have expiry dates set.`,
          remediation: 'Set appropriate expiry dates for all credentials to ensure regular rotation.',
          affectedResources: noExpiryCredentials.map(c => `${c.service_name}:${c.credential_name}`)
        });
      }

      // Add recommendations
      recommendations.push({
        id: 'regular-rotation',
        priority: 'high',
        title: 'Implement Regular Credential Rotation',
        description: 'Establish a schedule for rotating all API keys and credentials.',
        implementation: 'Set calendar reminders and use the credential vault\'s expiry tracking.',
        estimatedEffort: '2-4 hours initial setup'
      });

      recommendations.push({
        id: 'credential-monitoring',
        priority: 'medium',
        title: 'Enable Credential Access Monitoring',
        description: 'Monitor and alert on unusual credential access patterns.',
        implementation: 'Review access logs regularly and set up automated monitoring.',
        estimatedEffort: '1-2 hours setup'
      });

    } catch (error) {
      console.error('Credential security audit failed:', error);
    }

    return { issues, recommendations };
  }

  private async auditAuthenticationSecurity(): Promise<{
    issues: SecurityIssue[];
    recommendations: SecurityRecommendation[];
  }> {
    const issues: SecurityIssue[] = [];
    const recommendations: SecurityRecommendation[] = [];

    // Check if HTTPS is being used
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      issues.push({
        id: 'insecure-connection',
        severity: 'critical',
        category: 'Connection Security',
        title: 'Insecure HTTP Connection',
        description: 'The application is not using HTTPS, which exposes data to interception.',
        remediation: 'Configure HTTPS/TLS encryption for all connections.'
      });
    }

    // Check for session security
    const hasSecureSession = document.cookie.includes('Secure') || 
                           window.location.protocol === 'https:';
    
    if (!hasSecureSession && window.location.hostname !== 'localhost') {
      issues.push({
        id: 'insecure-sessions',
        severity: 'medium',
        category: 'Session Security',
        title: 'Insecure Session Configuration',
        description: 'Session cookies may not be properly secured.',
        remediation: 'Configure secure session cookies with appropriate flags.'
      });
    }

    recommendations.push({
      id: 'two-factor-auth',
      priority: 'high',
      title: 'Implement Two-Factor Authentication',
      description: 'Add an additional layer of security to user accounts.',
      implementation: 'Configure 2FA through the authentication settings.',
      estimatedEffort: '1-2 hours setup'
    });

    return { issues, recommendations };
  }

  private async auditDatabaseSecurity(): Promise<{
    issues: SecurityIssue[];
    recommendations: SecurityRecommendation[];
  }> {
    const issues: SecurityIssue[] = [];
    const recommendations: SecurityRecommendation[] = [];

    // Note: In a real implementation, you would check RLS policies,
    // but since we can't directly query pg_policies from the client,
    // we'll add general recommendations

    recommendations.push({
      id: 'rls-monitoring',
      priority: 'medium',
      title: 'Monitor Row Level Security Policies',
      description: 'Regularly review and test RLS policies to ensure they\'re working correctly.',
      implementation: 'Set up automated tests for RLS policy effectiveness.',
      estimatedEffort: '2-3 hours setup'
    });

    recommendations.push({
      id: 'audit-logging',
      priority: 'medium',
      title: 'Enhance Database Audit Logging',
      description: 'Implement comprehensive logging for all database operations.',
      implementation: 'Configure database-level audit logs and monitoring.',
      estimatedEffort: '1-2 hours setup'
    });

    return { issues, recommendations };
  }

  private calculateSecurityScore(issues: SecurityIssue[]): number {
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
  }
}

export const securityAuditor = SecurityAuditor.getInstance();
