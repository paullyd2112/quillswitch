
import React, { useState } from 'react';
import { useDataLoadingContext } from './DataLoadingProvider';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ValidationResults } from './ValidationResults';
import { toast } from 'sonner';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface DataLoaderProps {
  title?: string;
  acceptedFileTypes?: string;
  onComplete?: (result: any) => void;
}

export const DataLoader: React.FC<DataLoaderProps> = ({
  title = 'Data Import',
  acceptedFileTypes = '.csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  onComplete
}) => {
  const { processData, isLoading, progress, validationIssues } = useDataLoadingContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedResult, setProcessedResult] = useState<any | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const parseCSV = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          
          // Extract headers from the first line
          const headers = lines[0].split(',').map(header => header.trim());
          
          // Parse each line into an object
          const records = lines
            .slice(1) // Skip header row
            .filter(line => line.trim() !== '') // Skip empty lines
            .map(line => {
              const values = line.split(',').map(value => value.trim());
              const record: Record<string, string> = {};
              
              headers.forEach((header, index) => {
                record[header] = values[index] || '';
              });
              
              return record;
            });
          
          resolve(records);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      let records: any[];

      // Parse file based on type
      if (selectedFile.name.endsWith('.csv')) {
        records = await parseCSV(selectedFile);
      } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        toast.error('Excel file support requires additional libraries. Please use CSV format.');
        return;
      } else {
        toast.error('Unsupported file format. Please use CSV format.');
        return;
      }

      if (records.length === 0) {
        toast.error('No records found in the file');
        return;
      }

      toast.info(`Processing ${records.length} records...`);
      const result = await processData(records);
      setProcessedResult(result);
      
      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleRetry = () => {
    setSelectedFile(null);
    setProcessedResult(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Processing data...</span>
            <span>{progress.processed} / {progress.total}</span>
          </div>
          <Progress value={(progress.processed / Math.max(progress.total, 1)) * 100} />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="text-lg font-medium">{progress.valid}</div>
              <div className="text-sm text-muted-foreground">Valid</div>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <div className="text-lg font-medium">{progress.errors}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <div className="text-lg font-medium">{progress.duplicates}</div>
              <div className="text-sm text-muted-foreground">Duplicates</div>
            </div>
          </div>
        </div>
      ) : processedResult ? (
        <div className="space-y-4">
          <Alert className={processedResult.errorCount === 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-yellow-50 dark:bg-yellow-900/20"}>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Processing Complete</AlertTitle>
            <AlertDescription>
              Successfully processed {processedResult.validCount} records.
              {processedResult.errorCount > 0 && ` Found ${processedResult.errorCount} records with errors.`}
              {processedResult.duplicateCount > 0 && ` Detected ${processedResult.duplicateCount} duplicate records.`}
            </AlertDescription>
          </Alert>
          
          {validationIssues.length > 0 && (
            <ValidationResults issues={validationIssues} onRetry={handleRetry} />
          )}
          
          {validationIssues.length === 0 && (
            <Button onClick={handleRetry}>Load Another File</Button>
          )}
        </div>
      ) : (
        <>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex flex-col items-center text-center p-4">
              <Upload size={32} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-4">
                Upload a CSV file containing your data
              </p>
              <Input 
                type="file" 
                onChange={handleFileSelect}
                accept={acceptedFileTypes}
                className="max-w-xs"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile}
            >
              Upload and Process
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
