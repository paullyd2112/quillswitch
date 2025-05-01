
import React from "react";
import { SystemConfig } from "../types/connectionTypes";
import { SystemIcon } from "../utils/iconUtils";

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
