
import { useCallback } from "react";
import { apiClient } from "@/services/migration/apiClient";
import { useMigrationError } from "./use-migration-error";

type UseMigrationApiReturn = {
  createMigration: () => Promise<string | undefined>;
};

/**
 * Hook to manage API interactions for migrations
 */
export const useMigrationApi = (): UseMigrationApiReturn => {
  const { handleMigrationError } = useMigrationError();
  
  // Create a migration using the API
  const createMigration = useCallback(async () => {
    try {
      // Prepare migration data for API
      const migrationData = {
        name: "Demo CRM Migration",
        source: {
          type: "salesforce",
          credentials: {
            accessToken: "demo_token_sf",
            instanceUrl: "https://demo.salesforce.com"
          }
        },
        destination: {
          type: "hubspot",
          credentials: {
            apiKey: "demo_hubspot_key"
          }
        },
        dataTypes: [
          {
            type: "contacts",
            filters: {
              updatedAfter: "2023-01-01T00:00:00Z"
            },
            fieldMapping: {
              firstName: "firstName",
              lastName: "lastName",
              email: "email"
            }
          },
          {
            type: "accounts",
            fieldMapping: {
              name: "name",
              industry: "industry"
            }
          }
        ],
        schedule: {
          startNow: true
        }
      };

      console.log("Creating migration with data:", migrationData);
      
      // Call the migrations API
      const response = await apiClient.createMigration(migrationData);
      console.log("Migration created successfully:", response);
      
      return response.data.migrationId;
    } catch (error) {
      handleMigrationError(error);
      throw error;
    }
  }, [handleMigrationError]);
  
  return {
    createMigration
  };
};
