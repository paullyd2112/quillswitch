import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export const UnifiedTestButton: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const testUnifiedConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('test-unified');
      
      if (error) {
        throw new Error(error.message);
      }

      setResult(data);
      
      if (data.success) {
        toast({
          title: "✅ Unified.to Connection Successful!",
          description: `Found ${data.availableIntegrations} available integrations`,
          variant: "default"
        });
      } else {
        toast({
          title: "❌ Unified.to Connection Failed",
          description: data.error,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Test failed:', error);
      setResult({ success: false, error: error.message });
      toast({
        title: "❌ Test Failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={testUnifiedConnection}
        disabled={testing}
        className="w-full"
      >
        {testing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing Unified.to Connection...
          </>
        ) : (
          'Test Unified.to Integration'
        )}
      </Button>

      {result && (
        <div className={`p-4 rounded-lg border ${
          result.success 
            ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
            : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <h3 className="font-semibold">
              {result.success ? 'Connection Successful!' : 'Connection Failed'}
            </h3>
          </div>
          
          {result.success ? (
            <div className="space-y-2 text-sm">
              <p>✅ Unified.to API is working correctly</p>
              <p>📊 {result.availableIntegrations} integrations available</p>
              {result.sampleIntegrations?.length > 0 && (
                <div>
                  <p className="font-medium">Sample integrations:</p>
                  <ul className="list-disc list-inside ml-2">
                    {result.sampleIntegrations.map((integration: any, index: number) => (
                      <li key={index}>
                        {integration.name} ({integration.category})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm">
              <p className="text-red-600 font-medium">Error:</p>
              <p className="text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};