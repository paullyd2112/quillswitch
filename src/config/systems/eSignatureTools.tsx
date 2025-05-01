
import React from "react";
import { SystemConfig } from "../types/connectionTypes";
import { SystemIcon } from "../utils/iconUtils";

// E-Signature Tools
export const eSignatureTools: SystemConfig[] = [
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
  }
];
