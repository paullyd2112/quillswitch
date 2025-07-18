import { SalesforceContact, SalesforceAccount, SalesforceOpportunity } from './types';

// Generic data transformation interfaces
export interface SourceContact {
  id?: string;
  firstName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyId?: string;
  title?: string;
  department?: string;
  customFields?: Record<string, any>;
}

export interface SourceAccount {
  id?: string;
  name: string;
  type?: string;
  industry?: string;
  phone?: string;
  website?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    street?: string;
    postalCode?: string;
  };
  customFields?: Record<string, any>;
}

export interface SourceOpportunity {
  id?: string;
  name: string;
  accountId?: string;
  amount?: number;
  closeDate: string;
  stage: string;
  probability?: number;
  type?: string;
  leadSource?: string;
  customFields?: Record<string, any>;
}

export interface DataTransformationConfig {
  fieldMappings: {
    contacts: Record<string, string>;
    accounts: Record<string, string>;
    opportunities: Record<string, string>;
  };
  valueTransformations: {
    [fieldName: string]: (value: any) => any;
  };
  requiredFields: {
    contacts: string[];
    accounts: string[];
    opportunities: string[];
  };
}

export class SalesforceDataTransformer {
  private config: DataTransformationConfig;

  constructor(config?: Partial<DataTransformationConfig>) {
    this.config = {
      fieldMappings: {
        contacts: {
          firstName: 'FirstName',
          lastName: 'LastName',
          email: 'Email',
          phone: 'Phone',
          companyId: 'AccountId',
          title: 'Title',
          department: 'Department'
        },
        accounts: {
          name: 'Name',
          type: 'Type',
          industry: 'Industry',
          phone: 'Phone',
          website: 'Website',
          'address.city': 'BillingCity',
          'address.state': 'BillingState',
          'address.country': 'BillingCountry'
        },
        opportunities: {
          name: 'Name',
          accountId: 'AccountId',
          amount: 'Amount',
          closeDate: 'CloseDate',
          stage: 'StageName',
          probability: 'Probability',
          type: 'Type',
          leadSource: 'LeadSource'
        }
      },
      valueTransformations: {
        // Date transformations
        closeDate: (value: any) => {
          if (!value) return null;
          const date = new Date(value);
          return date.toISOString().split('T')[0]; // YYYY-MM-DD format for Salesforce
        },
        // Ensure required fields have defaults
        lastName: (value: any) => value || 'Unknown',
        name: (value: any) => value || 'Unknown',
        stage: (value: any) => value || 'Prospecting'
      },
      requiredFields: {
        contacts: ['LastName'],
        accounts: ['Name'],
        opportunities: ['Name', 'CloseDate', 'StageName']
      },
      ...config
    };
  }

  transformContacts(sourceContacts: SourceContact[]): Partial<SalesforceContact>[] {
    return sourceContacts.map(contact => this.transformContact(contact));
  }

