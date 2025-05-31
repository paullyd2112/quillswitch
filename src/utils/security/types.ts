
/**
 * Security Audit Types for QuillSwitch
 */

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

export interface AuditSection {
  issues: SecurityIssue[];
  recommendations: SecurityRecommendation[];
}
