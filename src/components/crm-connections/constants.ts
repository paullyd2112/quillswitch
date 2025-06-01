
import { CrmProvider } from "./types";

export const CRM_PROVIDERS: CrmProvider[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect your Salesforce account to import contacts, opportunities and more",
    icon: "🏢"
  },
  {
    id: "hubspot",
    name: "HubSpot", 
    description: "Connect your HubSpot account to import contacts, deals and more",
    icon: "🟠"
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    description: "Connect your Zoho CRM to import contacts, deals and more", 
    icon: "🔴"
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Connect your Pipedrive account to import leads, deals and more",
    icon: "🟢"
  }
];
