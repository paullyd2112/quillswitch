
import React from "react";
import { SystemConfig } from "../types/connectionTypes";
import { SystemIcon } from "../utils/iconUtils";

// CRM Systems - Pared down to core 6 systems
export const crmSystems: SystemConfig[] = [
  // Salesforce
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
  
  // HubSpot
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Connect to HubSpot CRM',
    icon: <SystemIcon initial="HS" color="orange-500" />,
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
    icon: <SystemIcon initial="HS" color="orange-500" />,
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
  
  // Microsoft Dynamics 365
  {
    id: 'dynamics',
    name: 'Microsoft Dynamics 365',
    description: 'Connect to Microsoft Dynamics 365',
    icon: <SystemIcon initial="D365" color="blue-500" />,
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
    icon: <SystemIcon initial="D365" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'destination',
    popular: true,
    permissions: [
      'Read/write contacts, accounts, and opportunities',
      'Create and update custom entities',
      'Access user information'
    ]
  },
  
  // Zendesk Sell
  {
    id: 'zendesk-sell',
    name: 'Zendesk Sell',
    description: 'Connect to Zendesk Sell CRM',
    icon: <SystemIcon initial="ZS" color="green-600" />,
    authType: 'api',
    connectionType: 'source',
    popular: true,
    apiKeyHelp: 'You can find your Zendesk Sell API key in Admin > Apps > API'
  },
  {
    id: 'zendesk-sell',
    name: 'Zendesk Sell',
    description: 'Connect to Zendesk Sell CRM',
    icon: <SystemIcon initial="ZS" color="green-600" />,
    authType: 'api',
    connectionType: 'destination',
    popular: true,
    apiKeyHelp: 'You can find your Zendesk Sell API key in Admin > Apps > API'
  },
  
  // Monday Sales CRM
  {
    id: 'monday',
    name: 'Monday Sales CRM',
    description: 'Connect to Monday Sales CRM',
    icon: <SystemIcon initial="MON" color="blue-500" />,
    authType: 'api',
    connectionType: 'source',
    popular: true,
    apiKeyHelp: 'You can find your Monday.com API key in Admin > API.'
  },
  {
    id: 'monday',
    name: 'Monday Sales CRM',
    description: 'Connect to Monday Sales CRM',
    icon: <SystemIcon initial="MON" color="blue-500" />,
    authType: 'api',
    connectionType: 'destination',
    popular: true,
    apiKeyHelp: 'You can find your Monday.com API key in Admin > API.'
  },
  
  // Pipedrive
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
  }
];
