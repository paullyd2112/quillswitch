
import React from "react";

export type SystemCategory = "crm" | "sales-engagement" | "marketing-automation" | "support" | "productivity" | "analytics" | "finance" | "data-enrichment" | "e-signature" | "connectivity";

export interface SystemConfig {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  authType: 'oauth' | 'api';
  connectionType: 'source' | 'destination' | 'related';
  category?: SystemCategory;
  popular?: boolean;
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
    popular: true,
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
    popular: true,
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
    popular: true,
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
    popular: true,
    permissions: [
      'Read/write contacts, companies, and deals',
      'Create and update marketing information',
      'Create and update custom properties'
    ],
    docsUrl: 'https://developers.hubspot.com/docs/api/overview'
  },
  {
    id: 'dynamics',
    name: 'Microsoft Dynamics 365',
    description: 'Connect to Microsoft Dynamics 365',
    icon: <SystemIcon initial="MD" color="cyan-600" />,
    authType: 'oauth',
    connectionType: 'source',
    popular: true,
    permissions: [
      'Read contacts, accounts, and opportunities',
      'Read custom entities',
      'Access user information'
    ]
  },
  {
    id: 'dynamics',
    name: 'Microsoft Dynamics 365',
    description: 'Connect to Microsoft Dynamics 365',
    icon: <SystemIcon initial="MD" color="cyan-600" />,
    authType: 'oauth',
    connectionType: 'destination',
    popular: true,
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
    popular: true,
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
    popular: true,
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
    popular: true,
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
    popular: true,
    apiKeyHelp: 'You can find your Pipedrive API key in your Pipedrive account under Settings > Personal Preferences > API.',
    connectionInstructions: 'Ensure your Pipedrive account has admin permissions to access all required data.'
  },
  // Additional CRMs
  {
    id: 'monday',
    name: 'Monday Sales CRM',
    description: 'Connect to Monday Sales CRM',
    icon: <SystemIcon initial="MO" color="blue-500" />,
    authType: 'api',
    connectionType: 'source',
    popular: false,
    apiKeyHelp: 'You can find your Monday.com API key in Admin > API.'
  },
  {
    id: 'monday',
    name: 'Monday Sales CRM',
    description: 'Connect to Monday Sales CRM',
    icon: <SystemIcon initial="MO" color="blue-500" />,
    authType: 'api',
    connectionType: 'destination',
    popular: false,
    apiKeyHelp: 'You can find your Monday.com API key in Admin > API.'
  },
  {
    id: 'freshsales',
    name: 'Freshsales',
    description: 'Connect to Freshsales CRM',
    icon: <SystemIcon initial="FS" color="green-500" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your Freshsales API key in Administration > API Settings.'
  },
  {
    id: 'freshsales',
    name: 'Freshsales',
    description: 'Connect to Freshsales CRM',
    icon: <SystemIcon initial="FS" color="green-500" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your Freshsales API key in Administration > API Settings.'
  }
];

// Related Applications
export const relatedApps: SystemConfig[] = [
  // Sales Engagement
  {
    id: 'salesloft',
    name: 'SalesLoft',
    description: 'Connect to SalesLoft for sales engagement',
    icon: <SystemIcon initial="SL" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'sales-engagement',
    popular: true,
    apiKeyHelp: 'You can find your SalesLoft API key in your SalesLoft account under Settings > API Keys.',
    connectionInstructions: 'Ensure your SalesLoft account has admin permissions to access all required data.'
  },
  {
    id: 'outreach',
    name: 'Outreach',
    description: 'Connect to Outreach for sales engagement',
    icon: <SystemIcon initial="OR" color="green-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'sales-engagement',
    popular: true,
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
    category: 'sales-engagement',
    apiKeyHelp: 'You can find your Gong API key in your Gong account under Admin > API Keys.',
    connectionInstructions: 'Ensure you have admin access to generate API keys in Gong.'
  },
  
  // Marketing Automation
  {
    id: 'marketo',
    name: 'Marketo',
    description: 'Connect to Marketo for marketing automation',
    icon: <SystemIcon initial="MK" color="purple-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'marketing-automation',
    popular: true,
    apiKeyHelp: 'You need both Client ID and Client Secret from your Marketo Admin area under Integration > LaunchPoint.',
    connectionInstructions: 'Marketo requires both a Client ID and Client Secret for API authentication.'
  },
  {
    id: 'pardot',
    name: 'Pardot',
    description: 'Connect to Pardot for marketing automation',
    icon: <SystemIcon initial="PT" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'marketing-automation',
    popular: true,
    permissions: [
      'Read prospect data',
      'Read campaign data',
      'Access email templates'
    ]
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Connect to Mailchimp for email marketing',
    icon: <SystemIcon initial="MC" color="yellow-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'marketing-automation',
    popular: true
  },
  
  // Data Enrichment
  {
    id: 'zoominfo',
    name: 'ZoomInfo',
    description: 'Connect to ZoomInfo for B2B data',
    icon: <SystemIcon initial="ZI" color="blue-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'data-enrichment',
    popular: true,
    apiKeyHelp: 'Contact your ZoomInfo account representative to obtain API credentials.',
    connectionInstructions: 'ZoomInfo API access requires a specific subscription tier. Contact your account representative for details.'
  },
  
  // Connectivity
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect Zapier for workflow automation',
    icon: <SystemIcon initial="ZP" color="orange-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'connectivity',
    popular: true
  },
  {
    id: 'make',
    name: 'Make (formerly Integromat)',
    description: 'Connect to Make for workflow automation',
    icon: <SystemIcon initial="MK" color="purple-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'connectivity'
  },
  
  // Support
  {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Connect to Zendesk for customer support',
    icon: <SystemIcon initial="ZD" color="green-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'support',
    popular: true
  },
  
  // Productivity
  {
    id: 'slack',
    name: 'Slack',
    description: 'Connect to Slack for team communication',
    icon: <SystemIcon initial="SL" color="green-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'productivity',
    popular: true
  }
];
