export const onboardingFlows = [
  {
    id: "flow-1",
    title: "SaaS Product Onboarding",
    description: "Welcome new users and introduce key features of your SaaS application",
    status: "active" as "active" | "draft" | "archived",
    usagePercent: 78,
    users: 1243,
    lastUpdated: "2 days ago",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "flow-2",
    title: "New Feature Introduction",
    description: "Guide users through your new analytics dashboard features",
    status: "active" as "active" | "draft" | "archived",
    usagePercent: 45,
    users: 876,
    lastUpdated: "5 days ago",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "flow-3",
    title: "Account Administrator Training",
    description: "Comprehensive training flow for system administrators",
    status: "draft" as "active" | "draft" | "archived",
    usagePercent: 0,
    users: 0,
    lastUpdated: "2 weeks ago",
  },
  {
    id: "flow-4",
    title: "User Permissions Walkthrough",
    description: "Help users understand role-based access control",
    status: "archived" as "active" | "draft" | "archived",
    usagePercent: 12,
    users: 124,
    lastUpdated: "1 month ago",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "flow-5",
    title: "Marketing Platform Overview",
    description: "Introduce the core features of your marketing automation platform",
    status: "active" as "active" | "draft" | "archived",
    usagePercent: 63,
    users: 547,
    lastUpdated: "3 days ago",
    thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "flow-6",
    title: "Customer Support Training",
    description: "Onboard new support agents with comprehensive training modules",
    status: "draft" as "active" | "draft" | "archived",
    usagePercent: 0,
    users: 0,
    lastUpdated: "1 week ago",
  }
];

export const onboardingTemplates = [
  {
    id: "template-1",
    title: "SaaS User Onboarding",
    description: "A complete onboarding flow for new SaaS users, introducing key features and functions",
    category: "User Onboarding",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isNew: true
  },
  {
    id: "template-2",
    title: "Feature Announcement",
    description: "Introduce new features to existing users with interactive walkthroughs",
    category: "Feature Release",
    thumbnail: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "template-3",
    title: "Admin Console Training",
    description: "Comprehensive training for administrators on using your platform",
    category: "Administrator",
    thumbnail: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "template-4",
    title: "Role-Based Permissions Guide",
    description: "Help users understand different permission levels and role-based access",
    category: "Security",
    thumbnail: "https://images.unsplash.com/photo-1617529497471-9218633199c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isNew: true
  },
  {
    id: "template-5",
    title: "Mobile App Walkthrough",
    description: "Guide users through your mobile application features and functionality",
    category: "Mobile",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "template-6",
    title: "Data Import Wizard",
    description: "Step-by-step guide for importing data into your platform",
    category: "Data Management",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "template-7",
    title: "API Integration Guide",
    description: "Technical walkthrough for developers integrating with your API",
    category: "Developer",
    thumbnail: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "template-8",
    title: "Workflow Automation",
    description: "Training on setting up and managing automated workflows",
    category: "Automation",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const featureHighlights = [
  {
    title: "Interactive Tutorials",
    description: "Create engaging step-by-step tutorials with interactive elements",
    icon: "Sparkles"
  },
  {
    title: "Personalized Flows",
    description: "Customize onboarding experiences based on user roles and needs",
    icon: "Users"
  },
  {
    title: "Progress Tracking",
    description: "Monitor user progress and completion rates with detailed analytics",
    icon: "LineChart"
  },
  {
    title: "Multi-platform Support",
    description: "Deploy onboarding flows across web, mobile, and desktop applications",
    icon: "Layers"
  },
  {
    title: "Integration Ready",
    description: "Connect with your existing tools and platforms via robust APIs",
    icon: "Link"
  },
  {
    title: "Knowledge Assessment",
    description: "Verify learning with quizzes and interactive challenges",
    icon: "CheckCircle"
  }
];

// Add the mockMigrations data that's being imported in MigrationsList.tsx
export const mockMigrations = [
  {
    id: '1',
    user_id: 'user-1',
    company_name: 'Acme Corp',
    source_crm: 'HubSpot',
    destination_crm: 'Salesforce',
    migration_strategy: 'Full Migration',
    status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    total_objects: 100,
    migrated_objects: 100,
    failed_objects: 0
  },
  {
    id: '2',
    user_id: 'user-1',
    company_name: 'Beta Inc',
    source_crm: 'ActiveCampaign',
    destination_crm: 'MailChimp',
    migration_strategy: 'Selective Migration',
    status: "in_progress",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: null,
    total_objects: 200,
    migrated_objects: 130,
    failed_objects: 0
  },
  {
    id: '3',
    user_id: 'user-1',
    company_name: 'Gamma LLC',
    source_crm: 'Zoho',
    destination_crm: 'HubSpot',
    migration_strategy: 'Incremental Migration',
    status: "failed",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    completed_at: null,
    total_objects: 150,
    migrated_objects: 45,
    failed_objects: 10
  }
];
