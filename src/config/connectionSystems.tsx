
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
  // Original systems
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
  },
  
  // Adding additional CRM systems
  {
    id: 'activecampaign',
    name: 'ActiveCampaign',
    description: 'Connect to ActiveCampaign CRM and marketing automation',
    icon: <SystemIcon initial="AC" color="blue-500" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your ActiveCampaign API key in Settings > Developer'
  },
  {
    id: 'activecampaign',
    name: 'ActiveCampaign',
    description: 'Connect to ActiveCampaign CRM and marketing automation',
    icon: <SystemIcon initial="AC" color="blue-500" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your ActiveCampaign API key in Settings > Developer'
  },
  {
    id: 'netsuite',
    name: 'NetSuite CRM',
    description: 'Connect to NetSuite CRM',
    icon: <SystemIcon initial="NS" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'source',
    permissions: [
      'Read contacts, customers, and opportunities',
      'Read transaction information',
      'Access custom records'
    ]
  },
  {
    id: 'netsuite',
    name: 'NetSuite CRM',
    description: 'Connect to NetSuite CRM',
    icon: <SystemIcon initial="NS" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'destination',
    permissions: [
      'Read/write contacts, customers, and opportunities',
      'Create and update transaction information',
      'Create and update custom records'
    ]
  },
  {
    id: 'copper',
    name: 'Copper',
    description: 'Connect to Copper CRM',
    icon: <SystemIcon initial="CP" color="orange-500" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your Copper API key in Settings > Integrations > API Keys'
  },
  {
    id: 'copper',
    name: 'Copper',
    description: 'Connect to Copper CRM',
    icon: <SystemIcon initial="CP" color="orange-500" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your Copper API key in Settings > Integrations > API Keys'
  },
  {
    id: 'keap',
    name: 'Keap (Infusionsoft)',
    description: 'Connect to Keap CRM and marketing automation',
    icon: <SystemIcon initial="KP" color="green-500" />,
    authType: 'oauth',
    connectionType: 'source',
    permissions: [
      'Read contacts and companies',
      'Read marketing campaigns',
      'Access e-commerce data'
    ]
  },
  {
    id: 'keap',
    name: 'Keap (Infusionsoft)',
    description: 'Connect to Keap CRM and marketing automation',
    icon: <SystemIcon initial="KP" color="green-500" />,
    authType: 'oauth',
    connectionType: 'destination',
    permissions: [
      'Read/write contacts and companies',
      'Create and update marketing campaigns',
      'Access e-commerce data'
    ]
  },
  {
    id: 'zendesk-sell',
    name: 'Zendesk Sell',
    description: 'Connect to Zendesk Sell CRM',
    icon: <SystemIcon initial="ZS" color="green-600" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your Zendesk Sell API key in Admin > Apps > API'
  },
  {
    id: 'zendesk-sell',
    name: 'Zendesk Sell',
    description: 'Connect to Zendesk Sell CRM',
    icon: <SystemIcon initial="ZS" color="green-600" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your Zendesk Sell API key in Admin > Apps > API'
  },
  {
    id: 'sugarcrm',
    name: 'SugarCRM',
    description: 'Connect to SugarCRM',
    icon: <SystemIcon initial="SU" color="purple-500" />,
    authType: 'oauth',
    connectionType: 'source',
    permissions: [
      'Read contacts, accounts, and leads',
      'Read opportunity data',
      'Access custom modules'
    ]
  },
  {
    id: 'sugarcrm',
    name: 'SugarCRM',
    description: 'Connect to SugarCRM',
    icon: <SystemIcon initial="SU" color="purple-500" />,
    authType: 'oauth',
    connectionType: 'destination',
    permissions: [
      'Read/write contacts, accounts, and leads',
      'Create and update opportunity data',
      'Access custom modules'
    ]
  },
  {
    id: 'creatio',
    name: 'Creatio',
    description: 'Connect to Creatio CRM',
    icon: <SystemIcon initial="CR" color="blue-500" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'Contact your Creatio administrator for API credentials'
  },
  {
    id: 'creatio',
    name: 'Creatio',
    description: 'Connect to Creatio CRM',
    icon: <SystemIcon initial="CR" color="blue-500" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'Contact your Creatio administrator for API credentials'
  },
  {
    id: 'less-annoying',
    name: 'Less Annoying CRM',
    description: 'Connect to Less Annoying CRM',
    icon: <SystemIcon initial="LA" color="cyan-500" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your Less Annoying CRM API key in Settings > API'
  },
  {
    id: 'less-annoying',
    name: 'Less Annoying CRM',
    description: 'Connect to Less Annoying CRM',
    icon: <SystemIcon initial="LA" color="cyan-500" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your Less Annoying CRM API key in Settings > API'
  },
  {
    id: 'capsule',
    name: 'Capsule CRM',
    description: 'Connect to Capsule CRM',
    icon: <SystemIcon initial="CP" color="red-500" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your Capsule API key in My Preferences > API Authentication Tokens'
  },
  {
    id: 'capsule',
    name: 'Capsule CRM',
    description: 'Connect to Capsule CRM',
    icon: <SystemIcon initial="CP" color="red-500" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your Capsule API key in My Preferences > API Authentication Tokens'
  },
  {
    id: 'nutshell',
    name: 'Nutshell',
    description: 'Connect to Nutshell CRM',
    icon: <SystemIcon initial="NU" color="orange-600" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your Nutshell API key in Settings > API'
  },
  {
    id: 'nutshell',
    name: 'Nutshell',
    description: 'Connect to Nutshell CRM',
    icon: <SystemIcon initial="NU" color="orange-600" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your Nutshell API key in Settings > API'
  },
  {
    id: 'bitrix24',
    name: 'Bitrix24',
    description: 'Connect to Bitrix24 CRM',
    icon: <SystemIcon initial="BX" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'source',
    permissions: [
      'Read contacts, companies, and deals',
      'Read tasks and calendar',
      'Access communications'
    ]
  },
  {
    id: 'bitrix24',
    name: 'Bitrix24',
    description: 'Connect to Bitrix24 CRM',
    icon: <SystemIcon initial="BX" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'destination',
    permissions: [
      'Read/write contacts, companies, and deals',
      'Create and update tasks and calendar',
      'Access communications'
    ]
  },
  {
    id: 'engagebay',
    name: 'EngageBay',
    description: 'Connect to EngageBay CRM and marketing',
    icon: <SystemIcon initial="EB" color="blue-600" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your EngageBay API key in Settings > API'
  },
  {
    id: 'engagebay',
    name: 'EngageBay',
    description: 'Connect to EngageBay CRM and marketing',
    icon: <SystemIcon initial="EB" color="blue-600" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your EngageBay API key in Settings > API'
  },
  {
    id: 'clickup',
    name: 'ClickUp',
    description: 'Connect to ClickUp for project management and CRM',
    icon: <SystemIcon initial="CU" color="purple-500" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your ClickUp API key in Settings > Apps > API'
  },
  {
    id: 'clickup',
    name: 'ClickUp',
    description: 'Connect to ClickUp for project management and CRM',
    icon: <SystemIcon initial="CU" color="purple-500" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your ClickUp API key in Settings > Apps > API'
  },
  {
    id: 'odoo',
    name: 'Odoo',
    description: 'Connect to Odoo CRM',
    icon: <SystemIcon initial="OD" color="green-500" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'Contact your Odoo administrator for API credentials'
  },
  {
    id: 'odoo',
    name: 'Odoo',
    description: 'Connect to Odoo CRM',
    icon: <SystemIcon initial="OD" color="green-500" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'Contact your Odoo administrator for API credentials'
  },
  {
    id: 'salesflare',
    name: 'Salesflare',
    description: 'Connect to Salesflare CRM',
    icon: <SystemIcon initial="SF" color="blue-500" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your Salesflare API key in Settings > API'
  },
  {
    id: 'salesflare',
    name: 'Salesflare',
    description: 'Connect to Salesflare CRM',
    icon: <SystemIcon initial="SF" color="blue-500" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your Salesflare API key in Settings > API'
  },
  {
    id: 'apptivo',
    name: 'Apptivo',
    description: 'Connect to Apptivo CRM',
    icon: <SystemIcon initial="AP" color="cyan-600" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'Contact Apptivo support to obtain your API credentials'
  },
  {
    id: 'apptivo',
    name: 'Apptivo',
    description: 'Connect to Apptivo CRM',
    icon: <SystemIcon initial="AP" color="cyan-600" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'Contact Apptivo support to obtain your API credentials'
  },
  {
    id: 'agilecrm',
    name: 'Agile CRM',
    description: 'Connect to Agile CRM',
    icon: <SystemIcon initial="AG" color="blue-500" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your Agile CRM API key in Admin Settings > API'
  },
  {
    id: 'agilecrm',
    name: 'Agile CRM',
    description: 'Connect to Agile CRM',
    icon: <SystemIcon initial="AG" color="blue-500" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your Agile CRM API key in Admin Settings > API'
  },
  {
    id: 'planfix',
    name: 'Planfix',
    description: 'Connect to Planfix CRM',
    icon: <SystemIcon initial="PF" color="green-500" />,
    authType: 'api',
    connectionType: 'source',
    apiKeyHelp: 'You can find your Planfix API key in Account > API access'
  },
  {
    id: 'planfix',
    name: 'Planfix',
    description: 'Connect to Planfix CRM',
    icon: <SystemIcon initial="PF" color="green-500" />,
    authType: 'api',
    connectionType: 'destination',
    apiKeyHelp: 'You can find your Planfix API key in Account > API access'
  }
];

