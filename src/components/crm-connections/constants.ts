
import { CrmProvider } from "./types";

export const CRM_PROVIDERS: CrmProvider[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Secure OAuth integration powered by Nango - enterprise-ready",
    icon: "⚡"
  },
  {
    id: "hubspot",
    name: "HubSpot", 
    description: "Connect your HubSpot account via secure OAuth integration",
    icon: "🟠"
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Connect your Pipedrive account via secure OAuth integration",
    icon: "🟢"
  }
];
