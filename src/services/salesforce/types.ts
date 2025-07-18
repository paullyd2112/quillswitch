export interface SalesforceCredential {
  access_token: string;
  refresh_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  issued_at: string;
  signature: string;
  scope: string;
}

export interface SalesforceOAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

export interface SalesforceTokenResponse {
  access_token: string;
  refresh_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  issued_at: string;
  signature: string;
  scope: string;
}

export interface SalesforceContact {
  Id?: string;
  FirstName?: string;
  LastName: string;
  Email?: string;
  Phone?: string;
  AccountId?: string;
  Title?: string;
  Department?: string;
  CreatedDate?: string;
  LastModifiedDate?: string;
}

export interface SalesforceAccount {
  Id?: string;
  Name: string;
  Type?: string;
  Industry?: string;
  Phone?: string;
  Website?: string;
  BillingCity?: string;
  BillingState?: string;
  BillingCountry?: string;
  CreatedDate?: string;
  LastModifiedDate?: string;
}

export interface SalesforceOpportunity {
  Id?: string;
  Name: string;
  AccountId?: string;
  Amount?: number;
  CloseDate: string;
  StageName: string;
  Probability?: number;
  Type?: string;
  LeadSource?: string;
  CreatedDate?: string;
  LastModifiedDate?: string;
}

export interface SalesforceField {
  name: string;
  label: string;
  type: string;
  length?: number;
  required: boolean;
  referenceTo?: string[];
  picklistValues?: Array<{
    label: string;
    value: string;
    active: boolean;
  }>;
}

export interface SalesforceObjectDescribe {
  name: string;
  label: string;
  fields: SalesforceField[];
  createable: boolean;
  updateable: boolean;
  deletable: boolean;
  queryable: boolean;
}

export interface SalesforceQueryResponse<T> {
  totalSize: number;
  done: boolean;
  records: T[];
  nextRecordsUrl?: string;
}

export interface SalesforceBulkJobInfo {
  id: string;
  state: 'Open' | 'InProgress' | 'Completed' | 'Failed' | 'Aborted';
  object: string;
  operation: 'insert' | 'update' | 'upsert' | 'delete';
  createdDate: string;
}