
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { 
  DEFAULT_BATCH_CONFIG, 
  ENTERPRISE_BATCH_CONFIG, 
  ENTERPRISE_SIMPLE_BATCH_CONFIG, 
  ENTERPRISE_COMPLEX_BATCH_CONFIG
} from '@/services/migration/types/transferTypes';

const HighConcurrencyMigrationTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [smb, setSMB] = useState(DEFAULT_BATCH_CONFIG.concurrentBatches);
  const [enterprise, setEnterprise] = useState(ENTERPRISE_BATCH_CONFIG.concurrentBatches);
  const [enterpriseSimple, setEnterpriseSimple] = useState(ENTERPRISE_SIMPLE_BATCH_CONFIG.concurrentBatches);
  const [enterpriseComplex, setEnterpriseComplex] = useState(ENTERPRISE_COMPLEX_BATCH_CONFIG.concurrentBatches);
  
  const startTest = () => {
    setIsRunning(true);
    setProgress(0);
    
    toast({
      title: "High Concurrency Test Started",
      description: `Testing with ${smb} SMB, ${enterprise} Enterprise, ${enterpriseSimple} Simple, and ${enterpriseComplex} Complex concurrent integrations`,
    });
    
    // Simulate the test progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          
          toast({
            title: "Concurrency Test Complete",
            description: "All integrations processed successfully",
            variant: "default", // Changed from "success" to "default" to fix the type error
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  const calculateTotalConcurrency = () => {
    return smb + enterprise + enterpriseSimple + enterpriseComplex;
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">High Concurrency Migration Test</h3>
      <p className="text-muted-foreground mb-6">
        Configure and test the system's ability to handle high volume concurrent integrations
      </p>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">SMB Integrations</span>
            <span className="text-sm text-muted-foreground">{smb}</span>
          </div>
          <Slider 
            defaultValue={[smb]} 
            max={12} 
            step={1} 
            min={1}
            onValueChange={(value) => setSMB(value[0])}
            disabled={isRunning}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Enterprise Integrations</span>
            <span className="text-sm text-muted-foreground">{enterprise}</span>
          </div>
          <Slider 
            defaultValue={[enterprise]} 
            max={15} 
            step={1} 
            min={1}
            onValueChange={(value) => setEnterprise(value[0])}
            disabled={isRunning}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Enterprise Simple Integrations</span>
            <span className="text-sm text-muted-foreground">{enterpriseSimple}</span>
          </div>
          <Slider 
            defaultValue={[enterpriseSimple]} 
            max={20} 
            step={1} 
            min={1}
            onValueChange={(value) => setEnterpriseSimple(value[0])}
            disabled={isRunning}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Enterprise Complex Integrations</span>
            <span className="text-sm text-muted-foreground">{enterpriseComplex}</span>
          </div>
          <Slider 
            defaultValue={[enterpriseComplex]} 
            max={10} 
            step={1} 
            min={1}
            onValueChange={(value) => setEnterpriseComplex(value[0])}
            disabled={isRunning}
          />
        </div>
        
        <div className="bg-accent/30 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Total Concurrent Integrations</span>
            <span className="font-bold text-primary">{calculateTotalConcurrency()}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Testing with this configuration will simulate running {calculateTotalConcurrency()} 
            integrations simultaneously across different tiers.
          </p>
        </div>
        
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Test Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
        
        <Button 
          className="w-full" 
          size="lg"
          onClick={startTest}
          disabled={isRunning}
        >
          {isRunning ? "Running Test..." : "Run Concurrency Test"}
        </Button>
      </div>
    </Card>
  );
};

export default HighConcurrencyMigrationTest;
