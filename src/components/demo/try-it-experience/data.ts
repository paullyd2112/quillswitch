
import { CrmSystem, DataType } from "./types";

export const crmSystems: CrmSystem[] = [
  { id: "salesforce", name: "Salesforce", logo: "sf-logo", isConnected: false },
  { id: "hubspot", name: "HubSpot", logo: "hs-logo", isConnected: false },
  { id: "zoho", name: "Zoho CRM", logo: "zoho-logo", isConnected: false },
  { id: "pipedrive", name: "Pipedrive", logo: "pd-logo", isConnected: false },
  { id: "dynamicscrm", name: "Dynamics 365", logo: "ms-logo", isConnected: false },
  { id: "sugarcrm", name: "SugarCRM", logo: "sugar-logo", isConnected: false }
];

export const dataTypes: DataType[] = [
  { id: "contacts", name: "Contacts", count: 8500, selected: true },
  { id: "companies", name: "Companies", count: 2000, selected: true },
  { id: "deals", name: "Deals/Opportunities", count: 3200, selected: true },
  { id: "activities", name: "Activities & Tasks", count: 4800, selected: false },
  { id: "custom", name: "Custom Objects", count: 1500, selected: false }
];
