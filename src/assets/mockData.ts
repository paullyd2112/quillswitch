
import { KnowledgeArticle } from "@/types/knowledge";
import { MigrationProject } from "@/integrations/supabase/migrationTypes";

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

// No mock migrations - real user data only
export const mockMigrations: MigrationProject[] = [];
