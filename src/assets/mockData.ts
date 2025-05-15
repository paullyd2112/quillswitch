import { KnowledgeArticle } from "@/types/knowledge";

export const mockKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: "1",
    title: "Getting Started with Data Migrations",
    content: "Learn the basics of migrating data between different systems.",
    author: "John Doe",
    createdAt: "2023-01-15",
    tags: ["migration", "data", "basics"],
  },
  {
    id: "2",
    title: "Troubleshooting Common Migration Errors",
    content: "A guide to resolving frequent issues during data migration.",
    author: "Jane Smith",
    createdAt: "2023-02-20",
    tags: ["migration", "errors", "troubleshooting"],
  },
  {
    id: "3",
    title: "Best Practices for CRM Data Migration",
    content: "Optimize your CRM data migration with these expert tips.",
    author: "Alice Johnson",
    createdAt: "2023-03-10",
    tags: ["crm", "migration", "best practices"],
  },
];

// Properly define the MigrationProject type for the mockMigrations data
import { MigrationProject } from "@/integrations/supabase/migrationTypes";

// Mock data for migrations
// Add the mockMigrations data with proper typing for the status field
export const mockMigrations: MigrationProject[] = [
  {
    id: '1',
    user_id: 'user123',
    company_name: 'Acme Inc',
    source_crm: 'HubSpot',
    destination_crm: 'Salesforce',
    migration_strategy: 'Full Migration',
    status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    total_objects: 1250,
    migrated_objects: 1250,
    failed_objects: 0
  },
  {
    id: '2',
    user_id: 'user123',
    company_name: 'TechCorp',
    source_crm: 'ActiveCampaign',
    destination_crm: 'MailChimp',
    migration_strategy: 'Selective Migration',
    status: "in_progress",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: null,
    total_objects: 850,
    migrated_objects: 425,
    failed_objects: 10
  },
  {
    id: '3',
    user_id: 'user123',
    company_name: 'StartupXYZ',
    source_crm: 'Zoho',
    destination_crm: 'HubSpot',
    migration_strategy: 'Incremental Migration',
    status: "failed",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    completed_at: null,
    total_objects: 340,
    migrated_objects: 112,
    failed_objects: 228
  }
];
