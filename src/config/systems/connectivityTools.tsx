
import React from "react";
import { SystemConfig } from "../types/connectionTypes";
import { SystemIcon } from "../utils/iconUtils";

// Connectivity (iPaaS) Tools
export const connectivityTools: SystemConfig[] = [
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
