
import { useCallback } from "react";
import { useMigrationError } from "./use-migration-error";
import { apiClient } from "@/services/migration/api/apiClient";

type UseMigrationApiReturn = {
  createMigration: (migrationData: any) => Promise<string | undefined>;
  executeMigration: (params: {
    projectId: string;
    destinationConnectionId: string;
    objectType: string;
    batchSize?: number;
  }) => Promise<{success: boolean, migratedCount: number, failedCount: number}>;
  getMigrationStatus: (migrationId: string) => Promise<{status: string, progress: number}>;
};

/**
 * Hook to manage API interactions for migrations - Production version
 */
export const useMigrationApi = (): UseMigrationApiReturn => {
  const { handleMigrationError } = useMigrationError();
  
  // Create a migration using the production API
  const createMigration = useCallback(async (migrationData: any) => {
    try {
      console.log("Creating migration with data:", migrationData);
      
      const response = await apiClient.createMigration(migrationData);
      
      if (!response.data?.migrationId) {
        throw new Error("Migration creation failed - no migration ID returned");
      }
      
      console.log("Migration created successfully with ID:", response.data.migrationId);
      return response.data.migrationId;
    } catch (error) {
      console.error("Migration creation failed:", error);
      handleMigrationError(error);
      throw error;
    }
  }, [handleMigrationError]);

  // Execute migration for a specific object type
  const executeMigration = useCallback(async (params: {
    projectId: string;
    destinationConnectionId: string;
    objectType: string;
    batchSize?: number;
  }) => {
    try {
      console.log("Executing migration:", params);
      
      const result = await apiClient.executeMigration(params);
      
      console.log("Migration execution completed:", result);
      return result;
    } catch (error) {
      console.error("Migration execution failed:", error);
      handleMigrationError(error);
      throw error;
    }
  }, [handleMigrationError]);

  // Get migration status
  const getMigrationStatus = useCallback(async (migrationId: string) => {
    try {
      const status = await apiClient.getMigrationStatus(migrationId);
      console.log("Migration status retrieved:", status);
      return status;
    } catch (error) {
      console.error("Failed to get migration status:", error);
      handleMigrationError(error);
      throw error;
    }
  }, [handleMigrationError]);
  
  return {
    createMigration,
    executeMigration,
    getMigrationStatus
  };
};
