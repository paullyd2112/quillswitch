
import React from "react";
import { SystemConfig } from "../types/connectionTypes";
import { SystemIcon } from "../utils/iconUtils";

// Finance Tools
export const financeTools: SystemConfig[] = [
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Connect to QuickBooks for accounting',
    icon: <SystemIcon initial="QB" color="green-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'finance',
    permissions: [
      'Read customer data',
      'View invoice information',
      'Access transaction details'
    ]
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Connect to Xero for accounting',
    icon: <SystemIcon initial="XR" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'finance',
    permissions: [
      'Read contacts',
      'View invoices and bills',
      'Access accounting reports'
    ]
  },
  {
    id: 'netsuite-finance',
    name: 'NetSuite (Finance)',
    description: 'Connect to NetSuite for financial management',
    icon: <SystemIcon initial="NS" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'finance',
    permissions: [
      'Read financial records',
      'View accounting data',
      'Access transaction details'
    ]
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Connect to Stripe for payment processing',
    icon: <SystemIcon initial="ST" color="purple-600" />,
    authType: 'api',
    connectionType: 'related',
    category: 'finance',
    apiKeyHelp: 'You can find your Stripe API keys in Dashboard > Developers > API keys'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Connect to PayPal for payment processing',
    icon: <SystemIcon initial="PP" color="blue-500" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'finance',
    permissions: [
      'Access transaction data',
      'View payment information',
      'Read customer details'
    ]
  },
  {
    id: 'salesforce-cpq',
    name: 'Salesforce CPQ',
    description: 'Connect to Salesforce CPQ for quoting',
    icon: <SystemIcon initial="SC" color="blue-600" />,
    authType: 'oauth',
    connectionType: 'related',
    category: 'finance',
    permissions: [
      'Read quote data',
      'Access product information',
      'View pricing details'
    ]
  },
  {
    id: 'dealhub',
    name: 'DealHub.io',
    description: 'Connect to DealHub for CPQ and contract generation',
    icon: <SystemIcon initial="DH" color="blue-500" />,
    authType: 'api',
    connectionType: 'related',
    category: 'finance',
    apiKeyHelp: 'Contact your DealHub administrator for API credentials'
  }
];
