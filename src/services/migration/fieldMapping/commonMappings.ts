
/**
 * Standard mappings for common CRM fields
 * This helps with automatic mapping suggestions and validation
 */

interface CommonFieldInfo {
  standard_name: string;
  variations: string[];
  required: boolean;
  description?: string;
}

export const commonMappings: Record<string, CommonFieldInfo> = {
  // Contact fields
  firstName: {
    standard_name: 'First Name',
    variations: ['firstName', 'first_name', 'first', 'givenName', 'given_name'],
    required: true,
    description: 'Contact\'s first/given name'
  },
  lastName: {
    standard_name: 'Last Name',
    variations: ['lastName', 'last_name', 'last', 'surname', 'family_name'],
    required: true,
    description: 'Contact\'s last/family name'
  },
  email: {
    standard_name: 'Email',
    variations: ['email', 'emailAddress', 'email_address', 'workEmail', 'personalEmail'],
    required: true,
    description: 'Primary email address'
  },
  phone: {
    standard_name: 'Phone',
    variations: ['phone', 'phoneNumber', 'phone_number', 'workPhone', 'mobilePhone'],
    required: false,
    description: 'Primary phone number'
  },
  
  // Company/Account fields
  companyName: {
    standard_name: 'Company Name',
    variations: ['companyName', 'company_name', 'company', 'accountName', 'account_name', 'organization'],
    required: true,
    description: 'Company or organization name'
  },
  industry: {
    standard_name: 'Industry',
    variations: ['industry', 'industryType', 'industry_type', 'sector'],
    required: false,
    description: 'Company industry or sector'
  },
  
  // Deal/Opportunity fields
  dealName: {
    standard_name: 'Deal Name',
    variations: ['dealName', 'deal_name', 'opportunityName', 'opportunity_name'],
    required: true,
    description: 'Name of the deal or opportunity'
  },
  amount: {
    standard_name: 'Deal Amount',
    variations: ['amount', 'dealAmount', 'deal_amount', 'value', 'opportunityAmount'],
    required: false,
    description: 'Monetary value of the deal'
  },
  stage: {
    standard_name: 'Deal Stage',
    variations: ['stage', 'dealStage', 'deal_stage', 'opportunityStage', 'status'],
    required: true,
    description: 'Current stage in the sales process'
  },
  
  // Common fields
  createdDate: {
    standard_name: 'Created Date',
    variations: ['createdDate', 'created_date', 'created_at', 'createdAt', 'dateCreated'],
    required: false,
    description: 'When the record was created'
  },
  updatedDate: {
    standard_name: 'Updated Date',
    variations: ['updatedDate', 'updated_date', 'updated_at', 'updatedAt', 'lastModified'],
    required: false,
    description: 'When the record was last modified'
  },
  owner: {
    standard_name: 'Owner',
    variations: ['owner', 'ownerId', 'owner_id', 'assignedTo', 'assigned_to'],
    required: false,
    description: 'User who owns or is assigned to the record'
  },
  description: {
    standard_name: 'Description',
    variations: ['description', 'notes', 'details', 'comments'],
    required: false,
    description: 'Additional details or notes'
  },
  source: {
    standard_name: 'Source',
    variations: ['source', 'leadSource', 'lead_source', 'origin', 'channel'],
    required: false,
    description: 'Where the record originated from'
  }
};

