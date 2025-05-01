
import { SystemCategory } from "@/config/types/connectionTypes";

export type ReconnectionCapability = "full" | "partial" | "basic" | "manual";

export interface ReconnectionInfo {
  capability: ReconnectionCapability;
  label: string;
  icon: string;
  description: string;
  color: string;
}

const reconnectionInfoMap: Record<ReconnectionCapability, ReconnectionInfo> = {
  full: {
    capability: "full",
    label: "Full Auto-Reconnection",
    icon: "check",
    description: "This tool can be completely auto-reconnected after migration",
    color: "text-green-600 dark:text-green-400"
  },
  partial: {
    capability: "partial",
    label: "Partial Auto-Reconnection",
    icon: "alert-circle",
    description: "Some configuration may need manual review after migration",
    color: "text-amber-600 dark:text-amber-400"
  },
  basic: {
    capability: "basic",
    label: "Basic Reconnection",
    icon: "info",
    description: "Credentials will be transferred, but manual configuration is needed",
    color: "text-blue-600 dark:text-blue-400"
  },
  manual: {
    capability: "manual",
    label: "Manual Reconnection Required",
    icon: "alert-circle",
    description: "This tool requires manual reconnection after migration",
    color: "text-red-600 dark:text-red-400"
  }
};

export { reconnectionInfoMap };

// Map specific tools to their reconnection capabilities
const specificToolMap: Record<string, ReconnectionCapability> = {
  // CRM systems with known capabilities
  salesforce: "full",
  hubspot: "full",
  dynamics: "partial",
  zoho: "partial",
  pipedrive: "full",
  monday: "basic",
  freshsales: "partial",
  activecampaign: "basic",
  netsuite: "partial",
  copper: "basic",
  keap: "basic",
  "zendesk-sell": "partial",
  sugarcrm: "partial",
  creatio: "manual",
  "less-annoying": "basic",
  capsule: "basic",
  nutshell: "basic",
  bitrix24: "partial",
  engagebay: "basic",
  clickup: "manual",
  odoo: "manual",
  salesflare: "basic",
  apptivo: "manual",
  agilecrm: "basic",
  planfix: "manual"
};

// Category-based default capabilities based on detailed analysis
const categoryCapabilityMap: Record<SystemCategory, ReconnectionCapability> = {
  crm: "partial", // Most CRMs have good API capabilities
  "sales-engagement": "basic", // Sales tools typically need more manual config
  "marketing-automation": "basic", // Marketing tools often need field mapping
  support: "basic", // Support tools can be reconnected at basic level
  productivity: "manual", // Productivity often requires manual steps
  analytics: "manual", // BI tools almost always need manual reconnection
  finance: "manual", // Finance/accounting needs careful manual setup
  "data-enrichment": "basic", // Data tools often just need API key updates
  "e-signature": "basic", // E-signature often just needs API key updates
  connectivity: "manual" // iPaaS platforms need manual workflow updates
};

/**
 * Determine the reconnection capability for a specific tool
 */
export const getReconnectionCapability = (toolId: string, category?: SystemCategory): ReconnectionCapability => {
  // First check if we have a specific mapping for this tool
  if (specificToolMap[toolId]) {
    return specificToolMap[toolId];
  }
  
  // If not, use category-based default if available
  if (category && categoryCapabilityMap[category]) {
    return categoryCapabilityMap[category];
  }
  
  // Default to manual if we don't have specific information
  return "manual";
};
