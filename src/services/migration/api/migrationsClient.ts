
import { BaseApiClient } from "./baseClient";

/**
 * Client for migrations-related API operations
 */
export class MigrationsApiClient extends BaseApiClient {
  /**
   * Create a new migration job
   */
  async createMigration(params: {
    name: string;
    source: {
      type: string;
      credentials: Record<string, string>;
    };
    destination: {
      type: string;
      credentials: Record<string, string>;
    };
    dataTypes: Array<{
      type: string;
      filters?: Record<string, any>;
      fieldMapping: Record<string, string>;
    }>;
    schedule?: {
      startNow: boolean;
    };
    options?: Record<string, any>;
  }) {
    return this.request<{success: boolean, data: any}>(
      'migrations/migrations',
      'POST',
      params
    );
  }
  
  /**
   * Get migration status
   */
  async getMigrationStatus(migrationId: string) {
    return this.request<{success: boolean, data: any}>(
      `migrations/${migrationId}`
    );
  }
}