  transformContact(sourceContact: SourceContact): Partial<SalesforceContact> {
    const transformed: Partial<SalesforceContact> = {};
    
    // Apply field mappings
    Object.entries(this.config.fieldMappings.contacts).forEach(([sourceField, salesforceField]) => {
      const value = this.getNestedValue(sourceContact, sourceField);
      if (value !== undefined && value !== null) {
        const transformedValue = this.applyValueTransformation(salesforceField, value);
        (transformed as any)[salesforceField] = transformedValue;
      }
    });

    // Handle custom fields
    if (sourceContact.customFields) {
      Object.entries(sourceContact.customFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Convert custom field names to Salesforce format (e.g., Custom_Field__c)
          const salesforceFieldName = this.convertToSalesforceCustomField(key);
          (transformed as any)[salesforceFieldName] = value;
        }
      });
    }

    // Ensure required fields
    this.config.requiredFields.contacts.forEach(field => {
      if (!(field in transformed) || !transformed[field as keyof SalesforceContact]) {
        const defaultValue = this.applyValueTransformation(field, null);
        (transformed as any)[field] = defaultValue;
      }
    });

    return transformed;
  }

  transformAccounts(sourceAccounts: SourceAccount[]): Partial<SalesforceAccount>[] {
    return sourceAccounts.map(account => this.transformAccount(account));
  }

  transformAccount(sourceAccount: SourceAccount): Partial<SalesforceAccount> {
    const transformed: Partial<SalesforceAccount> = {};
    
    // Apply field mappings
    Object.entries(this.config.fieldMappings.accounts).forEach(([sourceField, salesforceField]) => {
      const value = this.getNestedValue(sourceAccount, sourceField);
      if (value !== undefined && value !== null) {
        const transformedValue = this.applyValueTransformation(salesforceField, value);
        (transformed as any)[salesforceField] = transformedValue;
      }
    });

    // Handle custom fields
    if (sourceAccount.customFields) {
      Object.entries(sourceAccount.customFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const salesforceFieldName = this.convertToSalesforceCustomField(key);
          (transformed as any)[salesforceFieldName] = value;
        }
      });
    }

    // Ensure required fields
    this.config.requiredFields.accounts.forEach(field => {
      if (!(field in transformed) || !transformed[field as keyof SalesforceAccount]) {
        const defaultValue = this.applyValueTransformation(field, null);
        (transformed as any)[field] = defaultValue;
      }
    });

    return transformed;
  }

  transformOpportunities(sourceOpportunities: SourceOpportunity[]): Partial<SalesforceOpportunity>[] {
    return sourceOpportunities.map(opportunity => this.transformOpportunity(opportunity));
  }

  transformOpportunity(sourceOpportunity: SourceOpportunity): Partial<SalesforceOpportunity> {
    const transformed: Partial<SalesforceOpportunity> = {};
    
    // Apply field mappings
    Object.entries(this.config.fieldMappings.opportunities).forEach(([sourceField, salesforceField]) => {
      const value = this.getNestedValue(sourceOpportunity, sourceField);
      if (value !== undefined && value !== null) {
        const transformedValue = this.applyValueTransformation(salesforceField, value);
        (transformed as any)[salesforceField] = transformedValue;
      }
    });

    // Handle custom fields
    if (sourceOpportunity.customFields) {
      Object.entries(sourceOpportunity.customFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const salesforceFieldName = this.convertToSalesforceCustomField(key);
          (transformed as any)[salesforceFieldName] = value;
        }
      });
    }

    // Ensure required fields
    this.config.requiredFields.opportunities.forEach(field => {
      if (!(field in transformed) || !transformed[field as keyof SalesforceOpportunity]) {
        const defaultValue = this.applyValueTransformation(field, null);
        (transformed as any)[field] = defaultValue;
      }
    });

    return transformed;
  }

  // Utility methods
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private applyValueTransformation(fieldName: string, value: any): any {
    const transformation = this.config.valueTransformations[fieldName];
    return transformation ? transformation(value) : value;
  }

  private convertToSalesforceCustomField(fieldName: string): string {
    // Convert field names to Salesforce custom field format
    // Remove special characters and spaces, add __c suffix
    const cleanName = fieldName
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
    
    return `${cleanName}__c`;
  }

  // Data validation
  validateContacts(contacts: Partial<SalesforceContact>[]): { valid: Partial<SalesforceContact>[]; invalid: Array<{ contact: Partial<SalesforceContact>; errors: string[] }> } {
    const valid: Partial<SalesforceContact>[] = [];
    const invalid: Array<{ contact: Partial<SalesforceContact>; errors: string[] }> = [];

    contacts.forEach(contact => {
      const errors: string[] = [];
      
      // Check required fields
      if (!contact.LastName) {
        errors.push('LastName is required');
      }
      
      // Validate email format if provided
      if (contact.Email && !this.isValidEmail(contact.Email)) {
        errors.push('Invalid email format');
      }

      if (errors.length > 0) {
        invalid.push({ contact, errors });
      } else {
        valid.push(contact);
      }
    });

    return { valid, invalid };
  }

  validateAccounts(accounts: Partial<SalesforceAccount>[]): { valid: Partial<SalesforceAccount>[]; invalid: Array<{ account: Partial<SalesforceAccount>; errors: string[] }> } {
    const valid: Partial<SalesforceAccount>[] = [];
    const invalid: Array<{ account: Partial<SalesforceAccount>; errors: string[] }> = [];

    accounts.forEach(account => {
      const errors: string[] = [];
      
      // Check required fields
      if (!account.Name) {
        errors.push('Name is required');
      }

      if (errors.length > 0) {
        invalid.push({ account, errors });
      } else {
        valid.push(account);
      }
    });

    return { valid, invalid };
  }

  validateOpportunities(opportunities: Partial<SalesforceOpportunity>[]): { valid: Partial<SalesforceOpportunity>[]; invalid: Array<{ opportunity: Partial<SalesforceOpportunity>; errors: string[] }> } {
    const valid: Partial<SalesforceOpportunity>[] = [];
    const invalid: Array<{ opportunity: Partial<SalesforceOpportunity>; errors: string[] }> = [];

    opportunities.forEach(opportunity => {
      const errors: string[] = [];
      
      // Check required fields
      if (!opportunity.Name) {
        errors.push('Name is required');
      }
      if (!opportunity.CloseDate) {
        errors.push('CloseDate is required');
      }
      if (!opportunity.StageName) {
        errors.push('StageName is required');
      }

      // Validate date format
      if (opportunity.CloseDate && !this.isValidDate(opportunity.CloseDate)) {
        errors.push('Invalid CloseDate format (expected YYYY-MM-DD)');
      }

      if (errors.length > 0) {
        invalid.push({ opportunity, errors });
      } else {
        valid.push(opportunity);
      }
    });

    return { valid, invalid };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  }
}

export const createDataTransformer = (config?: Partial<DataTransformationConfig>) => {
  return new SalesforceDataTransformer(config);
};