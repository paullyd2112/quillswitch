
import React from "react";
import { LucideIcon } from "lucide-react";

export interface SystemConfig {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  authType: 'oauth' | 'api';
  connectionType: 'source' | 'destination' | 'related';
  apiKeyHelp?: string;
  connectionInstructions?: string;
  permissions?: string[];
  docsUrl?: string;
}

// Create a simple function to render system icons
const SystemIcon = ({ initial, color }: { initial: string; color: string }) => (
  <span className={`text-${color} font-medium`}>{initial}</span>
);

// CRM Systems
export const crmSystems: SystemConfig[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect to Salesforce CRM',
    icon: <SystemIcon initial="SF" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'source',
    permissions: [
      'Read contacts, leads, and opportunities',
      'Read account information',
      'Read custom objects',
      'Read user information'
    ],
    docsUrl: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect to Salesforce CRM',
    icon: <SystemIcon initial="SF" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'destination',
    permissions: [
      'Read/write contacts, leads, and opportunities',
      'Create and update account information',
      'Create and update custom objects',
      'Read user information'
    ],
    docsUrl: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Connect to HubSpot CRM',
    icon: <SystemIcon initial="HS" color="orange-600" />,
    authType: 'oauth',
    connectionType: 'source',
    permissions: [
      'Read contacts, companies, and deals',
      'Read marketing information',
      'Access custom properties'
    ],
    docsUrl: 'https://developers.hubspot.com/docs/api/overview'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Connect to HubSpot CRM',
    icon: <SystemIcon initial="HS" color="orange-600" />,
    authType: 'oauth',
    connectionType: 'destination',
    permissions: [
      'Read/write contacts, companies, and deals',
      'Create and update marketing information',
      'Create and update custom properties'
    ],
    docsUrl: 'https://developers.hubspot.com/docs/api/overview'
  },
  {
    id: 'dynamics',
    name: 'Microsoft Dynamics',
    description: 'Connect to Microsoft Dynamics 365',
    icon: <SystemIcon initial="MD" color="cyan-600" />,
    authType: 'oauth',
    connectionType: 'source',
    permissions: [
      'Read contacts, accounts, and opportunities',
      'Read custom entities',
      'Access user information'
    ]
  },
  {
    id: 'dynamics',
    name: 'Microsoft Dynamics',
    description: 'Connect to Microsoft Dynamics 365',
    icon: <SystemIcon initial="MD" color="cyan-600" />,
    authType: 'oauth',
    connectionType: 'destination',
    permissions: [
      'Read/write contacts, accounts, and opportunities',
      'Create and update custom entities',
      'Access user information'
    ]
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    description: 'Connect to Zoho CRM',
    icon: <SystemIcon initial="ZH" color="red-600" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your Zoho API key in your Zoho CRM account under Setup > Developer Space > API > Generate New Token.',
    connectionInstructions: 'Zoho requires an OAuth token for authentication. You will need to generate a self-client token from your Zoho account.'
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    description: 'Connect to Zoho CRM',
    icon: <SystemIcon initial="ZH" color="red-600" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your Zoho API key in your Zoho CRM account under Setup > Developer Space > API > Generate New Token.',
    connectionInstructions: 'Zoho requires an OAuth token for authentication. You will need to generate a self-client token from your Zoho account.'
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    description: 'Connect to Pipedrive CRM',
    icon: <SystemIcon initial="PD" color="green-600" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your Pipedrive API key in your Pipedrive account under Settings > Personal Preferences > API.',
    connectionInstructions: 'Ensure your Pipedrive account has admin permissions to access all required data.'
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    description: 'Connect to Pipedrive CRM',
    icon: <SystemIcon initial="PD" color="green-600" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your Pipedrive API key in your Pipedrive account under Settings > Personal Preferences > API.',
    connectionInstructions: 'Ensure your Pipedrive account has admin permissions to access all required data.'
  }
];

// Related Applications
export const relatedApps: SystemConfig[] = [
  {
    id: 'salesloft',
    name: 'SalesLoft',
    description: 'Connect to SalesLoft for sales engagement',
    icon: <SystemIcon initial="SL" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    apiKeyHelp: 'You can find your SalesLoft API key in your SalesLoft account under Settings > API Keys.',
    connectionInstructions: 'Ensure your SalesLoft account has admin permissions to access all required data.'
  },
  {
    id: 'marketo',
    name: 'Marketo',
    description: 'Connect to Marketo for marketing automation',
    icon: <SystemIcon initial="MK" color="purple-600" />,
    authType: 'api',
    connectionType: 'related',
    apiKeyHelp: 'You need both Client ID and Client Secret from your Marketo Admin area under Integration > LaunchPoint.',
    connectionInstructions: 'Marketo requires both a Client ID and Client Secret for API authentication.'
  },
  {
    id: 'outreach',
    name: 'Outreach',
    description: 'Connect to Outreach for sales engagement',
    icon: <SystemIcon initial="OR" color="green-500" />,
    authType: 'oauth',
    connectionType: 'related',
    permissions: [
      'Read prospect data',
      'Read sequence data',
      'Read account information'
    ]
  },
  {
    id: 'gong',
    name: 'Gong',
    description: 'Connect to Gong for conversation intelligence',
    icon: <SystemIcon initial="GG" color="yellow-600" />,
    authType: 'api',
    connectionType: 'related',
    apiKeyHelp: 'You can find your Gong API key in your Gong account under Admin > API Keys.',
    connectionInstructions: 'Ensure you have admin access to generate API keys in Gong.'
  },
  {
    id: 'zoominfo',
    name: 'ZoomInfo',
    description: 'Connect to ZoomInfo for B2B data',
    icon: <SystemIcon initial="ZI" color="blue-600" />,
    authType: 'api',
    connectionType: 'related',
    apiKeyHelp: 'Contact your ZoomInfo account representative to obtain API credentials.',
    connectionInstructions: 'ZoomInfo API access requires a specific subscription tier. Contact your account representative for details.'
  },
  {
    id: 'pardot',
    name: 'Pardot',
    description: 'Connect to Pardot for marketing automation',
    icon: <SystemIcon initial="PT" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'related',
    permissions: [
      'Read prospect data',
      'Read campaign data',
      'Access email templates'
    ]
  }
];
