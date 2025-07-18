import { 
  SalesforceCredential, 
  SalesforceContact, 
  SalesforceAccount, 
  SalesforceOpportunity,
  SalesforceObjectDescribe,
  SalesforceQueryResponse,
  SalesforceBulkJobInfo
} from './types';

export class SalesforceClient {
  private credential: SalesforceCredential;

  constructor(credential: SalesforceCredential) {
    this.credential = credential;
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.credential.access_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.credential.instance_url}/services/data/v58.0${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Salesforce API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  // Object Description Methods
  async describeObject(objectType: string): Promise<SalesforceObjectDescribe> {
    return this.makeRequest(`/sobjects/${objectType}/describe/`);
  }

  async getObjectTypes(): Promise<Array<{ name: string; label: string; }>> {
    const response = await this.makeRequest<{ sobjects: Array<{ name: string; label: string; }> }>('/sobjects/');
    return response.sobjects.filter(obj => 
      ['Contact', 'Account', 'Opportunity', 'Lead', 'Case', 'Task', 'Event'].includes(obj.name)
    );
  }

  // Query Methods
  async query<T>(soql: string): Promise<SalesforceQueryResponse<T>> {
    const encodedQuery = encodeURIComponent(soql);
    return this.makeRequest(`/query/?q=${encodedQuery}`);
  }

  async queryMore<T>(nextRecordsUrl: string): Promise<SalesforceQueryResponse<T>> {
    const url = `${this.credential.instance_url}${nextRecordsUrl}`;
    const response = await fetch(url, { headers: this.headers });
    
    if (!response.ok) {
      throw new Error(`Salesforce API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Contact Methods
  async getContacts(limit = 1000, offset = 0): Promise<SalesforceContact[]> {
    const soql = `
      SELECT Id, FirstName, LastName, Email, Phone, AccountId, Title, Department, CreatedDate, LastModifiedDate
      FROM Contact
      ORDER BY CreatedDate DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    
    const response = await this.query<SalesforceContact>(soql);
    return response.records;
  }

  async createContacts(contacts: Partial<SalesforceContact>[]): Promise<any[]> {
    const results = [];
    
    // Salesforce REST API supports composite requests for bulk operations
    for (const batch of this.chunkArray(contacts, 200)) {
      const compositeRequest = {
        allOrNone: false,
        compositeRequest: batch.map((contact, index) => ({
          method: 'POST',
          url: '/services/data/v58.0/sobjects/Contact',
          referenceId: `contact_${index}`,
          body: contact
        }))
      };

      const response = await this.makeRequest<{ compositeResponse: any[] }>('/composite', {
        method: 'POST',
        body: JSON.stringify(compositeRequest)
      });

      results.push(...response.compositeResponse);
    }
    
    return results;
  }

  // Account Methods
  async getAccounts(limit = 1000, offset = 0): Promise<SalesforceAccount[]> {
    const soql = `
      SELECT Id, Name, Type, Industry, Phone, Website, BillingCity, BillingState, BillingCountry, CreatedDate, LastModifiedDate
      FROM Account
      ORDER BY CreatedDate DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    
    const response = await this.query<SalesforceAccount>(soql);
    return response.records;
  }

  async createAccounts(accounts: Partial<SalesforceAccount>[]): Promise<any[]> {
    const results = [];
    
    for (const batch of this.chunkArray(accounts, 200)) {
      const compositeRequest = {
        allOrNone: false,
        compositeRequest: batch.map((account, index) => ({
          method: 'POST',
          url: '/services/data/v58.0/sobjects/Account',
          referenceId: `account_${index}`,
          body: account
        }))
      };

      const response = await this.makeRequest<{ compositeResponse: any[] }>('/composite', {
        method: 'POST',
        body: JSON.stringify(compositeRequest)
      });

      results.push(...response.compositeResponse);
    }
    
    return results;
  }

  // Opportunity Methods
  async getOpportunities(limit = 1000, offset = 0): Promise<SalesforceOpportunity[]> {
    const soql = `
      SELECT Id, Name, AccountId, Amount, CloseDate, StageName, Probability, Type, LeadSource, CreatedDate, LastModifiedDate
      FROM Opportunity
      ORDER BY CreatedDate DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    
    const response = await this.query<SalesforceOpportunity>(soql);
    return response.records;
  }

  async createOpportunities(opportunities: Partial<SalesforceOpportunity>[]): Promise<any[]> {
    const results = [];
    
    for (const batch of this.chunkArray(opportunities, 200)) {
      const compositeRequest = {
        allOrNone: false,
        compositeRequest: batch.map((opportunity, index) => ({
          method: 'POST',
          url: '/services/data/v58.0/sobjects/Opportunity',
          referenceId: `opportunity_${index}`,
          body: opportunity
        }))
      };

      const response = await this.makeRequest<{ compositeResponse: any[] }>('/composite', {
        method: 'POST',
        body: JSON.stringify(compositeRequest)
      });

      results.push(...response.compositeResponse);
    }
    
    return results;
  }

  // Bulk API Methods
  async createBulkJob(objectType: string, operation: 'insert' | 'update' | 'upsert' | 'delete'): Promise<SalesforceBulkJobInfo> {
    const jobInfo = {
      object: objectType,
      operation: operation,
      contentType: 'JSON',
      lineEnding: 'LF'
    };

    return this.makeRequest('/jobs/ingest', {
      method: 'POST',
      body: JSON.stringify(jobInfo)
    });
  }

  async addBatchToJob(jobId: string, data: any[]): Promise<void> {
    const csvData = this.convertToCSV(data);
    
    await fetch(`${this.credential.instance_url}/services/data/v58.0/jobs/ingest/${jobId}/batches`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.credential.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  async closeBulkJob(jobId: string): Promise<SalesforceBulkJobInfo> {
    return this.makeRequest(`/jobs/ingest/${jobId}`, {
      method: 'PATCH',
      body: JSON.stringify({ state: 'UploadComplete' })
    });
  }

  async getBulkJobInfo(jobId: string): Promise<SalesforceBulkJobInfo> {
    return this.makeRequest(`/jobs/ingest/${jobId}`);
  }

  // Test connection
  async testConnection(): Promise<{ success: boolean; message: string; userInfo?: any }> {
    try {
      const response = await this.makeRequest('/sobjects/User/');
      return {
        success: true,
        message: 'Successfully connected to Salesforce',
        userInfo: response
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Utility Methods
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }
}

// Singleton pattern for easy access
let salesforceClientInstance: SalesforceClient | null = null;

export const createSalesforceClient = (credential: SalesforceCredential): SalesforceClient => {
  salesforceClientInstance = new SalesforceClient(credential);
  return salesforceClientInstance;
};

export const getSalesforceClient = (): SalesforceClient => {
  if (!salesforceClientInstance) {
    throw new Error('Salesforce client not initialized. Call createSalesforceClient first.');
  }
  return salesforceClientInstance;
};