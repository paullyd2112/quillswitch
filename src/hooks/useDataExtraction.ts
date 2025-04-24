
import { useState } from "react";
import { 
  extractDataPreview, 
  extractFullDataSet, 
  ExtractedData, 
  ExtractPreviewOptions 
} from "@/services/migration/extractionService";

export const useDataExtraction = () => {
  const [previewData, setPreviewData] = useState<ExtractedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractionProgress, setExtractionProgress] = useState(0);

  /**
   * Fetch preview data from the specified CRM source
   */
  const fetchPreview = async (options: ExtractPreviewOptions) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await extractDataPreview(options);
      setPreviewData(data);
      return data;
    } catch (err: any) {
      console.error("Error fetching data preview:", err);
      setError(err.message || "Failed to fetch data preview");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Extract full data set for actual migration
   */
  const extractData = async (options: ExtractPreviewOptions) => {
    setIsLoading(true);
    setError(null);
    setExtractionProgress(0);
    
    try {
      const data = await extractFullDataSet({
        ...options,
        onProgress: (progress) => {
          setExtractionProgress(progress);
        }
      });
      
      return data;
    } catch (err: any) {
      console.error("Error extracting data:", err);
      setError(err.message || "Failed to extract data");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset state
   */
  const resetExtraction = () => {
    setPreviewData([]);
    setIsLoading(false);
    setError(null);
    setExtractionProgress(0);
  };

  return {
    previewData,
    isLoading,
    error,
    extractionProgress,
    fetchPreview,
    extractData,
    resetExtraction
  };
};

export default useDataExtraction;
