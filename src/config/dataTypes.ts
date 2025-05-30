
export interface DataTypeOption {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'activity' | 'custom';
  estimatedSize?: 'small' | 'medium' | 'large';
}

export const DATA_TYPE_OPTIONS: DataTypeOption[] = [
  {
    id: "contacts",
    name: "Contacts & Leads",
    description: "All contact and lead information",
    category: "core",
    estimatedSize: "large"
  },
  {
    id: "accounts",
    name: "Accounts & Companies",
    description: "Organization information",
    category: "core",
    estimatedSize: "medium"
  },
  {
    id: "opportunities",
    name: "Opportunities & Deals",
    description: "Sales pipeline and deals",
    category: "core",
    estimatedSize: "medium"
  },
  {
    id: "cases",
    name: "Cases & Tickets",
    description: "Support cases and tickets",
    category: "activity",
    estimatedSize: "small"
  },
  {
    id: "activities",
    name: "Activities & Tasks",
    description: "Call logs, emails, and tasks",
    category: "activity",
    estimatedSize: "large"
  },
  {
    id: "custom",
    name: "Custom Objects",
    description: "Your custom data objects",
    category: "custom",
    estimatedSize: "medium"
  }
];

export const DATA_TYPE_CATEGORIES = {
  core: "Core CRM Data",
  activity: "Activities & Communication",
  custom: "Custom Objects & Fields"
};
