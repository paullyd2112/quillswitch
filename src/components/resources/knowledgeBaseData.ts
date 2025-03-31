
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
            title: "Connecting to other supported CRMs",
            content: `
              <h2>Connecting to Other Supported CRMs</h2>
              <p>QuillSwitch supports a variety of CRM systems beyond Salesforce, HubSpot, and Microsoft Dynamics 365. The connection process is similar across platforms, with some variations in API credential generation and authentication methods. Always refer to the specific CRM's documentation for detailed instructions.</p>
              <h3>General Connection Process</h3>
              <p>The general connection process includes generating API credentials in your CRM system, entering these credentials in QuillSwitch, and authorizing the connection. QuillSwitch provides guided steps for each supported CRM.</p>
              <h3>Supported CRM Systems</h3>
              <p>QuillSwitch currently supports connections to Zoho CRM, Pipedrive, SugarCRM, and other popular CRM platforms. Check our compatibility list for the most up-to-date information on supported systems.</p>
              <h3>Troubleshooting</h3>
              <p>If you encounter issues connecting to your CRM, check your API credentials, ensure your CRM account has the necessary permissions, and verify your network connection. Our support team is available to assist with connection issues.</p>
            `
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
          { 
            id: "planning-project", 
            title: "Planning your migration project",
            content: `
              <h2>Planning your migration project</h2>
              <p>Define your migration goals, scope, and timeline. Create a project plan that outlines the key tasks, milestones, and responsibilities. Identify potential risks and develop mitigation strategies. Communicate your plan to all stakeholders.</p>
              <p>Proper planning leads to fewer errors and a faster migration process.</p>
              <h3>Defining migration goals and scope</h3>
              <p>Clearly define your migration goals and the scope of your project. This includes identifying the data that needs to be migrated and the desired outcome of the migration.</p>
              <h3>Creating a project timeline and budget</h3>
              <p>Develop a project timeline that outlines the key tasks and milestones. Create a budget that includes all costs associated with the migration.</p>
              <h3>Identifying stakeholders and responsibilities</h3>
              <p>Identify all stakeholders involved in the migration project and clearly define their roles and responsibilities.</p>
            `
          },
          { 
            id: "data-cleansing", 
            title: "Data cleansing and preparation",
            content: `
              <h2>Data cleansing and preparation</h2>
              <p>Cleanse your data before migration to ensure accuracy and consistency. Identify and remove duplicate records, correct data errors, and standardize data formats. Use data cleansing tools or scripts to automate this process.</p>
              <p>Garbage in, garbage out. Clean data is essential for a successful migration.</p>
              <h3>Identifying and removing duplicate records</h3>
              <p>Use data cleansing tools or scripts to identify and remove duplicate records from your source CRM.</p>
              <h3>Correcting data inconsistencies and errors</h3>
              <p>Identify and correct data inconsistencies and errors, such as incorrect data types or formatting issues.</p>
              <h3>Standardizing data formats</h3>
              <p>Standardize data formats, such as date formats or address formats, to ensure consistency across your data.</p>
            `
          },
          { 
            id: "understanding-mapping", 
            title: "Understanding data mapping and transformations",
            content: `
              <h2>Understanding data mapping and transformations</h2>
              <p>Data mapping involves matching fields between your source and target CRMs. Data transformations involve modifying data values to ensure compatibility. Use the QuillSwitch data mapping and transformation tools to automate these processes. Apply data normalization techniques to standardize data formats.</p>
              <p>Understand the data relationships between your source and target CRMs before you start mapping.</p>
              <h3>Explanation of data mapping and transformation concepts</h3>
              <p>Data mapping involves matching fields between your source and target CRMs. Data transformations involve modifying data values to ensure compatibility.</p>
              <h3>Best practices for data normalization</h3>
              <p>Data normalization involves organizing data to reduce redundancy and improve data integrity. Use data normalization techniques to standardize data formats and values.</p>
              <h3>Handling complex data transformations</h3>
              <p>Use the QuillSwitch data transformation tools to handle complex data transformations, such as data merging or splitting. Test your transformations thoroughly.</p>
            `
          },
          { 
            id: "testing-strategies", 
            title: "Testing and validation strategies",
            content: `
              <h2>Testing and validation strategies</h2>
              <p>Create test data sets that represent your production data. Run validation checks and reconciliation reports to verify data accuracy. Conduct user acceptance testing (UAT) to ensure that the migrated data meets your business requirements.</p>
              <p>Testing is a critical part of the migration process. It helps identify and resolve data issues before they impact your business.</p>
              <h3>Creating test data sets</h3>
              <p>Create test data sets that represent your production data. Include a variety of data types and scenarios to thoroughly test your migration.</p>
              <h3>Running validation checks and reconciliation reports</h3>
              <p>Use the QuillSwitch validation tools to run validation checks and generate reconciliation reports. Review these reports to identify and resolve data discrepancies.</p>
              <h3>User acceptance testing (UAT)</h3>
              <p>Conduct user acceptance testing (UAT) to ensure that the migrated data meets your business requirements. Involve end-users in the testing process.</p>
            `
          },
          { 
            id: "post-migration", 
            title: "Post-migration checks and optimization",
            content: `
              <h2>Post-migration checks and optimization</h2>
              <p>Verify data accuracy and completeness after migration. Optimize CRM settings and workflows to improve performance. Provide user training and support to ensure a smooth transition. Monitor data quality and address any issues that arise.</p>
              <p>Post-migration support is key to user adoption and satisfaction.</p>
              <h3>Verifying data accuracy and completeness</h3>
              <p>Verify that all data has been migrated accurately and completely. Use validation reports and manual checks to ensure data integrity.</p>
              <h3>Optimizing CRM settings and workflows</h3>
              <p>Optimize CRM settings and workflows to improve performance and efficiency. This may include adjusting data field types, creating custom reports, or automating tasks.</p>
              <h3>Providing user training and support</h3>
              <p>Provide user training and support to ensure that end-users can effectively use the migrated CRM. Create user guides and training materials.</p>
            `
          }
        ]
      },
      {
        id: "data-mapping",
        title: "Data Mapping and Transformations",
        articles: [
          { 
            id: "intro-mapping", 
            title: "Introduction to data mapping",
            content: `
              <h2>Introduction to data mapping</h2>
              <p>Data mapping is the process of matching fields between your source and target CRM systems. It involves identifying the corresponding fields and defining the mapping rules. Use the QuillSwitch data mapping interface to automate this process.</p>
              <p>Understand your data relationships before you start mapping. This will help you create accurate mapping rules.</p>
              <h3>Explanation of field-level mapping</h3>
              <p>Field-level mapping involves matching individual fields between your source and target CRMs. For example, you may map the 'First Name' field in your source CRM to the 'First Name' field in your target CRM.</p>
              <h3>Understanding data relationships and dependencies</h3>
              <p>Data relationships define how objects are related to each other. Understanding these relationships is crucial for accurate data mapping. For example, a contact may be related to an account, and an account may be related to multiple deals.</p>
              <h3>Using mapping templates</h3>
              <p>QuillSwitch provides pre-built mapping templates for common CRM migrations. You can also create and save your own mapping templates for future use.</p>
            `
          },
          { 
            id: "mapping-tools", 
            title: "Using the QuillSwitch data mapping tools",
            content: `
              <h2>Using the QuillSwitch data mapping tools</h2>
              <p>The QuillSwitch data mapping interface allows you to select source and target fields, create mapping rules, and preview data mappings. Use the search and filter options to find specific fields. Apply data transformation rules as needed.</p>
              <p>Use the preview function to ensure that your data is mapped correctly before migrating.</p>
              <h3>Step-by-step guide to the data mapping interface</h3>
              <p>The data mapping interface will guide you through the process of mapping the fields from one CRM to the other, step by step.</p>
              <h3>Creating and managing mapping rules</h3>
              <p>Create and manage mapping rules using the data mapping interface. You can define rules for individual fields or groups of fields.</p>
              <h3>Previewing data mappings</h3>
              <p>Use the preview function to see how your data will be mapped before migrating. This will help you identify and correct any mapping errors.</p>
            `
          },
          { 
            id: "complex-transformations", 
            title: "Understanding complex data transformations",
            content: `
              <h2>Understanding complex data transformations</h2>
              <p>Complex data transformations involve modifying data values using custom logic or scripting. Examples include data merging, splitting, conditional transformations, and calculated fields. Use the QuillSwitch transformation editor to create custom transformation rules.</p>
              <p>Complex transformations require more planning and testing. Test your transformations thoroughly before applying them to your production data.</p>
              <h3>Examples of complex transformations (data merging, splitting, conditional logic)</h3>
              <p>Examples of complex transformations include merging multiple fields into one field, splitting one field into multiple fields, applying conditional logic to transform data based on specific criteria, and calculating new fields based on existing data.</p>
              <h3>Creating custom transformation rules</h3>
              <p>Use the QuillSwitch transformation editor to create custom transformation rules. You can use scripting languages such as JavaScript or Python to define your rules.</p>
              <h3>Using scripting languages for transformations</h3>
              <p>QuillSwitch supports scripting languages such as JavaScript and Python for creating complex data transformations. Use these languages to define custom logic and calculations.</p>
            `
          },
          { 
            id: "custom-rules", 
            title: "Creating custom transformation rules",
            content: `
              <h2>Creating custom transformation rules</h2>
              <p>Use the QuillSwitch transformation editor to create custom transformation rules. You can define rules for individual fields or groups of fields. Test your transformations thoroughly before applying them to your production data.</p>
              <h3>Using the transformation editor</h3>
              <p>The transformation editor allows you to create and edit custom transformation rules. Use the editor to define your rules and test them before applying them to your data.</p>
              <h3>Testing and validating transformation rules</h3>
              <p>Test and validate your transformation rules thoroughly before applying them to your production data. Use test data sets and validation reports to ensure accuracy.</p>
              <h3>Examples of common transformation scenarios</h3>
              <p>Common transformation scenarios include date format conversions, string manipulations, mathematical calculations, and conditional logic. QuillSwitch provides examples and templates for these scenarios.</p>
            `
          },
          { 
            id: "normalization", 
            title: "Best practices for data normalization",
            content: `
              <h2>Best practices for data normalization</h2>
              <p>Data normalization involves standardizing data formats and values to ensure consistency and accuracy. Use data normalization techniques to handle data inconsistencies and errors. Apply data transformation rules as needed.</p>
              <p>Standardized data is much easier to use and maintain.</p>
              <h3>Understanding data normalization principles</h3>
              <p>Data normalization principles involve organizing data to reduce redundancy and improve data integrity. This includes standardizing data formats, removing duplicate data, and ensuring data consistency.</p>
              <h3>Standardizing data formats and values</h3>
              <p>Use data transformation rules to standardize data formats and values. For example, you may need to standardize date formats or address formats.</p>
              <h3>Handling data inconsistencies</h3>
              <p>Identify and correct data inconsistencies using data transformation rules. This may involve correcting spelling errors, standardizing data values, or removing duplicate data.</p>
            `
          }
        ]
      },
      {
        id: "integrations",
        title: "Integrations and API Management",
        articles: [
          { 
            id: "intro-api", 
            title: "Introduction to API integrations",
            content: `
              <h2>Introduction to API integrations</h2>
              <p>API integrations allow you to connect your CRM to third-party applications and data sources. QuillSwitch uses APIs to automate data transfer and synchronization. Understand API endpoints, data formats, and authentication methods.</p>
              <p>API documentation is your friend. Always refer to the API documentation of the third-party application you are integrating with.</p>
              <h3>Explanation of API concepts and usage</h3>
              <p>APIs (Application Programming Interfaces) are sets of rules and specifications that allow applications to communicate with each other. Understand API concepts such as endpoints, requests, responses, and data formats.</p>
              <h3>Understanding API endpoints and data formats</h3>
              <p>API endpoints are the URLs that applications use to communicate with each other. Data formats define the structure of the data that is exchanged between applications. Common data formats include JSON and XML.</p>
              <h3>Using API documentation</h3>
              <p>Refer to the API documentation of the third-party application you are integrating with. This documentation provides information on API endpoints, data formats, authentication methods, and usage examples.</p>
            `
          },
          { 
            id: "third-party", 
            title: "Connecting to third-party applications",
            content: `
              <h2>Connecting to third-party applications</h2>
              <p>Follow the API documentation provided by the third-party application to connect to your CRM. Use API keys or OAuth 2.0 to authenticate your connection. Handle data synchronization and error handling.</p>
              <p>Test your integrations thoroughly before using them in production.</p>
              <h3>Step-by-step guides for connecting to common applications</h3>
              <p>QuillSwitch provides step-by-step guides for connecting to common applications such as marketing automation platforms, e-commerce platforms, and accounting software.</p>
              <h3>API key management and authentication</h3>
              <p>Use API keys or OAuth 2.0 to authenticate your connection to third-party applications. Store your API keys securely and handle API access permissions carefully.</p>
              <h3>Handling data synchronization</h3>
              <p>Define data synchronization rules to ensure that data is transferred accurately and efficiently between your CRM and third-party applications. Use data transformation rules as needed.</p>
            `
          },
          { 
            id: "api-credentials", 
            title: "Managing API keys and credentials",
            content: `
              <h2>Managing API keys and credentials</h2>
              <p>Store your API keys and credentials securely. Use environment variables or configuration files to manage your credentials. Rotate your API keys regularly. Handle API access permissions carefully.</p>
              <p>Never commit API keys to version control systems. This is a major security risk.</p>
              <h3>Securely storing and managing API keys</h3>
              <p>Store API keys in secure locations, such as environment variables or configuration files. Never commit API keys to version control systems.</p>
              <h3>Rotating API keys and credentials</h3>
              <p>Rotate your API keys and credentials regularly to enhance security. This involves generating new keys and updating your application to use the new keys.</p>
              <h3>Handling API access permissions</h3>
              <p>Define API access permissions to control which applications can access your CRM data. Use the principle of least privilege to grant only the necessary permissions.</p>
            `
          },
          { 
            id: "troubleshoot-api", 
            title: "Troubleshooting API integration issues",
            content: `
              <h2>Troubleshooting API integration issues</h2>
              <p>Check API status and availability. Review API error messages and logs. Debug API requests and responses. Use API testing tools to troubleshoot integration issues.</p>
              <p>API issues can be complex and require a methodical approach. Use the API documentation and testing tools to identify and resolve issues.</p>
              <h3>Common API error messages and solutions</h3>
              <p>Common API error messages include 'Invalid API Key', 'Unauthorized Access', and 'Rate Limit Exceeded'. Solutions include verifying your API credentials, checking your access permissions, and adjusting your request frequency.</p>
              <h3>Checking API status and availability</h3>
              <p>Check the API status page of the third-party application you are integrating with. This page provides information on API uptime and any known issues.</p>
              <h3>Debugging API requests and responses</h3>
              <p>Use API testing tools to debug API requests and responses. This will help you identify and resolve any issues with your integration.</p>
            `
          },
          { 
            id: "webhooks", 
            title: "Using webhooks",
            content: `
              <h2>Using webhooks</h2>
              <p>Webhooks allow you to receive real-time updates from third-party applications. Set up webhooks to trigger data synchronization or other actions. Handle webhook payloads and error handling.</p>
              <p>Webhooks are great for real-time data synchronization. Use them to keep your CRM data up-to-date.</p>
              <h3>Understanding webhooks and their use cases</h3>
              <p>Webhooks are user-defined HTTP callbacks that are triggered by specific events. Use them to receive real-time updates from third-party applications.</p>
              <h3>Setting up webhooks for real-time data synchronization</h3>
              <p>Follow the API documentation of the third-party application to set up webhooks. Define the webhook URL and the events that will trigger the webhook.</p>
              <h3>Troubleshooting webhook issues</h3>
              <p>Check the webhook logs to identify any issues. Ensure that your webhook URL is correct and that your server is responding to webhook requests.</p>
            `
          }
        ]
      },
      {
        id: "validation",
        title: "Data Validation and Reconciliation",
        articles: [
          { 
            id: "understanding-validation", 
            title: "Understanding data validation",
            content: `
              <h2>Understanding data validation</h2>
              <p>Data validation involves checking data accuracy and consistency. Use validation rules and checks to identify data errors. Generate validation reports to review data quality.</p>
              <p>Validation helps prevent data issues from impacting your business.</p>
              <h3>Explanation of data validation concepts</h3>
              <p>Data validation involves checking data against a set of rules and constraints to ensure accuracy and consistency. This includes checking data types, formats, and values.</p>
              <h3>Using validation rules and checks</h3>
              <p>Use validation rules and checks to define the criteria for valid data. This includes checking data types, formats, and values.</p>
              <h3>Generating validation reports</h3>
              <p>Generate validation reports to review data quality. These reports provide information on data errors and inconsistencies.</p>
            `
          },
          { 
            id: "validation-tools", 
            title: "Using the QuillSwitch validation tools",
            content: `
              <h2>Using the QuillSwitch validation tools</h2>
              <p>The QuillSwitch validation tools allow you to run validation checks, generate validation reports, and resolve validation errors. Select validation rules and checks, run the validation process, and review the results.</p>
              <p>Automation is your friend when validating large data sets. Use the QuillSwitch validation tools to automate the validation process.</p>
              <h3>Step-by-step guide to the validation interface</h3>
              <p>The validation interface will guide you through the process of running validation checks and generating validation reports, step by step.</p>
              <h3>Running validation checks and reports</h3>
              <p>Select the validation rules and checks you want to run, and then run the validation process. Review the validation reports to identify any data errors.</p>
              <h3>Resolving validation errors</h3>
              <p>Use the data correction tools to resolve validation errors. This may involve manually correcting data values or applying data transformation rules.</p>
            `
          },
          { 
            id: "validation-reports", 
            title: "Generating and interpreting validation reports",
            content: `
              <h2>Generating and interpreting validation reports</h2>
              <p>Validation reports display data quality metrics and error counts. Use these reports to identify data discrepancies and errors. Export validation reports for further analysis.</p>
              <p>Learn to read the validation reports. They contain important information about your data quality.</p>
              <h3>Understanding validation report metrics and data</h3>
              <p>Validation reports display metrics such as error counts, error types, and data quality scores. Understand these metrics to assess the quality of your data.</p>
              <h3>Identifying data discrepancies and errors</h3>
              <p>Use the validation reports to identify data discrepancies and errors. This may involve comparing data values between your source and target CRMs.</p>
              <h3>Exporting validation reports</h3>
              <p>Export validation reports in various formats, such as CSV or Excel, for further analysis and reporting.</p>
            `
          },
          { 
            id: "reconciliation", 
            title: "Reconciling data between source and target CRMs",
            content: `
              <h2>Reconciling data between source and target CRMs</h2>
              <p>Data reconciliation involves comparing data between your source and target CRM systems. Identify and resolve data differences. Use reconciliation tools to automate this process.</p>
              <p>Reconciliation ensures data integrity and accuracy.</p>
              <h3>Comparing data between source and target systems</h3>
              <p>Use reconciliation tools to compare data between your source and target CRM systems. This will help you identify any data differences.</p>
              <h3>Identifying and resolving data differences</h3>
              <p>Identify and resolve data differences using data transformation rules or manual corrections. Use reconciliation tools to automate this process.</p>
              <h3>Using reconciliation tools</h3>
              <p>Use the QuillSwitch reconciliation tools to automate the data reconciliation process. These tools will help you identify and resolve data differences.</p>
            `
          },
          { 
            id: "resolve-discrepancies", 
            title: "Resolving data discrepancies",
            content: `
              <h2>Resolving data discrepancies</h2>
              <p>Identify the root cause of data discrepancies. Apply data transformation rules or manually correct data errors. Use data correction tools to automate this process.</p>
              <p>Root cause analysis is important when resolving data discrepancies. This will help you prevent future data issues.</p>
              <h3>Identifying the root cause of data discrepancies</h3>
              <p>Use data analysis and debugging tools to identify the root cause of data discrepancies. This may involve reviewing data transformation rules or checking data sources.</p>
              <h3>Applying data transformation rules</h3>
              <p>Apply data transformation rules to correct data discrepancies. This may involve converting data types, formatting data values, or applying conditional logic.</p>
              <h3>Manually correcting data errors</h3>
              <p>Manually correct data errors as needed. This may involve editing data values or deleting incorrect records.</p>
            `
          }
        ]
      },
      {
        id: "project-management",
        title: "Project Management for Migrations",
        articles: [
          { 
            id: "create-plan", 
            title: "Creating a migration project plan",
            content: `
              <h2>Creating a migration project plan</h2>
              <p>Define your project goals, scope, and timeline. Create a project plan that outlines the key tasks, milestones, and responsibilities. Identify potential risks and develop mitigation strategies. Communicate your plan to all stakeholders.</p>
              <p>A well-defined project plan is essential for a successful migration.</p>
              <h3>Defining project goals and scope</h3>
              <p>Clearly define your project goals and the scope of your migration. This includes identifying the data that needs to be migrated and the desired outcome of the migration.</p>
              <h3>Creating a project timeline and budget</h3>
              <p>Develop a project timeline that outlines the key tasks and milestones. Create a budget that includes all costs associated with the migration.</p>
              <h3>Identifying project milestones and deliverables</h3>
              <p>Identify key project milestones and deliverables. This will help you track project progress and ensure that you are meeting your goals.</p>
            `
          },
          { 
            id: "milestones", 
            title: "Setting milestones and timelines",
            content: `
              <h2>Setting milestones and timelines</h2>
              <p>Use Gantt charts and project management tools to set milestones and timelines. Track project progress and deadlines. Manage project resources effectively.</p>
              <p>Gantt charts and project management tools can help you visualize your project timeline and track progress.</p>
              <h3>Using Gantt charts and project management tools</h3>
              <p>Use Gantt charts and project management tools to create a visual representation of your project timeline. This will help you track project progress and deadlines.</p>
              <h3>Tracking project progress and deadlines</h3>
              <p>Track project progress and deadlines using project management tools. This will help you identify any potential delays or issues.</p>
              <h3>Managing project resources</h3>
              <p>Manage project resources effectively. This includes assigning tasks to team members and ensuring that they have the necessary resources to complete their work.</p>
            `
          },
          { 
            id: "progress-communication", 
            title: "Managing project progress and communication",
            content: `
              <h2>Managing project progress and communication</h2>
              <p>Use project communication tools to keep stakeholders informed of project progress. Provide regular project status updates. Manage project risks and issues proactively.</p>
              <p>Effective communication is crucial for a successful migration project.</p>
              <h3>Using project communication tools</h3>
              <p>Use project communication tools, such as email, chat, and project management software, to keep stakeholders informed of project progress.</p>
              <h3>Providing project status updates</h3>
              <p>Provide regular project status updates to stakeholders. This includes updates on project progress, milestones, and any potential issues.</p>
              <h3>Managing project risks and issues</h3>
              <p>Identify potential project risks and issues early on. Develop mitigation strategies to address these risks. Communicate any issues to stakeholders promptly.</p>
            `
          },
          { 
            id: "project-features", 
            title: "Using project management features in QuillSwitch",
            content: `
              <h2>Using project management features in QuillSwitch</h2>
              <p>QuillSwitch provides project management features to help you manage your migration projects. Use these features to create and manage tasks, track project progress, and communicate with your team.</p>
              <p>Use the QuillSwitch project management features to streamline your migration process.</p>
              <h3>Overview of project management features</h3>
              <p>QuillSwitch provides project management features such as task management, progress tracking, and communication tools.</p>
              <h3>Creating and managing tasks</h3>
              <p>Use the task management feature to create and manage tasks. Assign tasks to team members and track their progress.</p>
              <h3>Tracking project progress</h3>
              <p>Use the progress tracking feature to monitor the progress of your migration project. This includes tracking task completion and milestone achievement.</p>
            `
          }
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
          { 
            id: "dashboard-widgets", 
            title: "Understanding dashboard widgets and metrics",
            content: `
              <h2>Understanding dashboard widgets and metrics</h2>
              <p>The QuillSwitch dashboard provides widgets that display key metrics and information about your migration projects. These widgets include migration status, performance metrics, and alerts. Understand these widgets to effectively monitor your migrations.</p>
              <p>Dashboard widgets are customizable. Arrange them to suit your workflow.</p>
              <h3>Overview of available dashboard widgets</h3>
              <p>The QuillSwitch dashboard includes widgets for migration status, performance metrics, recent activities, and alerts. Each widget provides specific information about your migration projects.</p>
              <h3>Interpreting dashboard metrics</h3>
              <p>Dashboard metrics include migration progress, data transfer rates, error rates, and completion estimates. Understand these metrics to assess the health of your migrations.</p>
              <h3>Using dashboard widgets for monitoring</h3>
              <p>Use dashboard widgets to monitor the progress and health of your migrations. Set up alerts to notify you of any issues or milestones.</p>
            `
          },
          { 
            id: "customize-dashboard", 
            title: "Customizing the dashboard",
            content: `
              <h2>Customizing the dashboard</h2>
              <p>The QuillSwitch dashboard is customizable to suit your workflow and preferences. You can add, remove, and arrange widgets, apply filters and views, and save custom layouts. These customization options help you focus on the information that matters most to you.</p>
              <p>Save different dashboard layouts for different migration phases or projects.</p>
              <h3>Adding and removing widgets</h3>
              <p>Add widgets that display the information you need and remove those that aren't relevant to your current tasks. Click the 'Customize' button to access widget management options.</p>
              <h3>Arranging and resizing widgets</h3>
              <p>Arrange widgets on your dashboard by dragging and dropping them. Resize widgets to show more or less detail as needed.</p>
              <h3>Saving custom dashboard layouts</h3>
              <p>Save custom dashboard layouts for different purposes or projects. Switch between layouts as needed to focus on specific aspects of your migrations.</p>
            `
          },
          { 
            id: "monitor-migrations", 
            title: "Monitoring active migrations",
            content: `
              <h2>Monitoring active migrations</h2>
              <p>QuillSwitch provides tools to monitor active migrations in real-time. You can track migration progress, view detailed logs, set up alerts, and troubleshoot issues as they arise. Effective monitoring ensures that your migrations proceed smoothly.</p>
              <p>Regular monitoring allows you to catch and resolve issues early.</p>
              <h3>Tracking migration progress in real-time</h3>
              <p>Use the migration status widget and progress indicators to track migration progress in real-time. These tools show you how much data has been migrated and how much remains.</p>
              <h3>Viewing detailed migration logs</h3>
              <p>Access detailed migration logs to get insights into the migration process. These logs include information about data transfers, transformations, and any errors that occur.</p>
              <h3>Setting up alerts and notifications</h3>
              <p>Set up alerts and notifications to be informed about important migration events, such as completion milestones or errors. Configure notifications to be delivered via email, SMS, or in-app messages.</p>
            `
          },
          { 
            id: "access-reports", 
            title: "Accessing migration reports",
            content: `
              <h2>Accessing migration reports</h2>
              <p>QuillSwitch generates reports that provide insights into your migration projects. These reports include migration summaries, data quality reports, error reports, and performance analysis. Use these reports to assess the success of your migrations and identify areas for improvement.</p>
              <p>Regular reporting helps you communicate progress to stakeholders.</p>
              <h3>Available report types</h3>
              <p>QuillSwitch offers various report types, including migration summaries, data quality reports, error reports, and performance analysis. Each report type provides specific insights into your migration projects.</p>
              <h3>Generating and downloading reports</h3>
              <p>Generate reports by selecting the report type and specifying the parameters. Once generated, you can view reports online or download them in various formats, such as PDF or Excel.</p>
              <h3>Scheduling regular reports</h3>
              <p>Schedule regular reports to be generated automatically and delivered to specified recipients. This ensures that stakeholders receive up-to-date information about migration progress.</p>
            `
          }
        ]
      },
      {
        id: "manage-migrations",
        title: "Managing Migrations",
        articles: [
          { 
            id: "create-migration", 
            title: "Creating new migration projects",
            content: `
              <h2>Creating new migration projects</h2>
              <p>To create a new migration project in QuillSwitch, click the 'New Migration' button on the dashboard. Follow the setup wizard to configure your project, including selecting source and target CRMs, defining data mapping requirements, and setting migration options.</p>
              <p>Well-defined migration projects lead to better outcomes. Take time to configure your project thoroughly.</p>
              <h3>Using the migration setup wizard</h3>
              <p>The migration setup wizard guides you through the process of creating a new migration project. Follow the step-by-step instructions to configure your project correctly.</p>
              <h3>Selecting source and target systems</h3>
              <p>Choose your source and target CRM systems from the available options. QuillSwitch supports a wide range of popular CRM platforms.</p>
              <h3>Configuring migration options</h3>
              <p>Configure migration options such as data selection, transformation rules, validation requirements, and scheduling. These options determine how your migration will be executed.</p>
            `
          },
          { 
            id: "edit-migration", 
            title: "Editing and managing migration settings",
            content: `
              <h2>Editing and managing migration settings</h2>
              <p>After creating a migration project, you can edit and manage its settings as needed. This includes modifying data mapping rules, adjusting validation criteria, updating schedules, and changing performance optimizations. Regular reviews of migration settings help ensure optimal outcomes.</p>
              <p>Migration settings can be adjusted even after a migration has started, though some changes may require a restart.</p>
              <h3>Accessing project settings</h3>
              <p>Access project settings by navigating to the migration project and clicking the 'Settings' or 'Edit' button. This gives you access to all configurable aspects of the migration.</p>
              <h3>Modifying data mapping and transformation rules</h3>
              <p>Review and modify data mapping and transformation rules as needed. You can add new mappings, adjust existing ones, or remove mappings that are no longer required.</p>
              <h3>Updating validation and reconciliation settings</h3>
              <p>Adjust validation and reconciliation settings to ensure data quality. You can modify validation rules, error handling processes, and reconciliation thresholds.</p>
            `
          },
          { 
            id: "control-migrations", 
            title: "Starting, pausing, and resuming migrations",
            content: `
              <h2>Starting, pausing, and resuming migrations</h2>
              <p>QuillSwitch allows you to control the execution of your migration projects. You can start migrations when ready, pause them if issues arise or during system maintenance, and resume them when appropriate. These controls give you flexibility in managing the migration process.</p>
              <p>Migration controls let you manage the timing and pace of your data transfers.</p>
              <h3>Starting a migration process</h3>
              <p>Start a migration by navigating to the migration project and clicking the 'Start' button. Before starting, ensure that all settings are configured correctly and that your source and target systems are ready.</p>
              <h3>Pausing active migrations</h3>
              <p>Pause a migration by clicking the 'Pause' button. This temporarily halts the migration process without losing progress. You might pause a migration during system maintenance or if you detect issues that need resolution.</p>
              <h3>Resuming paused migrations</h3>
              <p>Resume a paused migration by clicking the 'Resume' button. The migration will continue from where it left off, preserving all progress made before the pause.</p>
            `
          },
          { 
            id: "cancel-migration", 
            title: "Canceling migrations",
            content: `
              <h2>Canceling migrations</h2>
              <p>In some cases, you may need to cancel a migration project. QuillSwitch allows you to cancel migrations and provides options for handling the data that has already been migrated. Understanding the cancellation process helps you manage unsuccessful or unnecessary migrations.</p>
              <p>Canceling a migration should be a last resort. Consider pausing instead if you just need time to resolve issues.</p>
              <h3>When to cancel a migration</h3>
              <p>Consider canceling a migration if fundamental configuration issues are discovered, if the migration is no longer needed, or if irrecoverable errors have occurred that prevent successful completion.</p>
              <h3>The cancellation process</h3>
              <p>To cancel a migration, navigate to the migration project and click the 'Cancel' button. You'll be asked to confirm the cancellation and choose how to handle already migrated data.</p>
              <h3>Handling already migrated data</h3>
              <p>When canceling a migration, you can choose to keep or rollback already migrated data. This decision depends on your specific situation and whether the partial migration has created usable data.</p>
            `
          }
        ]
      },
      {
        id: "mapping-tools",
        title: "Data Mapping and Transformation Tools",
        articles: [
          { 
            id: "mapping-interface", 
            title: "Step-by-step guide to using the data mapping interface",
            content: `
              <h2>Step-by-step guide to using the data mapping interface</h2>
              <p>The QuillSwitch data mapping interface allows you to connect source fields to target fields and apply transformations as needed. This guide walks you through the process of creating and managing data mappings, including selecting objects, matching fields, and applying transformation rules.</p>
              <p>Effective data mapping is crucial for successful migrations. Take time to understand your data structures before starting.</p>
              <h3>Navigating the mapping interface</h3>
              <p>The mapping interface consists of source fields on the left, target fields on the right, and mapping controls in the center. Use the search and filter tools to locate specific fields in large data sets.</p>
              <h3>Creating field-to-field mappings</h3>
              <p>Create field-to-field mappings by selecting a source field and a target field, then clicking the 'Connect' button. You can also drag and drop fields to create mappings quickly.</p>
              <h3>Applying basic transformations</h3>
              <p>Apply basic transformations such as text formatting, date conversion, or value substitution by selecting a mapping and using the transformation tools. These transformations are applied during data transfer.</p>
            `
          },
          { 
            id: "manage-transformations", 
            title: "Creating and managing data transformations",
            content: `
              <h2>Creating and managing data transformations</h2>
              <p>Data transformations allow you to modify data during migration to ensure compatibility and usability. QuillSwitch provides tools to create, test, and manage transformations, from simple conversions to complex calculated fields and conditional logic.</p>
              <p>Always test your transformations with representative data before applying them to your full migration.</p>
              <h3>Understanding transformation types</h3>
              <p>QuillSwitch supports various transformation types, including text formatting, date conversion, mathematical operations, conditional logic, and custom scripts. Each type is suited for different transformation needs.</p>
              <h3>Creating complex transformations</h3>
              <p>Create complex transformations using the transformation editor. You can combine multiple operations, use conditional logic, and reference other fields to create sophisticated transformations.</p>
              <h3>Testing and validating transformations</h3>
              <p>Test transformations using the preview feature, which shows how your transformations will affect sample data. Validate transformations to ensure they produce the expected results before applying them to your migration.</p>
            `
          },
          { 
            id: "templates", 
            title: "Using transformation templates",
            content: `
              <h2>Using transformation templates</h2>
              <p>QuillSwitch provides transformation templates for common scenarios, saving you time and ensuring consistency. You can use pre-built templates, customize them for your needs, and create your own templates for reuse in future migrations.</p>
              <p>Templates speed up the mapping process and promote best practices.</p>
              <h3>Available pre-built templates</h3>
              <p>QuillSwitch includes templates for common scenarios such as name splitting/combining, address formatting, date standardization, and status field mapping. These templates cover the most frequently needed transformations.</p>
              <h3>Customizing templates</h3>
              <p>Customize pre-built templates to match your specific requirements. You can modify transformation logic, add conditions, or combine templates to create the exact transformation you need.</p>
              <h3>Creating and saving custom templates</h3>
              <p>Create your own templates by saving transformations you've built. Give your templates descriptive names and organize them into categories for easy access in future migrations.</p>
            `
          },
          { 
            id: "preview-data", 
            title: "Previewing transformed data",
            content: `
              <h2>Previewing transformed data</h2>
              <p>The preview feature in QuillSwitch allows you to see how your mapped and transformed data will look before executing the migration. This helps you identify and resolve mapping errors, transformation issues, and data compatibility problems early in the process.</p>
              <p>Always preview your data transformations before running a migration. This saves time by catching issues early.</p>
              <h3>Using the data preview feature</h3>
              <p>Access the preview feature by clicking the 'Preview' button in the mapping interface. This shows a sample of your source data transformed according to your mapping and transformation rules.</p>
              <h3>Interpreting preview results</h3>
              <p>Review the preview results to ensure that your transformations are working as expected. Pay particular attention to fields with complex transformations or data type conversions.</p>
              <h3>Troubleshooting mapping and transformation issues</h3>
              <p>If you notice issues in the preview, use the error highlighting and diagnostic tools to identify the cause. Common issues include data type mismatches, incomplete mappings, and errors in transformation logic.</p>
            `
          }
        ]
      },
      {
        id: "validation-tools",
        title: "Validation and Reconciliation Tools",
        articles: [
          { 
            id: "run-validation", 
            title: "Running validation checks",
            content: `
              <h2>Running validation checks</h2>
              <p>Validation checks ensure that your data meets quality and compatibility requirements. QuillSwitch provides tools to define validation rules, run checks against your data, and identify issues that need attention. Regular validation keeps your data clean and migration-ready.</p>
              <p>Run validation checks regularly during your migration project, not just at the end.</p>
              <h3>Configuring validation rules</h3>
              <p>Configure validation rules that define what constitutes valid data. These rules can check for required fields, data format consistency, value ranges, and relationships between fields.</p>
              <h3>Executing validation processes</h3>
              <p>Run validation processes by selecting the data to validate and the rules to apply, then clicking the 'Validate' button. You can validate specific data sets or your entire migration project.</p>
              <h3>Interpreting validation results</h3>
              <p>Review validation results to identify data issues. Results typically show the number and types of validation errors, affected records, and specific error messages for each issue.</p>
            `
          },
          { 
            id: "reconciliation-reports", 
            title: "Generating and interpreting reconciliation reports",
            content: `
              <h2>Generating and interpreting reconciliation reports</h2>
              <p>Reconciliation reports compare source and target data to ensure that your migration is complete and accurate. QuillSwitch generates reports that highlight discrepancies, missing records, and data inconsistencies, helping you verify migration success.</p>
              <p>Reconciliation is a critical final step in any migration project. Don't skip it!</p>
              <h3>Understanding reconciliation concepts</h3>
              <p>Reconciliation involves comparing source and target data to verify that all records were migrated correctly. This includes checking record counts, field values, and relationships between records.</p>
              <h3>Generating reconciliation reports</h3>
              <p>Generate reconciliation reports by selecting the data to compare and the comparison criteria, then clicking the 'Reconcile' button. You can reconcile specific objects or your entire migration.</p>
              <h3>Analyzing reconciliation results</h3>
              <p>Analyze reconciliation results to identify migration issues. Look for missing records, value discrepancies, and relationship inconsistencies. Use the filtering and grouping tools to focus on specific problem areas.</p>
            `
          },
          { 
            id: "resolve-errors", 
            title: "Resolving validation errors",
            content: `
              <h2>Resolving validation errors</h2>
              <p>When validation checks or reconciliation reports identify issues, QuillSwitch provides tools to resolve them efficiently. You can correct errors in source data, adjust mappings and transformations, or implement error handling strategies to address validation failures.</p>
              <p>Categorize and prioritize errors to handle them efficiently. Some errors may be more critical than others.</p>
              <h3>Correcting data errors</h3>
              <p>Correct data errors by editing source data, applying transformations, or implementing data cleansing processes. QuillSwitch provides direct editing capabilities for minor issues and bulk operations for widespread problems.</p>
              <h3>Adjusting mappings and transformations</h3>
              <p>Adjust mappings and transformations to resolve validation errors caused by incorrect field connections or transformation logic. Test your adjustments using the preview feature before rerunning validation.</p>
              <h3>Implementing error handling strategies</h3>
              <p>Implement error handling strategies such as default values, error logs, or skip-and-continue processes for records that cannot be easily corrected. Document any compromises or workarounds for future reference.</p>
            `
          },
          { 
            id: "manual-validation", 
            title: "Manual validation options",
            content: `
              <h2>Manual validation options</h2>
              <p>In addition to automated validation, QuillSwitch offers manual validation options for scenarios that require human judgment. These options include record-by-record review, sampling and spot checks, and custom validation processes tailored to your specific requirements.</p>
              <p>Manual validation is particularly important for complex data or high-value records that warrant extra attention.</p>
              <h3>Record-by-record review</h3>
              <p>Perform record-by-record reviews when dealing with critical data or complex validation requirements. QuillSwitch provides interfaces for comparing source and target records side by side for thorough inspection.</p>
              <h3>Sampling and spot checks</h3>
              <p>Use sampling and spot checks to validate large data sets efficiently. QuillSwitch can generate representative samples for manual review, allowing you to validate data quality without reviewing every record.</p>
              <h3>Custom validation processes</h3>
              <p>Create custom validation processes for unique requirements not covered by standard validation tools. This might include business rule enforcement, complex relationship validation, or industry-specific data standards.</p>
            `
          }
        ]
      },
      {
        id: "reporting",
        title: "Reporting and Analytics",
        articles: [
          { 
            id: "summary-reports", 
            title: "Generating migration summary reports",
            content: `
              <h2>Generating migration summary reports</h2>
              <p>Migration summary reports provide an overview of your migration project's progress, results, and metrics. These reports help you track completion status, identify issues, and communicate results to stakeholders. QuillSwitch offers various report formats and delivery options.</p>
              <p>Use summary reports to keep stakeholders informed about migration progress and outcomes.</p>
              <h3>Available summary report types</h3>
              <p>QuillSwitch offers summary reports including migration progress summaries, object migration summaries, error summaries, and time and performance summaries. Each report type focuses on different aspects of your migration.</p>
              <h3>Creating and customizing reports</h3>
              <p>Create and customize reports by selecting the report type, specifying the time period and data scope, and choosing the metrics to include. You can save report configurations for future use.</p>
              <h3>Sharing reports with stakeholders</h3>
              <p>Share reports with stakeholders by downloading them in various formats (PDF, Excel, CSV), scheduling email deliveries, or providing access to online dashboards. Choose the sharing method that best suits your audience's needs.</p>
            `
          },
          { 
            id: "custom-reports", 
            title: "Creating custom reports",
            content: `
              <h2>Creating custom reports</h2>
              <p>Custom reports allow you to analyze specific aspects of your migration project that aren't covered by standard reports. QuillSwitch provides report building tools that let you select data sources, choose metrics and dimensions, add filters and conditions, and format your report output.</p>
              <p>Custom reports help you answer specific questions about your migration and focus on areas of particular interest or concern.</p>
              <h3>Using the report builder</h3>
              <p>Use the report builder to create custom reports by selecting data sources, choosing fields to include, adding filters to focus on specific data, and arranging the report layout. The builder offers a visual interface for report design.</p>
              <h3>Selecting metrics and dimensions</h3>
              <p>Select metrics (quantitative measures like record counts or error rates) and dimensions (categorical attributes like object types or status values) to analyze your migration data from different perspectives.</p>
              <h3>Adding filters and conditions</h3>
              <p>Add filters and conditions to focus your report on specific data subsets. You can filter by date ranges, object types, status values, or any other attribute available in your migration data.</p>
            `
          },
          { 
            id: "quality-reports", 
            title: "Interpreting data quality reports",
            content: `
              <h2>Interpreting data quality reports</h2>
              <p>Data quality reports evaluate the cleanliness, completeness, and consistency of your migration data. QuillSwitch generates reports that highlight quality issues, data patterns, and potential improvements. Understanding these reports helps you maintain high data standards throughout your migration.</p>
              <p>Data quality directly impacts migration success. Address quality issues before they affect your target system.</p>
              <h3>Understanding data quality metrics</h3>
              <p>Data quality metrics include completeness (percentage of non-null values), validity (conformance to data type and format), consistency (alignment with business rules), and uniqueness (absence of duplicates). Each metric offers insights into different aspects of data quality.</p>
              <h3>Identifying common quality issues</h3>
              <p>Identify common quality issues such as missing values, format inconsistencies, duplicate records, and integrity violations. Data quality reports highlight these issues and indicate their frequency and severity.</p>
              <h3>Implementing data quality improvements</h3>
              <p>Implement data quality improvements based on report findings. This might include data cleansing processes, validation rule updates, or source system corrections to address recurring issues.</p>
            `
          },
          { 
            id: "export-reports", 
            title: "Exporting reports",
            content: `
              <h2>Exporting reports</h2>
              <p>QuillSwitch allows you to export reports in various formats for sharing, archiving, or further analysis. You can export to standard formats like PDF and Excel, schedule regular exports, and customize export settings to meet your specific requirements.</p>
              <p>Export reports to maintain migration records, share results with stakeholders who don't have access to QuillSwitch, or analyze data with external tools.</p>
              <h3>Available export formats</h3>
              <p>Available export formats include PDF (for formal documentation and presentation), Excel (for further analysis and manipulation), CSV (for data portability), and HTML (for web viewing). Choose the format that best suits your intended use.</p>
              <h3>Scheduling regular exports</h3>
              <p>Schedule regular exports to automatically generate and deliver reports on a recurring basis. You can set daily, weekly, or monthly schedules and specify delivery methods such as email or file system storage.</p>
              <h3>Customizing export settings</h3>
              <p>Customize export settings such as paper size, orientation, headers and footers, and included elements. These settings help you create reports that match your organization's standards and presentation preferences.</p>
            `
          }
        ]
      },
      {
        id: "api-docs",
        title: "API Documentation",
        articles: [
          { 
            id: "api-endpoints", 
            title: "API endpoints and usage",
            content: `
              <h2>API endpoints and usage</h2>
              <p>QuillSwitch provides a comprehensive API that allows you to interact with the platform programmatically. The API includes endpoints for managing migrations, accessing data, controlling processes, and generating reports. Understanding these endpoints helps you automate and integrate migration workflows.</p>
              <p>The API enables automation and integration with your existing systems and workflows.</p>
              <h3>Overview of available endpoints</h3>
              <p>QuillSwitch API endpoints cover migration management, data access and manipulation, process control, reporting and analytics, and user and system administration. Each endpoint group serves specific functional areas of the platform.</p>
              <h3>Making API requests</h3>
              <p>Make API requests using standard HTTP methods (GET, POST, PUT, DELETE) and JSON data formats. Include authentication headers and follow the request structure documented for each endpoint.</p>
              <h3>Handling API responses</h3>
              <p>Handle API responses by parsing the returned JSON data, checking status codes, and processing any error messages. Successful responses include requested data or confirmation of action completion.</p>
            `
          },
          { 
            id: "api-auth", 
            title: "Authentication and authorization",
            content: `
              <h2>Authentication and authorization</h2>
              <p>The QuillSwitch API uses secure authentication mechanisms to control access. You'll need to authenticate your requests using API keys or OAuth tokens and understand the authorization model that determines what actions you can perform through the API.</p>
              <p>Secure your API credentials carefully. Compromised credentials could lead to unauthorized access to your migration data.</p>
              <h3>API authentication methods</h3>
              <p>QuillSwitch supports API key authentication and OAuth 2.0 for API access. API keys are simpler to implement but offer less granular control, while OAuth provides more security features and permission management.</p>
              <h3>Generating and managing API credentials</h3>
              <p>Generate API credentials in the QuillSwitch user interface under 'Settings' > 'API Access'. You can create, view, rotate, and revoke credentials as needed to maintain security.</p>
              <h3>Understanding API permissions</h3>
              <p>API permissions determine what actions you can perform through the API. Permissions are organized by resource type and action, allowing for precise access control based on your needs.</p>
            `
          },
          { 
            id: "code-snippets", 
            title: "API examples and code snippets",
            content: `
              <h2>API examples and code snippets</h2>
              <p>QuillSwitch provides code examples and snippets to help you implement API integrations quickly. These examples cover common use cases in multiple programming languages and frameworks, making it easier to integrate with your existing systems.</p>
              <p>Code examples save development time and demonstrate best practices for API usage.</p>
              <h3>Common API usage scenarios</h3>
              <p>Common API usage scenarios include starting and monitoring migrations, retrieving migration status and results, managing data mappings and transformations, and generating reports. Code examples are provided for each scenario.</p>
              <h3>Examples in various programming languages</h3>
              <p>QuillSwitch provides examples in popular programming languages including JavaScript, Python, Java, C#, and PHP. These examples demonstrate proper API usage with language-specific idioms and best practices.</p>
              <h3>Integration with common frameworks</h3>
              <p>Examples for integration with common frameworks and platforms such as Node.js, Django, Spring Boot, .NET, and more are provided. These examples show how to incorporate QuillSwitch API calls into your application architecture.</p>
            `
          },
          { 
            id: "troubleshoot-api", 
            title: "Troubleshooting API issues",
            content: `
              <h2>Troubleshooting API issues</h2>
              <p>When using the QuillSwitch API, you may encounter issues that require troubleshooting. Common problems include authentication failures, rate limiting, incorrect data formats, and version compatibility. Understanding these issues and their solutions helps you create robust integrations.</p>
              <p>Implement error handling in your API integrations to gracefully manage unexpected issues.</p>
              <h3>Common API error codes</h3>
              <p>Common API error codes include 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 429 (Too Many Requests), and 500 (Internal Server Error). Each code indicates a specific issue type that requires a different resolution approach.</p>
              <h3>Debugging API requests</h3>
              <p>Debug API requests using tools like Postman or curl to isolate issues. Verify request formats, authentication headers, and endpoint URLs. The API also provides detailed error messages to help identify the specific problem.</p>
              <h3>Best practices for error handling</h3>
              <p>Implement error handling best practices such as checking response status codes, parsing error messages, implementing retries with exponential backoff for transient errors, and logging detailed information for troubleshooting.</p>
            `
          }
        ]
      },
      {
        id: "settings",
        title: "Settings and Configurations",
        articles: [
          { 
            id: "user-management", 
            title: "User management and permissions",
            content: `
              <h2>User management and permissions</h2>
              <p>QuillSwitch includes user management features that allow you to control access to your migration projects. You can add users, assign roles and permissions, organize users into teams, and audit user activities. Proper user management enhances security and collaboration.</p>
              <p>Follow the principle of least privilege when assigning permissions. Give users only the access they need to perform their tasks.</p>
              <h3>Adding and managing users</h3>
              <p>Add users by inviting them via email in the 'Settings' > 'User Management' section. You can manage existing users by editing their profiles, changing their roles, or deactivating accounts when needed.</p>
              <h3>Roles and permission levels</h3>
              <p>QuillSwitch offers predefined roles such as Administrator, Project Manager, Data Specialist, and Viewer. Each role has different permission levels for various platform functions. You can also create custom roles with specific permission sets.</p>
              <h3>User activity auditing</h3>
              <p>Audit user activities through logs that record actions such as logins, migrations started, settings changed, and data accessed. These logs help maintain security and compliance by tracking who did what and when.</p>
            `
          },
          { 
            id: "account-billing", 
            title: "Account settings and billing",
            content: `
              <h2>Account settings and billing</h2>
              <p>Manage your QuillSwitch account settings and billing information to ensure uninterrupted service. You can update company information, manage subscription plans, view billing history, and update payment methods through the account settings.</p>
              <p>Keep your billing information up to date to avoid service interruptions.</p>
              <h3>Updating company information</h3>
              <p>Update your company information such as name, address, contact details, and logo in the 'Settings' > 'Account' section. This information is used for billing and appears on reports that you generate.</p>
              <h3>Managing subscription plans</h3>
              <p>Manage your subscription plan by viewing current plan details, upgrading or downgrading as needed, and adjusting user licenses. Plan changes typically take effect at the next billing cycle.</p>
              <h3>Viewing billing history and invoices</h3>
              <p>View your billing history and download invoices from the 'Settings' > 'Billing' section. You can see past payments, upcoming charges, and detailed usage information that affects your billing.</p>
            `
          },
          { 
            id: "notifications", 
            title: "Notification settings",
            content: `
              <h2>Notification settings</h2>
              <p>QuillSwitch provides notification settings to keep you informed about important events and activities. You can configure alerts for migration events, system notifications, report deliveries, and user activity alerts. Proper notification configuration ensures you stay informed without being overwhelmed.</p>
              <p>Tailor notifications to your workflow. Too many notifications can lead to alert fatigue and missed important messages.</p>
              <h3>Configuring alert preferences</h3>
              <p>Configure alert preferences in the 'Settings' > 'Notifications' section. You can choose which events trigger notifications and how those notifications are delivered (email, SMS, in-app, etc.).</p>
              <h3>Setting up email notifications</h3>
              <p>Set up email notifications by providing and verifying your email address, selecting which notifications you want to receive by email, and configuring delivery frequency (immediate, digest, etc.).</p>
              <h3>Mobile and desktop alerts</h3>
              <p>Configure mobile and desktop alerts to receive push notifications on your devices. You can install the QuillSwitch mobile app or enable browser notifications for desktop alerts.</p>
            `
          },
          { 
            id: "security", 
            title: "Security settings",
            content: `
              <h2>Security settings</h2>
              <p>QuillSwitch offers security settings to protect your migration data and account. You can configure authentication requirements, manage API keys, set up data encryption, and implement compliance controls. Strong security settings protect sensitive information during the migration process.</p>
              <p>Never compromise on security settings, especially when dealing with sensitive customer or business data.</p>
              <h3>Password policies and two-factor authentication</h3>
              <p>Configure password policies such as minimum length, complexity requirements, and expiration periods. Enable two-factor authentication for additional security, requiring a second verification method beyond passwords.</p>
              <h3>API security and access controls</h3>
              <p>Manage API security by creating and revoking API keys, setting up IP restrictions for API access, and monitoring API usage for suspicious activity. These controls help prevent unauthorized API usage.</p>
              <h3>Data encryption and compliance settings</h3>
              <p>Configure data encryption settings to protect data in transit and at rest. Set up compliance controls to meet industry regulations such as GDPR, HIPAA, or other standards relevant to your organization.</p>
            `
          }
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
          { 
            id: "data-mismatch", 
            title: "Data type mismatch errors",
            content: `
              <h2>Data type mismatch errors</h2>
              <p>Data type mismatch errors occur when the data type of a source field is incompatible with the target field. These errors can prevent successful data migration and must be resolved through data transformations or mapping adjustments.</p>
              <p>Data type mismatches are among the most common migration errors but are usually straightforward to fix.</p>
              <h3>Identifying data type mismatches</h3>
              <p>Identify data type mismatches through validation reports or error logs that specifically mention type conversion failures. Common examples include text stored in number fields, incorrect date formats, or boolean values stored as strings.</p>
              <h3>Resolving type conversion issues</h3>
              <p>Resolve type conversion issues by applying appropriate data transformations. For example, convert text to numbers, standardize date formats, or parse boolean string values ('Yes'/'No') to true/false values.</p>
              <h3>Best practices for data type mapping</h3>
              <p>Follow best practices such as reviewing field data types before mapping, using data transformation tools for type conversions, and validating data samples before full migration to prevent type mismatch errors.</p>
            `
          },
          { 
            id: "api-errors", 
            title: "API connection errors",
            content: `
              <h2>API connection errors</h2>
              <p>API connection errors occur when QuillSwitch cannot establish or maintain connections with source or target CRM systems. These errors may be caused by authentication issues, network problems, API limitations, or service outages.</p>
              <p>Always check your API keys and connection settings first when troubleshooting connection errors.</p>
              <h3>Common API connection error types</h3>
              <p>Common error types include authentication failures (incorrect credentials), authorization issues (insufficient permissions), rate limiting (too many requests), timeout errors (slow responses), and service unavailability (CRM system down).</p>
              <h3>Troubleshooting authentication issues</h3>
              <p>Troubleshoot authentication issues by verifying API keys or OAuth tokens, checking that credentials haven't expired, and ensuring that authentication methods match the API requirements (e.g., OAuth vs. API key).</p>
              <h3>Network and firewall configuration</h3>
              <p>Address network and firewall issues by checking internet connectivity, configuring firewalls to allow API traffic, verifying IP whitelisting if required, and testing connections from different networks to isolate issues.</p>
            `
          },
          { 
            id: "validation-errors", 
            title: "Data validation errors",
            content: `
              <h2>Data validation errors</h2>
              <p>Data validation errors occur when migrated data fails to meet the validation rules or constraints of the target system. These errors may involve required fields, data formats, value constraints, or unique identifier requirements.</p>
              <p>Validation errors are best addressed before migration through data cleansing and mapping adjustments.</p>
              <h3>Understanding validation error messages</h3>
              <p>Understand validation error messages by reviewing error logs and validation reports. These messages typically indicate which field failed validation, what rule was violated, and which records are affected.</p>
              <h3>Addressing required field errors</h3>
              <p>Address required field errors by ensuring that all mandatory fields in the target system have mappings from source data or default values assigned. You may need to gather missing data or implement data transformation rules to generate values.</p>
              <h3>Resolving format and constraint violations</h3>
              <p>Resolve format and constraint violations by transforming data to match required formats (e.g., phone number formats, email validation), ensuring values fall within allowed ranges, and handling unique constraint violations by identifying and resolving duplicates.</p>
            `
          },
          { 
            id: "integration-errors", 
            title: "Integration errors",
            content: `
              <h2>Integration errors</h2>
              <p>Integration errors occur when QuillSwitch encounters issues while working with third-party systems, plugins, or external data sources. These errors may involve API compatibility, data exchange formats, or version mismatches.</p>
              <p>When working with multiple integrated systems, test each integration separately to isolate issues.</p>
              <h3>Identifying integration failure points</h3>
              <p>Identify integration failure points by reviewing error logs, checking API response codes, and testing integrations in isolation. Look for patterns in when and how integrations fail to pinpoint the source of issues.</p>
              <h3>Version compatibility issues</h3>
              <p>Address version compatibility issues by ensuring that you're using compatible versions of APIs and integration components. Check documentation for version requirements and update components as needed.</p>
              <h3>Resolving third-party integration problems</h3>
              <p>Resolve third-party integration problems by consulting vendor documentation, reaching out to support channels, checking for known issues or limitations, and implementing workarounds if necessary. Sometimes, integration issues require coordination with third-party vendors.</p>
            `
          }
        ]
      },
      {
        id: "data-discrepancies",
        title: "Resolving Data Discrepancies",
        articles: [
          { 
            id: "inconsistencies", 
            title: "Identifying and resolving data inconsistencies",
            content: `
              <h2>Identifying and resolving data inconsistencies</h2>
              <p>Data inconsistencies occur when the same information is represented differently across records or systems. These inconsistencies can cause data quality issues and migration errors. QuillSwitch provides tools to identify and resolve these inconsistencies.</p>
              <p>Addressing data inconsistencies improves both migration success and the long-term usability of your data.</p>
              <h3>Common types of data inconsistencies</h3>
              <p>Common inconsistencies include naming variations (e.g., "Street" vs. "St."), formatting differences (e.g., date formats), value representation differences (e.g., "Yes/No" vs. "True/False"), and structural inconsistencies in complex fields like addresses.</p>
              <h3>Using data profiling to identify issues</h3>
              <p>Use data profiling tools to analyze data patterns, distribution, and anomalies. These tools can highlight inconsistencies by showing where supposedly uniform data has variations or outliers.</p>
              <h3>Applying normalization and standardization</h3>
              <p>Apply normalization and standardization techniques to resolve inconsistencies. This may include case normalization, date format standardization, address normalization, or value mapping to convert variations to a standard form.</p>
            `
          },
          { 
            id: "duplicates", 
            title: "Handling duplicate records",
            content: `
              <h2>Handling duplicate records</h2>
              <p>Duplicate records can cause data integrity issues during migration. QuillSwitch offers tools to identify, merge, or remove duplicates, ensuring clean data in your target system. Proactive duplicate management improves migration quality and system performance.</p>
              <p>Duplicate management strategy should be decided early in the migration planning process.</p>
              <h3>Identifying duplicate records</h3>
              <p>Identify duplicates using exact match detection (where records are identical), fuzzy matching (for records with slight variations), or key-based matching (comparing specific identifiers like email addresses). QuillSwitch provides configurable matching rules for each approach.</p>
              <h3>Duplicate resolution strategies</h3>
              <p>Choose a resolution strategy such as keeping the most recent record, merging data from all duplicates, manually reviewing each case, or applying custom rules based on data quality indicators. Your strategy should align with your data governance policies.</p>
              <h3>Implementing duplicate prevention</h3>
              <p>Implement duplicate prevention by configuring validation rules, using unique constraints, applying data normalization before import, and establishing ongoing processes to prevent future duplicates in the target system.</p>
            `
          },
          { 
            id: "formatting", 
            title: "Correcting data formatting issues",
            content: `
              <h2>Correcting data formatting issues</h2>
              <p>Data formatting issues can prevent successful data migration and reduce data quality. QuillSwitch provides transformation tools to correct formatting problems with dates, numbers, text, and other data types, ensuring compatibility with target system requirements.</p>
              <p>Consistent data formatting improves usability, reporting accuracy, and system integration.</p>
              <h3>Common formatting issues</h3>
              <p>Common formatting issues include inconsistent date formats (MM/DD/YYYY vs. DD/MM/YYYY), number formatting variations (decimal separators, currency symbols), inconsistent text casing or spacing, and special character handling problems.</p>
              <h3>Date and time formatting</h3>
              <p>Address date and time formatting issues by standardizing formats, handling timezone conversions, resolving ambiguous dates (e.g., 01/02/2023 could be January 2 or February 1), and ensuring date validity.</p>
              <h3>Number and currency formatting</h3>
              <p>Correct number and currency formatting by standardizing decimal and thousands separators, handling currency symbols and codes consistently, and ensuring proper representation of negative values and ranges.</p>
            `
          }
        ]
      },
      {
        id: "api-issues",
        title: "Troubleshooting API Issues",
        articles: [
          { 
            id: "auth-errors", 
            title: "API authentication errors",
            content: `
              <h2>API authentication errors</h2>
              <p>API authentication errors occur when QuillSwitch cannot authenticate with source or target systems. These errors may be due to incorrect credentials, expired tokens, or misconfigured authentication settings. Resolving these issues is essential for successful data access.</p>
              <p>Always secure your API credentials and never share them in code repositories or public forums.</p>
              <h3>Understanding authentication error messages</h3>
              <p>Authentication errors typically present as 401 (Unauthorized) or 403 (Forbidden) HTTP status codes. Error messages may mention "invalid credentials," "expired token," or "access denied." Study these messages for specific guidance on the issue.</p>
              <h3>API key and token issues</h3>
              <p>Address API key issues by verifying key correctness, checking for expiration, ensuring proper transmission in headers or parameters, and confirming that the key has the necessary permissions for the operations you're attempting.</p>
              <h3>OAuth and advanced authentication troubleshooting</h3>
              <p>Troubleshoot OAuth issues by checking token expiration and refresh mechanisms, verifying redirect URI configurations, ensuring proper scope requests, and confirming that authorization flows are implemented correctly according to the provider's requirements.</p>
            `
          },
          { 
            id: "rate-limiting", 
            title: "API rate limiting issues",
            content: `
              <h2>API rate limiting issues</h2>
              <p>API rate limiting issues occur when you exceed the number of allowed requests to a CRM system's API. These limits are imposed to prevent abuse and ensure service stability. QuillSwitch helps you manage these limits through throttling and optimization techniques.</p>
              <p>Understanding the rate limits of your source and target systems is crucial for planning efficient migrations.</p>
              <h3>Understanding API rate limits</h3>
              <p>API rate limits may be based on requests per second, minute, hour, or day. Some systems also impose limits on concurrent connections or data volume. Review the API documentation of your CRM systems to understand their specific limitations.</p>
              <h3>Identifying rate limiting errors</h3>
              <p>Rate limiting errors typically appear as HTTP 429 (Too Many Requests) status codes. Error responses may include information about your current usage, limits, and when you can resume making requests (retry-after headers).</p>
              <h3>Implementing rate limit handling strategies</h3>
              <p>Handle rate limits by implementing request throttling (controlling request frequency), exponential backoff (increasing wait time between retries), request batching (combining multiple operations), and scheduling migrations during off-peak hours to maximize available capacity.</p>
            `
          },
          { 
            id: "timeouts", 
            title: "API connection timeouts",
            content: `
              <h2>API connection timeouts</h2>
              <p>API connection timeouts occur when requests to CRM systems take too long to complete. These timeouts can interrupt data transfer and cause migration failures. QuillSwitch implements strategies to handle timeouts and ensure reliable data migration.</p>
              <p>Timeouts often indicate network issues or overloaded API endpoints rather than authentication or permission problems.</p>
              <h3>Identifying timeout issues</h3>
              <p>Timeout issues typically manifest as connection errors after a waiting period. Error messages may include terms like "timeout," "connection refused," or "no response." System logs will show requests that started but never completed successfully.</p>
              <h3>Network and infrastructure troubleshooting</h3>
              <p>Address infrastructure issues by checking network connectivity, bandwidth limitations, firewall settings, and DNS resolution. Sometimes, timeouts are caused by network congestion or misconfigurations rather than API problems.</p>
              <h3>Request optimization and timeout management</h3>
              <p>Optimize requests by reducing payload sizes, implementing request chunking (breaking large operations into smaller ones), configuring appropriate timeout values, and implementing retry mechanisms with increasing timeout values for subsequent attempts.</p>
            `
          }
        ]
      },
      {
        id: "performance",
        title: "Platform Performance Issues",
        articles: [
          { 
            id: "slow-speeds", 
            title: "Slow migration speeds",
            content: `
              <h2>Slow migration speeds</h2>
              <p>Slow migration speeds can extend project timelines and delay business operations. QuillSwitch offers various optimization techniques to improve migration performance while maintaining data quality and reliability. Understanding performance factors helps you plan and execute more efficient migrations.</p>
              <p>Migration speed must be balanced with data quality and system stability concerns.</p>
              <h3>Identifying performance bottlenecks</h3>
              <p>Identify bottlenecks by analyzing migration logs, monitoring system resource usage (CPU, memory, network), checking data transfer rates at different stages, and comparing performance across different object types or data volumes.</p>
              <h3>Optimizing data selection and mapping</h3>
              <p>Optimize by migrating only necessary data (excluding historical or irrelevant records), streamlining data transformations, reducing complex lookups or calculations, and using bulk operations instead of record-by-record processing when possible.</p>
              <h3>Resource allocation and scheduling strategies</h3>
              <p>Improve resource utilization by scheduling migrations during off-peak hours, breaking large migrations into smaller batches, allocating appropriate system resources to migration tasks, and using parallel processing for independent data sets when available.</p>
            `
          },
          { 
            id: "loading-errors", 
            title: "Platform loading errors",
            content: `
              <h2>Platform loading errors</h2>
              <p>Platform loading errors occur when the QuillSwitch interface fails to load correctly or when specific components don't function as expected. These issues may be related to browser compatibility, network connectivity, or client-side resources.</p>
              <p>Most platform loading issues can be resolved with browser refreshes or cache clearing.</p>
              <h3>Common loading error symptoms</h3>
              <p>Common symptoms include blank pages, partially loaded interfaces, unresponsive buttons or controls, error messages in the browser console, or unexpected application behavior. Users may report that specific features don't work or display correctly.</p>
              <h3>Browser troubleshooting steps</h3>
              <p>Troubleshoot browser issues by refreshing the page, clearing browser cache and cookies, disabling browser extensions that might interfere, trying a different browser, and ensuring your browser is updated to a supported version.</p>
              <h3>Network and connectivity issues</h3>
              <p>Address connectivity issues by checking internet connection stability, verifying that your network allows access to all required domains and resources, and testing from different networks to determine if the issue is specific to your location.</p>
            `
          },
          { 
            id: "compatibility", 
            title: "Browser compatibility issues",
            content: `
              <h2>Browser compatibility issues</h2>
              <p>Browser compatibility issues occur when QuillSwitch features don't work correctly in specific browsers or versions. Understanding supported environments and troubleshooting browser-specific problems helps ensure a consistent experience across your organization.</p>
              <p>Using the latest version of a supported browser typically provides the best experience.</p>
              <h3>Supported browsers and versions</h3>
              <p>QuillSwitch officially supports the latest versions of Chrome, Firefox, Safari, and Edge. Older browsers or alternative browsers may work but aren't fully supported and might experience compatibility issues with certain features.</p>
              <h3>Common browser-specific issues</h3>
              <p>Common issues include rendering differences (layout, fonts, colors), feature availability variations, performance differences, and varying levels of support for modern web technologies used by QuillSwitch.</p>
              <h3>Cross-browser testing and resolution</h3>
              <p>Resolve browser issues by testing in multiple supported browsers to isolate browser-specific problems, updating to the latest browser versions, adjusting browser settings that might interfere with functionality, and reporting persistent browser-specific issues to QuillSwitch support.</p>
            `
          }
        ]
      }
    ]
  }
];
