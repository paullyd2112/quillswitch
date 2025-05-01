
import React from "react";
import { SystemConfig } from "../types/connectionTypes";
import { SystemIcon } from "../utils/iconUtils";

// Sales Engagement Tools
export const salesEngagementTools: SystemConfig[] = [
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
  }
];
