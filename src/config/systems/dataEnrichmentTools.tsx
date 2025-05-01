
import React from "react";
import { SystemConfig } from "../types/connectionTypes";
import { SystemIcon } from "../utils/iconUtils";

// Data Enrichment Tools
export const dataEnrichmentTools: SystemConfig[] = [
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
  }
];
