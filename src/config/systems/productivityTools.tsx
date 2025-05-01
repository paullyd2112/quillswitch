
import React from "react";
import { SystemConfig } from "../types/connectionTypes";
import { SystemIcon } from "../utils/iconUtils";

// Productivity Tools
export const productivityTools: SystemConfig[] = [
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
  }
];
