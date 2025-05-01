
import React from "react";
import { SystemConfig } from "../types/connectionTypes";
import { SystemIcon } from "../utils/iconUtils";

// Marketing Automation Tools
export const marketingTools: SystemConfig[] = [
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
  }
];
