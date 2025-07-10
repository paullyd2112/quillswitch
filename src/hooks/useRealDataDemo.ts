import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDemoAccess, DemoSession } from './useDemoAccess';

export interface RealDataOptions {
  sourceConnectionId: string;
  destinationConnectionId: string;
  dataTypes: string[];
  recordLimit: number;
}

export interface ExtractedData {
  objectType: string;
  records: any[];
  totalCount: number;
}

export const useRealDataDemo = () => {
  const { toast } = useToast();
  const { createDemoSession, updateSessionStatus } = useDemoAccess();
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);

  const extractRealData = async (options: RealDataOptions): Promise<DemoSession | null> => {
    setIsExtracting(true);
    setExtractionProgress(0);
    setExtractedData([]);

    try {
      // Create demo session
      const session = await createDemoSession(
        'real_data',
        'unified_api',
        options.sourceConnectionId,
        options.destinationConnectionId
      );

      if (!session) throw new Error('Failed to create demo session');

      // Update session status to processing
      await updateSessionStatus(session.id, 'processing');

      let totalRecords = 0;
      const extractedDataArray: ExtractedData[] = [];

      // Extract data for each selected object type
      for (let i = 0; i < options.dataTypes.length; i++) {
        const objectType = options.dataTypes[i];
        
        try {
          console.log(`Extracting ${objectType} data...`);
          
          // Call unified data extraction edge function
          const { data, error } = await supabase.functions.invoke('unified-data-extraction', {
            body: {
              connection_id: options.sourceConnectionId,
              object_type: objectType,
              limit: Math.floor(options.recordLimit / options.dataTypes.length), // Distribute limit across data types
              session_id: session.id
            }
          });

          if (error) {
            console.error(`Error extracting ${objectType}:`, error);
            continue; // Continue with other data types
          }

          if (data?.success && data?.records) {
            const recordCount = data.records.length;
            totalRecords += recordCount;

            extractedDataArray.push({
              objectType,
              records: data.records,
              totalCount: recordCount
            });

            console.log(`Extracted ${recordCount} ${objectType} records`);
          }

        } catch (error) {
          console.error(`Error extracting ${objectType}:`, error);
        }

        // Update progress
        setExtractionProgress(((i + 1) / options.dataTypes.length) * 100);
      }

      setExtractedData(extractedDataArray);

      // Update session with final record count and status
      if (totalRecords > 0) {
        await updateSessionStatus(session.id, 'completed', totalRecords);
        
        toast({
          title: "Data Extraction Complete",
          description: `Successfully extracted ${totalRecords} records from your CRM for the demo.`
        });
      } else {
        await updateSessionStatus(session.id, 'failed');
        
        toast({
          title: "No Data Extracted",
          description: "No records were found for the selected data types. Please check your CRM connection.",
          variant: "destructive"
        });
      }

      return session;

    } catch (error) {
      console.error('Real data extraction error:', error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract real data from your CRM. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsExtracting(false);
    }
  };

  const validateConnections = async (sourceId: string, destinationId: string): Promise<boolean> => {
    try {
      // Test both connections
      const [sourceTest, destinationTest] = await Promise.all([
        supabase.functions.invoke('test-unified', {
          body: { connection_id: sourceId }
        }),
        supabase.functions.invoke('test-unified', {
          body: { connection_id: destinationId }
        })
      ]);

      const sourceValid = sourceTest.data?.success;
      const destinationValid = destinationTest.data?.success;

      if (!sourceValid || !destinationValid) {
        toast({
          title: "Connection Issue",
          description: `${!sourceValid ? 'Source' : 'Destination'} CRM connection is not working properly. Please reconnect.`,
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Connection validation error:', error);
      toast({
        title: "Validation Failed",
        description: "Unable to validate CRM connections. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isExtracting,
    extractionProgress,
    extractedData,
    extractRealData,
    validateConnections
  };
};