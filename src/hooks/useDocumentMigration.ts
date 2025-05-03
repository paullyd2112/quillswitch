
import { useState } from "react";
import { 
  batchProcessDocuments,
  getDocumentMigrationsForProject,
  DocumentInfo,
  DocumentMigrationParams
} from "@/services/migration/documentMigrationService";

interface UseDocumentMigrationProps {
  projectId: string;
  sourceSystem: string;
  destinationSystem: string;
}

export const useDocumentMigration = ({
  projectId,
  sourceSystem,
  destinationSystem
}: UseDocumentMigrationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const [results, setResults] = useState<{ success: number, failed: number } | null>(null);
  const [documents, setDocuments] = useState<Array<any>>([]);

  /**
   * Migrate documents for a specific record
   */
  const migrateDocumentsForRecord = async (
    recordType: string, 
    recordId: string, 
    documents: DocumentInfo[]
  ) => {
    if (!projectId || !sourceSystem || !destinationSystem) {
      console.error("Missing required parameters for document migration");
      return false;
    }

    setIsLoading(true);
    setProgress({ processed: 0, total: documents.length });
    setResults(null);

    try {
      const params: DocumentMigrationParams = {
        projectId,
        sourceSystem,
        recordType,
        recordId
      };

      const result = await batchProcessDocuments(
        params, 
        documents, 
        destinationSystem,
        (processed, total) => {
          setProgress({ processed, total });
        }
      );

      setResults(result);
      return result.failed === 0;
    } catch (error) {
      console.error("Error migrating documents:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load document migrations for the current project
   */
  const loadDocumentMigrations = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    try {
      const data = await getDocumentMigrationsForProject(projectId);
      setDocuments(data || []);
      return data;
    } catch (error) {
      console.error("Error loading document migrations:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    progress,
    results,
    documents,
    migrateDocumentsForRecord,
    loadDocumentMigrations
  };
};

export default useDocumentMigration;
