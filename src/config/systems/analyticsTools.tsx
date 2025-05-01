
import React from "react";
import { SystemConfig } from "../types/connectionTypes";
import { SystemIcon } from "../utils/iconUtils";

// Analytics Tools
export const analyticsTools: SystemConfig[] = [
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
  }
];
