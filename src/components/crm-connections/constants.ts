
import { CrmProvider } from "./types";
import salesforceLogo from "@/assets/salesforce-logo.png";
import hubspotLogo from "@/assets/hubspot-logo.png";
import pipedriveLogo from "@/assets/pipedrive-official-logo.svg";

export const CRM_PROVIDERS: CrmProvider[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Secure OAuth integration powered by Nango - enterprise-ready",
    icon: salesforceLogo
  },
  {
    id: "hubspot",
    name: "HubSpot", 
    description: "Connect your HubSpot account via secure OAuth integration",
    icon: hubspotLogo
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Connect your Pipedrive account via secure OAuth integration",
    icon: pipedriveLogo
  }
];