// Related Applications
export const relatedApps: SystemConfig[] = [
  // Original apps
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
  {
    id: 'slack',
    name: 'Slack',
    description: 'Connect to Slack for team communication',
    icon: <SystemIcon initial="SL" color="green-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'productivity',
    popular: true
  },
  
  // Additional Sales Engagement tools
  {
    id: 'highspot',
    name: 'Highspot',
    description: 'Connect to Highspot for sales enablement',
    icon: <SystemIcon initial="HS" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'sales-engagement',
    permissions: [
      'Read content analytics',
      'Access pitch data',
      'View engagement metrics'
    ]
  },
  {
    id: 'seismic',
    name: 'Seismic',
    description: 'Connect to Seismic for sales enablement',
    icon: <SystemIcon initial="SE" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'sales-engagement',
    apiKeyHelp: 'Contact your Seismic administrator for API credentials'
  },
  {
    id: 'revenue',
    name: 'Revenue.io',
    description: 'Connect to Revenue.io for sales engagement',
    icon: <SystemIcon initial="RV" color="green-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'sales-engagement',
    apiKeyHelp: 'Contact your Revenue.io administrator for API credentials'
  },
  {
    id: 'apollo',
    name: 'Apollo.io',
    description: 'Connect to Apollo.io for sales intelligence',
    icon: <SystemIcon initial="AP" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'sales-engagement',
    apiKeyHelp: 'You can find your Apollo.io API key in Settings > Integrations > API'
  },
  {
    id: 'allego',
    name: 'Allego',
    description: 'Connect to Allego for sales enablement',
    icon: <SystemIcon initial="AL" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'sales-engagement',
    permissions: [
      'Access learning content',
      'View engagement data',
      'Read user activity'
    ]
  },
  {
    id: 'showpad',
    name: 'Showpad',
    description: 'Connect to Showpad for sales enablement',
    icon: <SystemIcon initial="SP" color="purple-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'sales-engagement',
    permissions: [
      'Access content library',
      'View analytics',
      'Read user data'
    ]
  },
  {
    id: 'mindtickle',
    name: 'Mindtickle',
    description: 'Connect to Mindtickle for sales readiness',
    icon: <SystemIcon initial="MT" color="orange-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'sales-engagement',
    apiKeyHelp: 'Contact your Mindtickle administrator for API credentials'
  },
  
  // Additional Marketing Automation tools
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    description: 'Connect to Klaviyo for email marketing',
    icon: <SystemIcon initial="KL" color="green-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'marketing-automation',
    apiKeyHelp: 'You can find your Klaviyo API keys in Account > Settings > API Keys'
  },
  {
    id: 'brevo',
    name: 'Brevo (Sendinblue)',
    description: 'Connect to Brevo for email marketing',
    icon: <SystemIcon initial="BR" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'marketing-automation',
    apiKeyHelp: 'You can find your Brevo API key in Account > SMTP & API > API Keys'
  },
  {
    id: 'getresponse',
    name: 'GetResponse',
    description: 'Connect to GetResponse for email marketing',
    icon: <SystemIcon initial="GR" color="green-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'marketing-automation',
    apiKeyHelp: 'You can find your GetResponse API key in Profile > Integrations & API > API'
  },
  {
    id: 'constant-contact',
    name: 'Constant Contact',
    description: 'Connect to Constant Contact for email marketing',
    icon: <SystemIcon initial="CC" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'marketing-automation',
    permissions: [
      'Access contact lists',
      'View campaign data',
      'Read reporting metrics'
    ]
  },
  {
    id: 'zoho-campaigns',
    name: 'Zoho Campaigns',
    description: 'Connect to Zoho Campaigns for email marketing',
    icon: <SystemIcon initial="ZC" color="red-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'marketing-automation',
    apiKeyHelp: 'You can find your Zoho Campaigns API key in Account Settings > API Keys'
  },
  
  // Additional Support tools
  {
    id: 'salesforce-service',
    name: 'Salesforce Service Cloud',
    description: 'Connect to Salesforce Service Cloud',
    icon: <SystemIcon initial="SS" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'support',
    permissions: [
      'Access case management',
      'Read customer service data',
      'View knowledge articles'
    ]
  },
  {
    id: 'hubspot-service',
    name: 'HubSpot Service Hub',
    description: 'Connect to HubSpot Service Hub',
    icon: <SystemIcon initial="HS" color="orange-600" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'support',
    permissions: [
      'Access tickets',
      'Read customer feedback',
      'View knowledge base'
    ]
  },
  {
    id: 'intercom',
    name: 'Intercom',
    description: 'Connect to Intercom for customer messaging',
    icon: <SystemIcon initial="IC" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'support',
    apiKeyHelp: 'You can find your Intercom API key in Settings > API Keys'
  },
  {
    id: 'freshdesk',
    name: 'Freshdesk',
    description: 'Connect to Freshdesk for customer support',
    icon: <SystemIcon initial="FD" color="green-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'support',
    apiKeyHelp: 'You can find your Freshdesk API key in Profile Settings > API Key'
  },
  {
    id: 'help-scout',
    name: 'Help Scout',
    description: 'Connect to Help Scout for customer support',
    icon: <SystemIcon initial="HS" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'support',
    apiKeyHelp: 'You can find your Help Scout API key in Your Profile > API Keys'
  },
  {
    id: 'zoho-desk',
    name: 'Zoho Desk',
    description: 'Connect to Zoho Desk for customer support',
    icon: <SystemIcon initial="ZD" color="red-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'support',
    apiKeyHelp: 'You can find your Zoho Desk API tokens in Setup > API > Tokens'
  },
  
  // Productivity/Collaboration tools
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    description: 'Connect to Microsoft Teams for collaboration',
    icon: <SystemIcon initial="MT" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'productivity',
    permissions: [
      'Access team conversations',
      'Post messages to channels',
      'Read team information'
    ]
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description: 'Connect to Google Workspace for productivity',
    icon: <SystemIcon initial="GW" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'productivity',
    permissions: [
      'Access calendar data',
      'Read email information',
      'View document metadata'
    ]
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Connect to Zoom for video meetings',
    icon: <SystemIcon initial="ZM" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'productivity',
    permissions: [
      'Schedule meetings',
      'View meeting data',
      'Access user information'
    ]
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Connect to Asana for project management',
    icon: <SystemIcon initial="AS" color="red-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'productivity',
    apiKeyHelp: 'You can find your Asana Personal Access Token in My Profile Settings > Apps > Developer Apps'
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Connect to Trello for project management',
    icon: <SystemIcon initial="TR" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'productivity',
    apiKeyHelp: 'You can find your Trello API key at https://trello.com/app-key'
  },
  
  // BI/Analytics tools
  {
    id: 'tableau',
    name: 'Tableau',
    description: 'Connect to Tableau for data visualization',
    icon: <SystemIcon initial="TB" color="blue-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'analytics',
    apiKeyHelp: 'Contact your Tableau administrator for API credentials'
  },
  {
    id: 'power-bi',
    name: 'Power BI',
    description: 'Connect to Power BI for business intelligence',
    icon: <SystemIcon initial="PB" color="yellow-600" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'analytics',
    permissions: [
      'Access report data',
      'View dashboard metrics',
      'Read dataset information'
    ]
  },
  {
    id: 'looker',
    name: 'Looker',
    description: 'Connect to Looker for data analytics',
    icon: <SystemIcon initial="LK" color="green-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'analytics',
    apiKeyHelp: 'Contact your Looker administrator for API credentials'
  },
  
  // Finance/Billing/CPQ tools
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Connect to QuickBooks for accounting',
    icon: <SystemIcon initial="QB" color="green-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'finance',
    permissions: [
      'Read customer data',
      'View invoice information',
      'Access transaction details'
    ]
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Connect to Xero for accounting',
    icon: <SystemIcon initial="XR" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'finance',
    permissions: [
      'Read contacts',
      'View invoices and bills',
      'Access accounting reports'
    ]
  },
  {
    id: 'netsuite-finance',
    name: 'NetSuite (Finance)',
    description: 'Connect to NetSuite for financial management',
    icon: <SystemIcon initial="NS" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'finance',
    permissions: [
      'Read financial records',
      'View accounting data',
      'Access transaction details'
    ]
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Connect to Stripe for payment processing',
    icon: <SystemIcon initial="ST" color="purple-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'finance',
    apiKeyHelp: 'You can find your Stripe API keys in Dashboard > Developers > API keys'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Connect to PayPal for payment processing',
    icon: <SystemIcon initial="PP" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'finance',
    permissions: [
      'Access transaction data',
      'View payment information',
      'Read customer details'
    ]
  },
  {
    id: 'salesforce-cpq',
    name: 'Salesforce CPQ',
    description: 'Connect to Salesforce CPQ for quoting',
    icon: <SystemIcon initial="SC" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'finance',
    permissions: [
      'Read quote data',
      'Access product information',
      'View pricing details'
    ]
  },
  {
    id: 'dealhub',
    name: 'DealHub.io',
    description: 'Connect to DealHub for CPQ and contract generation',
    icon: <SystemIcon initial="DH" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'finance',
    apiKeyHelp: 'Contact your DealHub administrator for API credentials'
  },
  
  // Data Enrichment/Prospecting tools
  {
    id: 'linkedin-sales',
    name: 'LinkedIn Sales Navigator',
    description: 'Connect to LinkedIn Sales Navigator',
    icon: <SystemIcon initial="LI" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'data-enrichment',
    permissions: [
      'Access lead data',
      'View account information',
      'Read saved leads and accounts'
    ]
  },
  {
    id: 'clearbit',
    name: 'Clearbit',
    description: 'Connect to Clearbit for data enrichment',
    icon: <SystemIcon initial="CB" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'data-enrichment',
    apiKeyHelp: 'You can find your Clearbit API key in Settings > API'
  },
  {
    id: 'dropcontact',
    name: 'Dropcontact',
    description: 'Connect to Dropcontact for contact enrichment',
    icon: <SystemIcon initial="DC" color="green-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'data-enrichment',
    apiKeyHelp: 'You can find your Dropcontact API key in your account settings'
  },
  {
    id: 'uplead',
    name: 'UpLead',
    description: 'Connect to UpLead for B2B lead generation',
    icon: <SystemIcon initial="UL" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'data-enrichment',
    apiKeyHelp: 'You can find your UpLead API key in Account Settings > API'
  },
  
  // E-Signature tools
  {
    id: 'docusign',
    name: 'DocuSign',
    description: 'Connect to DocuSign for e-signatures',
    icon: <SystemIcon initial="DS" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'e-signature',
    popular: true,
    permissions: [
      'Access envelope data',
      'View template information',
      'Read document status'
    ]
  },
  {
    id: 'adobe-sign',
    name: 'Adobe Acrobat Sign',
    description: 'Connect to Adobe Acrobat Sign for e-signatures',
    icon: <SystemIcon initial="AS" color="red-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'e-signature',
    permissions: [
      'Access agreement data',
      'View template information',
      'Read document status'
    ]
  },
  {
    id: 'pandadoc',
    name: 'PandaDoc',
    description: 'Connect to PandaDoc for document automation',
    icon: <SystemIcon initial="PD" color="green-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'e-signature',
    apiKeyHelp: 'You can find your PandaDoc API key in Settings > Integrations > API'
  },
  {
    id: 'hellosign',
    name: 'HelloSign',
    description: 'Connect to HelloSign for e-signatures',
    icon: <SystemIcon initial="HS" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'e-signature',
    apiKeyHelp: 'You can find your HelloSign API key in Account > Integrations > API'
  },
  
  // Additional Connectivity (iPaaS) tools
  {
    id: 'workato',
    name: 'Workato',
    description: 'Connect to Workato for workflow automation',
    icon: <SystemIcon initial="WK" color="orange-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'connectivity',
    apiKeyHelp: 'Contact your Workato administrator for API credentials'
  }
];

