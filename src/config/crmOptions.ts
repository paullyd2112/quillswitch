
import { CrmSystem } from "@/types/setupWizard";

export const sourceCrmOptions: CrmSystem[] = [
  { id: 'salesforce', name: 'Salesforce', description: 'Dominant market leader', popular: true },
  { id: 'dynamics', name: 'Microsoft Dynamics 365', description: 'Strong in the enterprise space', popular: true },
  { id: 'hubspot', name: 'HubSpot CRM', description: 'Popular with SMBs, known for inbound marketing', popular: true },
  { id: 'zoho', name: 'Zoho CRM', description: 'Cost-effective, feature-rich option', popular: true },
  { id: 'oracle', name: 'Oracle CX', description: 'Enterprise-level CRM integrated with Oracle products', popular: true },
  { id: 'sap', name: 'SAP CRM', description: 'Enterprise solutions integrated with SAP ERP' },
  { id: 'pipedrive', name: 'Pipedrive', description: 'Sales-focused with pipeline management', popular: true },
  { id: 'monday', name: 'Monday.com', description: 'Work OS platform with CRM capabilities' },
  { id: 'freshsales', name: 'Freshsales', description: 'AI-powered CRM with user-friendly interface' },
  { id: 'zendesk', name: 'Zendesk Sell', description: 'Sales CRM focused on productivity' },
  { id: 'sugar', name: 'SugarCRM', description: 'Flexible and customizable CRM' },
  { id: 'close', name: 'Close.io', description: 'Built for inside sales teams' },
  { id: 'insightly', name: 'Insightly', description: 'CRM for project management and sales' },
  { id: 'copper', name: 'Copper CRM', description: 'Integrates with Google Workspace' },
  { id: 'keap', name: 'Keap', description: 'CRM and marketing automation for small businesses' },
  { id: 'nutshell', name: 'Nutshell', description: 'Simple CRM for small to mid sized business' },
  { id: 'apptivo', name: 'Apptivo CRM', description: 'Suite of business apps with adaptable CRM' },
  { id: 'salesflare', name: 'Salesflare', description: 'CRM that automates data entry' },
  { id: 'custom', name: 'Custom/Other CRM', description: 'Specify your own CRM system' }
];

// Update destination options to match source options
export const destinationCrmOptions: CrmSystem[] = [
  { id: 'salesforce', name: 'Salesforce', apiKeyLabel: 'Salesforce API Key', apiKeyHelp: 'Your API key can be found in Salesforce Setup > Apps > App Manager > Your Connected App > Manage Consumer Details', popular: true },
  { id: 'hubspot', name: 'HubSpot', apiKeyLabel: 'HubSpot API Key', apiKeyHelp: 'Your API key can be found in HubSpot > Settings > Integrations > API Keys', popular: true },
  { id: 'dynamics', name: 'Microsoft Dynamics 365', apiKeyLabel: 'Dynamics API Key', apiKeyHelp: 'Your API key can be found in Settings > Customizations > Developer Resources', popular: true },
  { id: 'zoho', name: 'Zoho CRM', apiKeyLabel: 'Zoho API Key', apiKeyHelp: 'Your API key can be generated in Setup > Developer Space > API > Generate New Token', popular: true },
  { id: 'oracle', name: 'Oracle CX', apiKeyLabel: 'Oracle API Key', apiKeyHelp: 'Your API key can be found in Oracle Cloud Account > User Settings > API Keys', popular: true },
  { id: 'sap', name: 'SAP CRM', apiKeyLabel: 'SAP API Key', apiKeyHelp: 'Your API key can be obtained from your SAP administrator' },
  { id: 'pipedrive', name: 'Pipedrive', apiKeyLabel: 'Pipedrive API Key', apiKeyHelp: 'Your API key can be found in Settings > Personal > API', popular: true },
  { id: 'monday', name: 'Monday Sales CRM', apiKeyLabel: 'Monday API Key', apiKeyHelp: 'Your API key can be found in Admin > API', popular: true },
  { id: 'freshsales', name: 'Freshsales', apiKeyLabel: 'Freshsales API Key', apiKeyHelp: 'Your API key can be found in Settings > API Settings' },
  { id: 'zendesk', name: 'Zendesk Sell', apiKeyLabel: 'Zendesk API Key', apiKeyHelp: 'Your API key can be found in Settings > Global Settings > API' },
  { id: 'sugar', name: 'SugarCRM', apiKeyLabel: 'SugarCRM API Key', apiKeyHelp: 'Your API key can be generated in Admin > Password Management' },
  { id: 'close', name: 'Close.io', apiKeyLabel: 'Close.io API Key', apiKeyHelp: 'Your API key can be found in Settings > API Keys' },
  { id: 'insightly', name: 'Insightly', apiKeyLabel: 'Insightly API Key', apiKeyHelp: 'Your API key can be found in User Settings > API Key' },
  { id: 'copper', name: 'Copper CRM', apiKeyLabel: 'Copper API Key', apiKeyHelp: 'Your API key can be found in Settings > API Keys' },
  { id: 'keap', name: 'Keap', apiKeyLabel: 'Keap API Key', apiKeyHelp: 'Your API key can be found in Admin > API > OAuth Keys' },
  { id: 'nutshell', name: 'Nutshell', apiKeyLabel: 'Nutshell API Key', apiKeyHelp: 'Your API key can be found in Settings > API Keys' },
  { id: 'apptivo', name: 'Apptivo CRM', apiKeyLabel: 'Apptivo API Key', apiKeyHelp: 'Your API key can be found in Settings > API' },
  { id: 'salesflare', name: 'Salesflare', apiKeyLabel: 'Salesflare API Key', apiKeyHelp: 'Your API key can be found in Settings > API Access' },
  { id: 'custom', name: 'Custom/Other CRM', apiKeyLabel: 'API Key', apiKeyHelp: 'Enter the API key for your CRM system' }
];
