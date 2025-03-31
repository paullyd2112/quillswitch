
export interface ArticleType {
  id: string;
  title: string;
  content?: string;
}

export interface SubcategoryType {
  id: string;
  title: string;
  articles: ArticleType[];
}

export interface CategoryType {
  id: string;
  title: string;
  icon?: string;
  description?: string;
  subcategories: SubcategoryType[];
}

export const knowledgeBaseData: CategoryType[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn how to set up your account and start your first migration project.",
    subcategories: [
      {
        id: "account-setup",
        title: "Account Setup and Onboarding",
        articles: [
          { id: "create-account", title: "Creating your QuillSwitch account" },
          { id: "navigate-platform", title: "Navigating the platform interface" },
          { id: "understand-dashboard", title: "Understanding the dashboard and core features" },
          { id: "setup-first-migration", title: "Setting up your first migration project" },
          { id: "setup-wizard", title: "Using the setup wizard" }
        ]
      },
      {
        id: "connecting-crm",
        title: "Connecting to CRM Systems",
        articles: [
          { id: "connect-salesforce", title: "Connecting to Salesforce" },
          { id: "connect-hubspot", title: "Connecting to HubSpot" },
          { id: "connect-dynamics", title: "Connecting to Microsoft Dynamics 365" },
          { id: "connect-other-crm", title: "Connecting to other supported CRMs" },
          { id: "api-auth", title: "API authentication and authorization" },
          { id: "troubleshoot-connection", title: "Troubleshooting CRM connection issues" }
        ]
      },
      {
        id: "data-structures",
        title: "Understanding Data Structures",
        articles: [
          { id: "intro-crm-data", title: "Introduction to CRM data structures" },
          { id: "mapping-fields", title: "Mapping data fields between different CRMs" },
          { id: "custom-objects", title: "Understanding custom objects and fields" },
          { id: "data-conversions", title: "Data type conversions and compatibility" }
        ]
      }
    ]
  },
  {
    id: "migration-concepts",
    title: "Migration Concepts",
    description: "Learn about best practices and concepts for successful CRM migrations.",
    subcategories: [
      {
        id: "best-practices",
        title: "CRM Migration Best Practices",
        articles: [
          { id: "planning-project", title: "Planning your migration project" },
          { id: "data-cleansing", title: "Data cleansing and preparation" },
          { id: "understanding-mapping", title: "Understanding data mapping and transformations" },
          { id: "testing-strategies", title: "Testing and validation strategies" },
          { id: "post-migration", title: "Post-migration checks and optimization" }
        ]
      },
      {
        id: "data-mapping",
        title: "Data Mapping and Transformations",
        articles: [
          { id: "intro-mapping", title: "Introduction to data mapping" },
          { id: "mapping-tools", title: "Using the QuillSwitch data mapping tools" },
          { id: "complex-transformations", title: "Understanding complex data transformations" },
          { id: "custom-rules", title: "Creating custom transformation rules" },
          { id: "normalization", title: "Best practices for data normalization" }
        ]
      },
      {
        id: "integrations",
        title: "Integrations and API Management",
        articles: [
          { id: "intro-api", title: "Introduction to API integrations" },
          { id: "third-party", title: "Connecting to third-party applications" },
          { id: "api-credentials", title: "Managing API keys and credentials" },
          { id: "troubleshoot-api", title: "Troubleshooting API integration issues" },
          { id: "webhooks", title: "Using webhooks" }
        ]
      },
      {
        id: "validation",
        title: "Data Validation and Reconciliation",
        articles: [
          { id: "understanding-validation", title: "Understanding data validation" },
          { id: "validation-tools", title: "Using the QuillSwitch validation tools" },
          { id: "validation-reports", title: "Generating and interpreting validation reports" },
          { id: "reconciliation", title: "Reconciling data between source and target CRMs" },
          { id: "resolve-discrepancies", title: "Resolving data discrepancies" }
        ]
      },
      {
        id: "project-management",
        title: "Project Management for Migrations",
        articles: [
          { id: "create-plan", title: "Creating a migration project plan" },
          { id: "milestones", title: "Setting milestones and timelines" },
          { id: "progress-communication", title: "Managing project progress and communication" },
          { id: "project-features", title: "Using project management features in QuillSwitch" }
        ]
      }
    ]
  },
  {
    id: "platform-guides",
    title: "Platform Guides",
    description: "Detailed guides on how to use QuillSwitch platform features.",
    subcategories: [
      {
        id: "dashboard",
        title: "Using the QuillSwitch Dashboard",
        articles: [
          { id: "dashboard-widgets", title: "Understanding dashboard widgets and metrics" },
          { id: "customize-dashboard", title: "Customizing the dashboard" },
          { id: "monitor-migrations", title: "Monitoring active migrations" },
          { id: "access-reports", title: "Accessing migration reports" }
        ]
      },
      {
        id: "manage-migrations",
        title: "Managing Migrations",
        articles: [
          { id: "create-migration", title: "Creating new migration projects" },
          { id: "edit-migration", title: "Editing and managing migration settings" },
          { id: "control-migrations", title: "Starting, pausing, and resuming migrations" },
          { id: "cancel-migration", title: "Canceling migrations" }
        ]
      },
      {
        id: "mapping-tools",
        title: "Data Mapping and Transformation Tools",
        articles: [
          { id: "mapping-interface", title: "Step-by-step guide to using the data mapping interface" },
          { id: "manage-transformations", title: "Creating and managing data transformations" },
          { id: "templates", title: "Using transformation templates" },
          { id: "preview-data", title: "Previewing transformed data" }
        ]
      },
      {
        id: "validation-tools",
        title: "Validation and Reconciliation Tools",
        articles: [
          { id: "run-validation", title: "Running validation checks" },
          { id: "reconciliation-reports", title: "Generating and interpreting reconciliation reports" },
          { id: "resolve-errors", title: "Resolving validation errors" },
          { id: "manual-validation", title: "Manual validation options" }
        ]
      },
      {
        id: "reporting",
        title: "Reporting and Analytics",
        articles: [
          { id: "summary-reports", title: "Generating migration summary reports" },
          { id: "custom-reports", title: "Creating custom reports" },
          { id: "quality-reports", title: "Interpreting data quality reports" },
          { id: "export-reports", title: "Exporting reports" }
        ]
      },
      {
        id: "api-docs",
        title: "API Documentation",
        articles: [
          { id: "api-endpoints", title: "API endpoints and usage" },
          { id: "api-auth", title: "Authentication and authorization" },
          { id: "code-snippets", title: "API examples and code snippets" },
          { id: "troubleshoot-api", title: "Troubleshooting API issues" }
        ]
      },
      {
        id: "settings",
        title: "Settings and Configurations",
        articles: [
          { id: "user-management", title: "User management and permissions" },
          { id: "account-billing", title: "Account settings and billing" },
          { id: "notifications", title: "Notification settings" },
          { id: "security", title: "Security settings" }
        ]
      }
    ]
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Solutions to common issues and problems.",
    subcategories: [
      {
        id: "migration-errors",
        title: "Common Migration Errors",
        articles: [
          { id: "data-mismatch", title: "Data type mismatch errors" },
          { id: "api-errors", title: "API connection errors" },
          { id: "validation-errors", title: "Data validation errors" },
          { id: "integration-errors", title: "Integration errors" }
        ]
      },
      {
        id: "data-discrepancies",
        title: "Resolving Data Discrepancies",
        articles: [
          { id: "inconsistencies", title: "Identifying and resolving data inconsistencies" },
          { id: "duplicates", title: "Handling duplicate records" },
          { id: "formatting", title: "Correcting data formatting issues" }
        ]
      },
      {
        id: "api-issues",
        title: "Troubleshooting API Issues",
        articles: [
          { id: "auth-errors", title: "API authentication errors" },
          { id: "rate-limiting", title: "API rate limiting issues" },
          { id: "timeouts", title: "API connection timeouts" }
        ]
      },
      {
        id: "performance",
        title: "Platform Performance Issues",
        articles: [
          { id: "slow-speeds", title: "Slow migration speeds" },
          { id: "loading-errors", title: "Platform loading errors" },
          { id: "compatibility", title: "Browser compatibility issues" }
        ]
      }
    ]
  }
];
