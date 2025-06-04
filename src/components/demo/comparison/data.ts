
import { ComparisonFeature } from "./types";

export const features: ComparisonFeature[] = [
  // Migration Experience
  {
    id: "user-friendly",
    name: "User-Friendly Interface",
    description: "Can be operated by non-technical users without specialized training",
    category: "experience",
    quillswitch: true,
    manual: false,
    consultants: "Limited"
  },
  {
    id: "guided-flow",
    name: "Guided Migration Flow",
    description: "Step-by-step process with clear instructions at each stage",
    category: "experience",
    quillswitch: true,
    manual: false,
    consultants: true
  },
  {
    id: "time-to-completion",
    name: "Time to Completion",
    description: "Total time required from start to finish",
    category: "experience",
    quillswitch: "Hours to Days",
    manual: "Weeks to Months",
    consultants: "Weeks"
  },
  
  // Technical Features
  {
    id: "ai-mapping",
    name: "AI-Powered Field Mapping",
    description: "Automatic prediction of field mapping between CRMs",
    category: "technical",
    quillswitch: true,
    manual: false,
    consultants: false
  },
  {
    id: "data-cleaning",
    name: "Data Cleansing & Enrichment",
    description: "Identify and fix data quality issues during migration",
    category: "technical",
    quillswitch: true,
    manual: "Limited",
    consultants: "Limited"
  },
  {
    id: "test-migration",
    name: "Test Migration & Validation",
    description: "Run test migrations to validate configuration",
    category: "technical",
    quillswitch: true,
    manual: "Limited",
    consultants: true
  },
  {
    id: "incremental",
    name: "Incremental Migration",
    description: "Migrate data in phases with delta syncing",
    category: "technical",
    quillswitch: true,
    manual: false,
    consultants: "Limited"
  },
  {
    id: "custom-objects",
    name: "Custom Object Support",
    description: "Support for migrating custom CRM objects and fields",
    category: "technical",
    quillswitch: true,
    manual: "Limited",
    consultants: true
  },
  
  // Security & Reliability
  {
    id: "oauth",
    name: "OAuth Security",
    description: "Secure API access without storing credentials",
    category: "security",
    quillswitch: true,
    manual: false,
    consultants: "Varies"
  },
  {
    id: "encryption",
    name: "End-to-End Encryption",
    description: "Data encrypted during transfer and processing",
    category: "security",
    quillswitch: true,
    manual: false,
    consultants: "Varies"
  },
  {
    id: "error-recovery",
    name: "Automatic Error Recovery",
    description: "System handles errors and retries without manual intervention",
    category: "security",
    quillswitch: true,
    manual: false,
    consultants: "Limited"
  },
  {
    id: "audit-logs",
    name: "Comprehensive Audit Logs",
    description: "Detailed tracking of all migration actions",
    category: "security",
    quillswitch: true,
    manual: false,
    consultants: "Limited"
  },
  
  // Business Impact
  {
    id: "downtime",
    name: "Business Disruption",
    description: "Impact on normal business operations during migration",
    category: "impact",
    quillswitch: "Minimal",
    manual: "Significant",
    consultants: "Moderate"
  },
  {
    id: "reconnect",
    name: "Integration Reconnection",
    description: "Support for reconnecting integrations post-migration",
    category: "impact",
    quillswitch: true,
    manual: false,
    consultants: "Limited"
  },
  {
    id: "cost",
    name: "Total Cost",
    description: "Overall financial investment required",
    category: "impact",
    quillswitch: "Predictable",
    manual: "Low Direct / High Indirect",
    consultants: "High"
  },
  {
    id: "predictability",
    name: "Outcome Predictability",
    description: "Confidence in migration success and timeline",
    category: "impact",
    quillswitch: "High",
    manual: "Low",
    consultants: "Moderate"
  }
];
