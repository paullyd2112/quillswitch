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
          { 
            id: "create-account", 
            title: "Creating your QuillSwitch account",
            content: `
              <h2>Creating your QuillSwitch account</h2>
              <p>To create your QuillSwitch account, begin by navigating to the 'Sign Up' page on our website. You'll be prompted to enter your work email address, create a strong and secure password, and provide basic company information, such as your company name and size. After completing the form, you'll receive an email verification link. Click the link to activate your account. Once verified, you can log in to your QuillSwitch dashboard.</p>
              <p>For optimal security, use a unique password that's at least 12 characters long, including a mix of uppercase and lowercase letters, numbers, and symbols. We also recommend enabling two-factor authentication (2FA) for added protection.</p>
              <h3>Email verification and password setup</h3>
              <p>After registering, you'll receive an email with a verification link. Click this link to confirm your email address and activate your account. During this process, you may be prompted to set up your initial password, if you did not do so during the first step.</p>
              <h3>Setting up your profile</h3>
              <p>Once logged in, navigate to 'Account Settings' to complete your profile. Here, you can add your company logo, contact information, and time zone. Completing your profile ensures accurate communication and support.</p>
            `
          },
          { 
            id: "navigate-platform", 
            title: "Navigating the platform interface",
            content: `
              <h2>Navigating the platform interface</h2>
              <p>The QuillSwitch dashboard is your central hub for managing your CRM migrations. The left-hand navigation menu provides access to key sections, including 'Migrations', 'Data Mapping', 'Validation', 'Reports', and 'Settings'. The main dashboard area displays migration status widgets, performance metrics, and recent activity. Each section is designed for intuitive navigation.</p>
              <p>Key UI elements include: interactive widgets, navigation menu, and a top navigation bar for quick access to support and account settings. Icons are used to represent various actions and information, and tooltips are available when you hover over them. You can customize the dashboard by clicking the 'Customize' button.</p>
              <h3>Overview of the main dashboard and navigation menu</h3>
              <p>The main dashboard provides a quick overview of your migration projects. The left-hand navigation menu allows you to navigate to different areas of the application.</p>
              <h3>Explanation of key UI elements and icons</h3>
              <p>Icons are used to visually represent actions and information. Tooltips appear when you hover over icons, providing additional context. The UI is designed to be intuitive, with clear labels and interactive elements.</p>
              <h3>Customizing the interface</h3>
              <p>You can customize the dashboard by adding, removing, and rearranging widgets. To do this, click the 'Customize' button on the dashboard. You can also adjust display preferences in your account settings.</p>
            `
          },
          { 
            id: "understand-dashboard", 
            title: "Understanding the dashboard and core features",
            content: `
              <h2>Understanding the dashboard and core features</h2>
              <p>The dashboard is designed to provide real-time insights into your migration projects. The 'Active Migrations' widget shows the status of ongoing migrations, while the 'Performance Metrics' widget displays key performance indicators such as data transfer speed and error rates. The 'Alerts' widget notifies you of any critical issues or warnings.</p>
              <p>Core features include: Migration project management, data mapping and transformation tools, data validation and reconciliation tools, reporting and analytics, and API documentation. These tools are designed to streamline the migration process.</p>
              <h3>Explanation of dashboard widgets (migration status, metrics, alerts)</h3>
              <p>Dashboard widgets provide a quick overview of key migration data. The migration status widget displays the current status of each migration. The metrics widget provides data on migration speed, and the alert widget displays any migration errors.</p>
              <h3>Overview of core features (migrations, data mapping, validation, reports)</h3>
              <p>Core features include migrations, data mapping, validation, reports, and API documentation. Each feature is designed to aid in the migration process.</p>
              <h3>Quick access to essential tools</h3>
              <p>The dashboard provides quick access to essential tools via widgets and the navigation menu.</p>
            `
          },
          { 
            id: "setup-first-migration", 
            title: "Setting up your first migration project",
            content: `
              <h2>Setting up your first migration project</h2>
              <p>To create a new migration project, click the 'New Migration' button on the dashboard. You'll be prompted to select your source and target CRM systems. Enter a descriptive project name and provide any relevant project details. Configure your initial migration settings, such as data transfer options and error handling.</p>
              <p>Before starting, plan your migration project thoroughly. Define your data migration goals, scope, and timeline to ensure a smooth process.</p>
              <h3>Creating a new migration project</h3>
              <p>Click the new migration button, and follow the displayed steps.</p>
              <h3>Selecting source and target CRM systems</h3>
              <p>Choose the source and target CRM systems from the drop down menus.</p>
              <h3>Entering project details and settings</h3>
              <p>Enter the project name, and any other relevant project details. Configure the initial migration settings.</p>
            `
          },
          { 
            id: "setup-wizard", 
            title: "Using the setup wizard",
            content: `
              <h2>Using the setup wizard</h2>
              <p>The setup wizard guides you through the initial configuration of your migration project. It helps you connect to your CRM systems, select data types, and configure basic data mapping rules. Follow the step-by-step instructions provided by the wizard. You can save your settings at any point and resume later.</p>
              <h3>Step-by-step guide to the setup wizard</h3>
              <p>The setup wizard will guide you through the process, step by step, with on screen prompts.</p>
              <h3>Configuring initial migration settings</h3>
              <p>The Wizard will ask you to configure the initial migration settings, such as what data to migrate.</p>
              <h3>Importing data mapping templates (if applicable)</h3>
              <p>If available, you can import data mapping templates during the setup wizard. This can streamline the mapping process, especially for common CRM migrations.</p>
            `
          }
        ]
      },
      {
        id: "connecting-crm",
        title: "Connecting to CRM Systems",
        articles: [
          { 
            id: "connect-salesforce", 
            title: "Connecting to Salesforce",
            content: `
              <h2>Connecting to Salesforce</h2>
              <p>To connect to Salesforce, you'll need to provide your Salesforce API credentials. Navigate to your Salesforce account settings and generate an API key. In QuillSwitch, go to 'Settings' > 'CRM Connections' and select 'Salesforce'. Enter your API key and other required credentials. Follow the on-screen instructions to authorize the connection.</p>
              <p>Always refer to the specific CRM's API documentation for the most accurate and up-to-date instructions.</p>
              <h3>Step-by-step connection instructions</h3>
              <p>Follow the on screen prompts, and the individual CRM documentation.</p>
              <h3>API key generation and input</h3>
              <p>Generate the API key in Salesforce, and then enter that key into the QuillSwitch settings.</p>
              <h3>Authentication and authorization procedures</h3>
              <p>Authentication and authorization procedures will vary depending on the CRM. Follow the on screen prompts for Salesforce-specific instructions.</p>
            `
          },
          { 
            id: "connect-hubspot", 
            title: "Connecting to HubSpot",
            content: `
              <h2>Connecting to HubSpot</h2>
              <p>To connect to HubSpot, you'll need to provide your HubSpot API credentials. Navigate to your HubSpot account settings and generate an API key. In QuillSwitch, go to 'Settings' > 'CRM Connections' and select 'HubSpot'. Enter your API key and other required credentials. Follow the on-screen instructions to authorize the connection.</p>
              <p>Always refer to the specific CRM's API documentation for the most accurate and up-to-date instructions.</p>
              <h3>Step-by-step connection instructions</h3>
              <p>Follow the on screen prompts, and the individual CRM documentation.</p>
              <h3>API key generation and input</h3>
              <p>Generate the API key in HubSpot, and then enter that key into the QuillSwitch settings.</p>
              <h3>Authentication and authorization procedures</h3>
              <p>Authentication and authorization procedures will vary depending on the CRM. Follow the on screen prompts for HubSpot-specific instructions.</p>
            `
          },
          { 
            id: "connect-dynamics", 
            title: "Connecting to Microsoft Dynamics 365",
            content: `
              <h2>Connecting to Microsoft Dynamics 365</h2>
              <p>To connect to Microsoft Dynamics 365, you'll need to provide your Dynamics API credentials. Navigate to your Dynamics account settings and generate an API key. In QuillSwitch, go to 'Settings' > 'CRM Connections' and select 'Microsoft Dynamics 365'. Enter your API key and other required credentials. Follow the on-screen instructions to authorize the connection.</p>
              <p>Always refer to the specific CRM's API documentation for the most accurate and up-to-date instructions.</p>
              <h3>Step-by-step connection instructions</h3>
              <p>Follow the on screen prompts, and the individual CRM documentation.</p>
              <h3>API key generation and input</h3>
              <p>Generate the API key in Microsoft Dynamics 365, and then enter that key into the QuillSwitch settings.</p>
              <h3>Authentication and authorization procedures</h3>
              <p>Authentication and authorization procedures will vary depending on the CRM. Follow the on screen prompts for Dynamics 365-specific instructions.</p>
            `
          },
          { 
            id: "connect-other-crm", 
            title: "Connecting to other supported CRMs" 
          },
          { 
            id: "api-auth", 
            title: "API authentication and authorization",
            content: `
              <h2>API authentication and authorization</h2>
              <p>QuillSwitch uses industry-standard API authentication methods, such as OAuth 2.0 and API keys, to ensure secure data transfer. OAuth 2.0 allows you to authorize QuillSwitch to access your CRM data without sharing your login credentials. API keys provide a secure way to identify and authenticate your application.</p>
              <p>Always manage your API keys securely. Do not share them with unauthorized users and rotate them regularly.</p>
              <h3>Explanation of API authentication methods (OAuth, API keys)</h3>
              <p>OAuth 2.0 is an authorization framework that enables applications to obtain limited access to user accounts on an HTTP service. API keys are unique identifiers used to authenticate requests.</p>
              <h3>Managing API credentials securely</h3>
              <p>Store API keys and credentials securely. Use environment variables or configuration files to manage your credentials. Never commit API keys to version control systems.</p>
              <h3>Understanding API permissions and scopes</h3>
              <p>API permissions and scopes define the level of access that QuillSwitch has to your CRM data. Understand these permissions to ensure that QuillSwitch has the necessary access to perform the migration.</p>
            `
          },
          { 
            id: "troubleshoot-connection", 
            title: "Troubleshooting CRM connection issues",
            content: `
              <h2>Troubleshooting CRM connection issues</h2>
              <p>If you encounter connection errors, check your API credentials and permissions. Ensure that your CRM API is enabled and that your network connection is stable. Common error messages include 'Invalid API Key' and 'Connection Timeout'. Refer to your CRM's API documentation for specific error codes and solutions.</p>
              <h3>Common connection error messages and solutions</h3>
              <p>Common error messages include 'Invalid API Key', 'Connection Timeout', and 'Unauthorized Access'. Solutions include verifying your API credentials, checking your network connection, and ensuring that your API is enabled.</p>
              <h3>Checking API access and permissions</h3>
              <p>Verify that QuillSwitch has the necessary access and permissions to your CRM data. Refer to your CRM's API documentation for information on permissions and scopes.</p>
              <h3>Network and firewall troubleshooting</h3>
              <p>Ensure that your network connection is stable and that your firewall is not blocking QuillSwitch's access to your CRM API. Consult with your IT department for assistance with network and firewall issues.</p>
            `
          }
        ]
      },
      {
        id: "data-structures",
        title: "Understanding Data Structures",
        articles: [
          { 
            id: "intro-crm-data", 
            title: "Introduction to CRM data structures",
            content: `
              <h2>Introduction to CRM data structures</h2>
              <p>CRM systems organize data into objects, such as contacts, accounts, deals, and activities. Each object contains fields that store specific data attributes. Understanding the relationships between these objects is crucial for successful data mapping. For example, a contact may be associated with an account and several deals.</p>
              <p>Data relationships are often one-to-many or many-to-many. Make sure to understand these relationships before migrating data.</p>
              <h3>Explanation of standard CRM data objects (contacts, accounts, deals)</h3>
              <p>Standard CRM data objects include contacts (individuals), accounts (companies), deals (sales opportunities), and activities (tasks, events, calls). Each object has a set of standard fields that store relevant data.</p>
              <h3>Understanding data relationships and dependencies</h3>
              <p>Data relationships define how objects are related to each other. Understanding these relationships is crucial for accurate data mapping and migration. For example, a contact may be related to an account, and an account may be related to multiple deals.</p>
              <h3>Overview of common CRM data fields</h3>
              <p>Common CRM data fields include name, email, phone number, address, company name, deal amount, and activity type. Understanding these fields is crucial for data mapping and transformation.</p>
            `
          },
          { 
            id: "mapping-fields", 
            title: "Mapping data fields between different CRMs",
            content: `
              <h2>Mapping data fields between different CRMs</h2>
              <p>The QuillSwitch data mapping interface allows you to match fields between your source and target CRMs. Select the source and target objects, and then map the corresponding fields. You can use the search and filter options to find specific fields. Handle field name and data type differences by applying data transformation rules.</p>
              <p>Use the preview function to ensure that your data is mapped correctly before migrating.</p>
              <h3>Using the data mapping interface</h3>
              <p>The data mapping interface allows for the mapping of the fields from one CRM to the other.</p>
              <h3>Matching source and target fields</h3>
              <p>Match the source CRM fields to the target CRM fields.</p>
              <h3>Handling field name and data type differences</h3>
              <p>Use the data transformation tools to handle any differences in name, or data type, between the source and target fields.</p>
            `
          },
          { 
            id: "custom-objects", 
            title: "Understanding custom objects and fields",
            content: `
              <h2>Understanding custom objects and fields</h2>
              <p>Custom objects and fields allow you to store data specific to your business needs. They can be more complex to migrate than standard objects and fields. Use the QuillSwitch data mapping tools to map custom data elements. Apply data transformations as needed to ensure data compatibility. Consult your CRM documentation for information about custom object and field definitions.</p>
              <p>Custom objects can often require complex transformations due to their unique data structures.</p>
              <h3>Explanation of custom objects and fields</h3>
              <p>Custom objects and fields are user-defined data elements that extend the functionality of your CRM. They allow you to store data that is specific to your business processes.</p>
              <h3>Mapping custom data elements</h3>
              <p>Use the data mapping interface to map custom objects and fields. Pay close attention to data types and relationships.</p>
              <h3>Handling data transformations for custom fields</h3>
              <p>Use the data transformation tools to handle any data type or format differences between custom fields. Test your transformations thoroughly.</p>
            `
          },
          { 
            id: "data-conversions", 
            title: "Data type conversions and compatibility",
            content: `
              <h2>Data type conversions and compatibility</h2>
              <p>Different CRM systems may use different data types for the same fields (e.g., text, numbers, dates). QuillSwitch automatically converts data types when possible. However, you may need to apply custom transformation rules to handle data type differences. Ensure that your data is compatible with the target CRM's data types.</p>
              <p>Date formats are a common issue when migrating data. Be sure to check and standardize them.</p>
              <h3>Understanding data type differences between CRMs</h3>
              <p>Understand the data type differences between your source and target CRMs. This includes text, numbers, dates, and other data types. Use the data transformation tools to handle these differences.</p>
              <h3>Converting data types (text, numbers, dates)</h3>
              <p>Use the data transformation tools to convert data types as needed. For example, you may need to convert a date from one format to another.</p>
              <h3>Handling data compatibility issues</h3>
              <p>Use the data transformation and validation tools to handle any data compatibility issues. Test your migrated data thoroughly to ensure accuracy.</p>
            `
          }
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
