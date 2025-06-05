
import { Connector } from "@/types/connectors";

export const connectors: Connector[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect and sync data with Salesforce CRM platform",
    logoUrl: "",
    category: "crm",
    popular: true,
    features: [
      { id: "contacts", name: "Contacts Sync", description: "Bi-directional contact synchronization" },
      { id: "accounts", name: "Accounts Sync", description: "Sync account data between systems" },
      { id: "opportunities", name: "Opportunities", description: "Track sales opportunities" }
    ],
    useCases: ["Customer data migration", "Sales pipeline integration", "Marketing automation"],
    setupComplexity: "moderate",
    documentationUrl: "#",
    apiVersion: "v53.0"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Integrate with HubSpot's marketing, sales, and service tools",
    logoUrl: "",
    category: "marketing",
    popular: true,
    features: [
      { id: "contacts", name: "Contacts Sync", description: "Maintain consistent contact records" },
      { id: "campaigns", name: "Marketing Campaigns", description: "Sync campaign performance data" },
      { id: "forms", name: "Forms Integration", description: "Capture and process form submissions" }
    ],
    useCases: ["Lead generation integration", "Marketing campaign tracking", "Customer engagement metrics"],
    setupComplexity: "simple",
    documentationUrl: "#"
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send notifications and updates to Slack channels",
    logoUrl: "",
    category: "communication",
    popular: true,
    features: [
      { id: "notifications", name: "Real-time Notifications", description: "Send alerts for important events" },
      { id: "commands", name: "Slash Commands", description: "Execute actions directly from Slack" },
      { id: "reports", name: "Report Delivery", description: "Schedule and deliver reports to channels" }
    ],
    useCases: ["Team notifications", "Workflow automation", "Customer support alerts"],
    setupComplexity: "simple",
    documentationUrl: "#"
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track and visualize user behavior data",
    logoUrl: "",
    category: "analytics",
    popular: false,
    features: [
      { id: "tracking", name: "Event Tracking", description: "Track custom events and user actions" },
      { id: "reports", name: "Analytics Reports", description: "Generate and export analytics reports" }
    ],
    useCases: ["User behavior analysis", "Conversion tracking", "Marketing campaign analysis"],
    setupComplexity: "moderate",
    documentationUrl: "#",
    apiVersion: "v4"
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Process payments and manage subscriptions",
    logoUrl: "",
    category: "payment",
    popular: true,
    features: [
      { id: "payments", name: "Payment Processing", description: "Handle one-time and recurring payments" },
      { id: "subscriptions", name: "Subscription Management", description: "Create and manage customer subscriptions" },
      { id: "invoicing", name: "Automated Invoicing", description: "Generate and send professional invoices" }
    ],
    useCases: ["Online payments", "Subscription management", "Marketplace payment processing"],
    setupComplexity: "moderate",
    documentationUrl: "#"
  },
  {
    id: "microsoft-dynamics",
    name: "Microsoft Dynamics 365",
    description: "Enterprise-level CRM and ERP integration",
    logoUrl: "",
    category: "crm",
    popular: false,
    features: [
      { id: "contacts", name: "Contacts Sync", description: "Sync contacts with Dynamics 365" },
      { id: "accounts", name: "Business Units", description: "Map to Dynamics business units" },
      { id: "sales", name: "Sales Process", description: "Integrate with the Dynamics sales process" }
    ],
    useCases: ["Enterprise data integration", "Sales team enablement", "Customer service management"],
    setupComplexity: "complex",
    documentationUrl: "#"
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with 3,000+ apps through the Zapier platform",
    logoUrl: "",
    category: "productivity",
    popular: true,
    features: [
      { id: "zaps", name: "Automated Zaps", description: "Create automated workflows between apps" },
      { id: "triggers", name: "Custom Triggers", description: "Trigger actions based on events in your app" }
    ],
    useCases: ["Workflow automation", "Multi-app integration", "Data synchronization"],
    setupComplexity: "simple",
    documentationUrl: "#"
  },
  {
    id: "aws-s3",
    name: "AWS S3",
    description: "Store and retrieve files on Amazon S3",
    logoUrl: "",
    category: "storage",
    popular: false,
    features: [
      { id: "upload", name: "File Upload", description: "Securely upload files to S3 buckets" },
      { id: "access", name: "Managed Access", description: "Control access to stored files" },
      { id: "backup", name: "Automated Backup", description: "Schedule and manage data backups" }
    ],
    useCases: ["Document storage", "Media management", "Data backup and archiving"],
    setupComplexity: "moderate",
    documentationUrl: "#"
  }
];
