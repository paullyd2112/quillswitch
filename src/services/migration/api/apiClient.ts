
/**
 * Migration API Client - Demo version
 * This provides mock functionality for demonstration purposes
 */

export interface MigrationData {
  name: string;
  source: {
    type: string;
    credentials: Record<string, any>;
  };
  destination: {
    type: string;
    credentials: Record<string, any>;
  };
  dataTypes: Array<{
    type: string;
    filters?: Record<string, any>;
    fieldMapping?: Record<string, string>;
  }>;
  schedule: {
    startNow: boolean;
  };
}

export interface MigrationResponse {
  data: {
    migrationId: string;
    status: string;
  };
}

/**
 * Demo API Client class
 */
export class ApiClient {
  private static instance: ApiClient;

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Create a migration (demo version)
   */
  public async createMigration(migrationData: MigrationData): Promise<MigrationResponse> {
    console.log("Demo API: Creating migration with data:", migrationData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock response
    const response: MigrationResponse = {
      data: {
        migrationId: `demo_migration_${Date.now()}`,
        status: 'initiated'
      }
    };
    
    console.log("Demo API: Migration created successfully:", response);
    return response;
  }

  /**
   * Get migration status (demo version)
   */
  public async getMigrationStatus(migrationId: string): Promise<{ status: string; progress: number }> {
    console.log("Demo API: Getting status for migration:", migrationId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 'running',
      progress: Math.floor(Math.random() * 100)
    };
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
