
import React from "react";
import { SystemConfig } from "../types/connectionTypes";
import { SystemIcon } from "../utils/iconUtils";

// Support Tools
export const supportTools: SystemConfig[] = [
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
  }
];
