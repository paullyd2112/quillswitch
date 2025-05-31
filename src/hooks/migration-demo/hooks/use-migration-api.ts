
import { useCallback } from "react";
import { useMigrationError } from "./use-migration-error";

type UseMigrationApiReturn = {
  createMigration: () => Promise<string | undefined>;
};

/**
 * Hook to manage API interactions for migrations
 */
export const useMigrationApi = (): UseMigrationApiReturn => {
  const { handleMigrationError } = useMigrationError();
  
  // Create a migration using a mock API for demo purposes
  const createMigration = useCallback(async () => {
    try {
      // For demo purposes, simulate API call without actual backend
      console.log("Demo: Simulating migration creation...");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a mock migration ID
      const migrationId = `demo_migration_${Date.now()}`;
      
      console.log("Demo: Migration created successfully with ID:", migrationId);
      
      return migrationId;
    } catch (error) {
      console.warn("Demo: Migration API simulation failed, continuing with demo anyway:", error);
      // For demo, we'll continue even if there's an error
      return `demo_migration_fallback_${Date.now()}`;
    }
  }, []);
  
  return {
    createMigration
  };
};
