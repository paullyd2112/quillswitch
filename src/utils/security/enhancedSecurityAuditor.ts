
import { supabase } from '@/integrations/supabase/client';
import type { SecurityIssue, SecurityRecommendation } from './types';

export class EnhancedSecurityAuditor {
  /**
   * Perform enhanced localStorage security audit that distinguishes between
   * legitimate auth tokens and actual security risks
   */
  public async auditLocalStorageSecurityEnhanced(): Promise<{
    issues: SecurityIssue[];
    recommendations: SecurityRecommendation[];
  }> {
    const issues: SecurityIssue[] = [];
    const recommendations: SecurityRecommendation[] = [];

    try {
      // Get all localStorage keys
      const localStorageKeys = Object.keys(localStorage);
      
      // Define patterns for legitimate vs suspicious data
      const legitimatePatterns = [
        /^sb-\w+-auth-token$/, // Supabase auth tokens
        /^supabase\.auth\.token$/, // Legacy Supabase auth
        /^quill-theme-mode$/, // Theme preferences
        /^user-preferences$/, // User settings
        /^app-settings$/, // Application settings
        /^onboarding-completed$/, // Onboarding state
        /^tour-completed$/, // Product tour state
      ];

      const suspiciousPatterns = [
        /api[_-]?key/i,
        /secret/i,
        /password/i,
        /credential/i,
        /token(?!.*auth)/i, // Tokens that aren't auth tokens
        /private[_-]?key/i,
        /access[_-]?key/i,
        /service[_-]?account/i,
      ];

      // Analyze each localStorage item
      for (const key of localStorageKeys) {
        const value = localStorage.getItem(key);
        if (!value) continue;

        // Skip legitimate auth and settings data
        const isLegitimate = legitimatePatterns.some(pattern => pattern.test(key));
        if (isLegitimate) continue;

        // Check for suspicious patterns
        const isSuspicious = suspiciousPatterns.some(pattern => 
          pattern.test(key) || pattern.test(value)
        );

        if (isSuspicious) {
          // Check if it's demo data that should be cleaned up
          const isDemoData = key.includes('demo') || key.includes('test') || 
                           value.includes('demo') || value.includes('test');

          if (isDemoData) {
            issues.push({
              id: `demo-data-in-localstorage-${key}`,
              severity: 'medium' as const,
              category: 'Data Security',
              title: 'Demo Data in Local Storage',
              description: `Found demo/test data "${key}" in localStorage that should be cleaned up`,
              remediation: 'Remove demo data from localStorage and use secure server-side storage',
              affectedResources: [key]
            });
          } else {
            issues.push({
              id: `sensitive-data-in-localstorage-${key}`,
              severity: 'high' as const,
              category: 'Data Security',
              title: 'Sensitive Data in Local Storage',
              description: `Found potentially sensitive data "${key}" in localStorage`,
              remediation: 'Move sensitive data to secure server-side storage with proper encryption',
              affectedResources: [key]
            });
          }
        }

        // Check for large data that might contain sensitive information
        if (value.length > 10000) {
          issues.push({
            id: `large-data-in-localstorage-${key}`,
            severity: 'low' as const,
            category: 'Data Security',
            title: 'Large Data in Local Storage',
            description: `Found large data object "${key}" (${value.length} chars) in localStorage`,
            remediation: 'Consider moving large data objects to secure server-side storage',
            affectedResources: [key]
          });
        }
      }

      // Add recommendations for secure credential management
      recommendations.push({
        id: 'implement-secure-credential-storage',
        priority: 'high' as const,
        title: 'Implement Secure Credential Storage',
        description: 'Use server-side encrypted storage for all sensitive credentials and API keys',
        implementation: 'Utilize the credentials vault with pgsodium encryption for secure storage',
        estimatedEffort: '2-4 hours'
      });

      recommendations.push({
        id: 'regular-localstorage-audit',
        priority: 'medium' as const,
        title: 'Regular localStorage Auditing',
        description: 'Implement automated scanning for sensitive data in client-side storage',
        implementation: 'Add periodic checks and cleanup routines for localStorage',
        estimatedEffort: '1-2 hours'
      });

    } catch (error) {
      console.error('Enhanced localStorage audit failed:', error);
    }

    return { issues, recommendations };
  }

  /**
   * Clean up demo and test data from localStorage
   */
  public cleanupDemoData(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Identify demo/test keys to remove
      if (key.includes('demo') || 
          key.includes('test') || 
          key.includes('example') ||
          key.startsWith('secure_api_key') || // Demo API keys
          key.startsWith('temp_')) {
        keysToRemove.push(key);
      }
    }

    // Remove identified keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Cleaned up demo data: ${key}`);
    });

    if (keysToRemove.length > 0) {
      console.log(`Cleaned up ${keysToRemove.length} demo/test items from localStorage`);
    }
  }
}

export const enhancedSecurityAuditor = new EnhancedSecurityAuditor();
