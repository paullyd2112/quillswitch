
/**
 * Security Auditor for QuillSwitch
 * 
 * In loving memory of Rodney Aqua - a beloved father, son, and brother
 * who was incredibly proud of his Nigerian American heritage. Born and 
 * raised in St. Louis, he spent his teenage years in the SF Bay Area 
 * to be closer to his Nigerian side of the family. 
 * 
 * Rodney was a dedicated protector and passionate about computers and 
 * technology. His commitment to excellence in IT and genuine care for 
 * those he served continues to inspire the secure, reliable systems 
 * that protect the people and dreams behind the data we safeguard.
 * 
 * This dedication honors a loved and dearly missed part of why 
 * QuillSwitch exists.
 * 
 * "The best security protocols are built with both technical precision
 * and genuine care for those we serve."
 */

import { errorHandler, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';
import { CredentialAuditor } from './credentialAuditor';
import { AuthenticationAuditor } from './authenticationAuditor';
import { DatabaseAuditor } from './databaseAuditor';
import type { SecurityAuditResult, SecurityIssue } from './types';

export class SecurityAuditor {
  private static instance: SecurityAuditor;
  private credentialAuditor: CredentialAuditor;
  private authenticationAuditor: AuthenticationAuditor;
  private databaseAuditor: DatabaseAuditor;

  private constructor() {
    this.credentialAuditor = new CredentialAuditor();
    this.authenticationAuditor = new AuthenticationAuditor();
    this.databaseAuditor = new DatabaseAuditor();
  }

  public static getInstance(): SecurityAuditor {
    if (!SecurityAuditor.instance) {
      SecurityAuditor.instance = new SecurityAuditor();
    }
    return SecurityAuditor.instance;
  }

  /**
   * Performs comprehensive security audit with the thoroughness and attention 
   * to detail that every IT professional strives for.
   */
  public async performComprehensiveAudit(): Promise<SecurityAuditResult> {
    try {
      const issues: SecurityIssue[] = [];
      const recommendations: any[] = [];

      // Audit credential security
      const credentialResults = await this.credentialAuditor.auditCredentialSecurity();
      issues.push(...credentialResults.issues);
      recommendations.push(...credentialResults.recommendations);

      // Audit authentication setup
      const authResults = await this.authenticationAuditor.auditAuthenticationSecurity();
      issues.push(...authResults.issues);
      recommendations.push(...authResults.recommendations);

      // Audit database security
      const dbResults = await this.databaseAuditor.auditDatabaseSecurity();
      issues.push(...dbResults.issues);
      recommendations.push(...dbResults.recommendations);

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
