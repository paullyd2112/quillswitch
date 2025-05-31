
import { supabase } from '@/integrations/supabase/client';
import type { AuditSection, SecurityIssue, SecurityRecommendation } from './types';

export class CredentialAuditor {
  public async auditCredentialSecurity(): Promise<AuditSection> {
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
}
