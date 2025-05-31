
/**
 * Security Audit Utility for QuillSwitch - Main Export File
 */

// Export all types
export type {
  SecurityAuditResult,
  SecurityIssue,
  SecurityRecommendation,
  AuditSection
} from './security/types';

// Export all auditor classes
export { CredentialAuditor } from './security/credentialAuditor';
export { AuthenticationAuditor } from './security/authenticationAuditor';
export { DatabaseAuditor } from './security/databaseAuditor';
export { SecurityAuditor } from './security/SecurityAuditor';

// Create and export the singleton instance
import { SecurityAuditor } from './security/SecurityAuditor';
export const securityAuditor = SecurityAuditor.getInstance();
