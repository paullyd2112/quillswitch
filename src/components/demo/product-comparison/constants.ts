
import { ComparisonFeature } from "./types";

export const features: ComparisonFeature[] = [
  // Migration Experience
  {
    id: "user-friendly",
    name: "User-Friendly Interface",
    description: "Intuitive, guided interface operable by non-technical users without specialized training.",
    category: "experience",
    quillswitch: "✅ Intuitive & Guided",
    manual: "❌ Complex & Error-Prone",
    consultants: "Limited (Tool-Dependent)"
  },
  {
    id: "guided-flow",
    name: "Guided Migration Flow",
    description: "Step-by-step process with clear instructions at each stage to ensure a smooth migration.",
    category: "experience",
    quillswitch: "✅ Step-by-Step Guidance",
    manual: "❌ No Guidance / Ad-Hoc",
    consultants: "✅ Expert-Led"
  },
  {
    id: "time-to-completion",
    name: "Time to Completion",
    description: "Total time required from start to finish for the migration project.",
    category: "experience",
    quillswitch: "Hours to Days",
    manual: "Weeks to Months (High Risk)",
    consultants: "Weeks (Can Vary)"
  },
  
  // Data Security & Integrity
  {
    id: "data-encryption",
    name: "Data Encryption",
    description: "End-to-end encryption for data both in-transit and at-rest, using industry standards like AES-256.",
    category: "security",
    quillswitch: "✅ End-to-End Encryption",
    manual: "❌ User-Dependent",
    consultants: "Varies by Provider"
  },
  {
    id: "compliance-ready",
    name: "Compliance Ready",
    description: "Built to be compliant with regulations like GDPR & CCPA, with available SOC 2 certification.",
    category: "security",
    quillswitch: "✅ SOC 2, GDPR/CCPA Ready",
    manual: "❌ User's Responsibility",
    consultants: "Varies by Consultant"
  },
  {
    id: "access-control",
    name: "Secure Access & Audit Trails",
    description: "Granular control over who can access data, with detailed and immutable logs of all actions.",
    category: "security",
    quillswitch: "✅ Granular Control & Logs",
    manual: "❌ Manual & Limited",
    consultants: "Limited to Tools Used"
  },
  
  // Technical Features
  {
    id: "ai-mapping",
    name: "AI-Powered Field Mapping",
    description: "Intelligent, AI-driven mapping dramatically reduces manual configuration and human error.",
    category: "technical",
    quillswitch: "✅ Intelligent AI-Driven",
    manual: "❌ Fully Manual",
    consultants: "Manual/Expert-Driven"
  },
  {
    id: "data-cleaning",
    name: "Data Cleansing & Enrichment",
    description: "Automated data quality checks to identify and fix issues, ensuring data integrity.",
    category: "technical",
    quillswitch: "✅ Automated Quality Checks",
    manual: "Manual & Tedious",
    consultants: "Add-on Service"
  },
  {
    id: "test-migration",
    name: "Test Migration & Validation",
    description: "Conduct unlimited pre-migration tests to validate configuration and ensure a predictable outcome.",
    category: "technical",
    quillswitch: "✅ Pre-Migration Testing",
    manual: "Limited & Risky",
    consultants: "✅ Thorough Testing"
  },

  // Cost-Effectiveness & Value
  {
    id: "predictable-pricing",
    name: "Predictable Pricing",
    description: "Transparent, upfront pricing with no hidden fees or escalating costs.",
    category: "cost",
    quillswitch: "✅ Transparent & Upfront",
    manual: "❌ Hidden Costs (Time, Errors)",
    consultants: "Project-Based (Can Escalate)"
  },
  {
    id: "reduced-manual-effort",
    name: "Reduced Manual Effort",
    description: "Automation drastically reduces the time and internal resources required from your team.",
    category: "cost",
    quillswitch: "✅ Significant Time Savings",
    manual: "❌ High Manual Labor",
    consultants: "Requires Client Oversight"
  },
  {
    id: "ongoing-support",
    name: "Ongoing Support",
    description: "Access to dedicated technical support throughout the entire migration process.",
    category: "cost",
    quillswitch: "✅ Dedicated Support Included",
    manual: "❌ Self-Service Only",
    consultants: "Post-Project Retainer"
  }
];

export const categoryTitles = {
  experience: "Migration Experience",
  security: "Data Security & Integrity",
  technical: "Technical Features",
  cost: "Cost-Effectiveness & Value"
} as const;
