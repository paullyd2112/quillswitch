
import { SystemCategory } from "@/config/types/connectionTypes";

export type ReconnectionCapability = "full" | "partial";

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
    label: "Full Auto-Reconnect",
    icon: "check",
    description: "This tool will be automatically reconnected to your new CRM with no manual setup required",
    color: "text-green-600 dark:text-green-400"
  },
  partial: {
    capability: "partial",
    label: "Assisted Reconnect",
    icon: "alert-circle",
    description: "QuillSwitch will handle the reconnection with some guided configuration steps",
    color: "text-amber-600 dark:text-amber-400"
  }
};

export { reconnectionInfoMap };

// Map specific tools to their reconnection capabilities
const specificToolMap: Record<string, ReconnectionCapability> = {
  // Tools with excellent API support - Full Auto-Reconnect
  salesforce: "full",
  hubspot: "full",
  pipedrive: "full",
  zapier: "full",
  slack: "full",
  stripe: "full",
  
  // Tools with good API support but need some configuration - Assisted Reconnect
  dynamics: "partial",
  zoho: "partial",
  freshsales: "partial",
  "zendesk-sell": "partial",
  activecampaign: "partial",
  netsuite: "partial",
  sugarcrm: "partial",
  creatio: "partial",
  bitrix24: "partial",
  
  // Tools with basic API support - Assisted Reconnect
  monday: "partial",
  copper: "partial",
  keap: "partial",
  "less-annoying": "partial",
  capsule: "partial",
  nutshell: "partial",
  engagebay: "partial",
  clickup: "partial",
  odoo: "partial",
  salesflare: "partial",
  apptivo: "partial",
  agilecrm: "partial",
  planfix: "partial"
};

// Category-based default capabilities - simplified to two tiers
const categoryCapabilityMap: Record<SystemCategory, ReconnectionCapability> = {
  crm: "full", // Most modern CRMs have excellent API capabilities
  "sales-engagement": "partial", // Sales tools often need guided configuration
  "marketing-automation": "partial", // Marketing tools need field mapping assistance
  support: "partial", // Support tools can be reconnected with guidance
  productivity: "partial", // Productivity tools need configuration assistance
  analytics: "partial", // BI tools need guided reconnection
  finance: "partial", // Finance/accounting needs careful guided setup
  "data-enrichment": "full", // Data tools often just need API key updates
  "e-signature": "full", // E-signature often just needs API key updates
  connectivity: "partial" // iPaaS platforms need guided workflow updates
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
  
  // Default to assisted reconnect if we don't have specific information
  return "partial";
};
