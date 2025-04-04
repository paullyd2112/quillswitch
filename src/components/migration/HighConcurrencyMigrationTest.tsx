
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { formatTimeRemaining } from '@/components/home/migration-demo/utils/format-utils';

const HighConcurrencyMigrationTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [smb, setSMB] = useState(DEFAULT_BATCH_CONFIG.concurrentBatches);
  const [enterprise, setEnterprise] = useState(ENTERPRISE_BATCH_CONFIG.concurrentBatches);
  const [enterpriseSimple, setEnterpriseSimple] = useState(ENTERPRISE_SIMPLE_BATCH_CONFIG.concurrentBatches);
  const [enterpriseComplex, setEnterpriseComplex] = useState(ENTERPRISE_COMPLEX_BATCH_CONFIG.concurrentBatches);
  
  // New state for record counts
  const [contactCount, setContactCount] = useState(20000);
  const [opportunityCount, setOpportunityCount] = useState(5000);
  const [accountCount, setAccountCount] = useState(5000);
  const [customObjectCount, setCustomObjectCount] = useState(2000);
  
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
  
  // Calculate migration time estimates
  const calculateMigrationTimeEstimate = () => {
    // Base processing rates (records per second) for different object types
    const baseRates = {
      contact: { simple: 50, medium: 30, complex: 15 },
      account: { simple: 40, medium: 20, complex: 10 },
      opportunity: { simple: 30, medium: 15, complex: 7 },
      custom: { simple: 35, medium: 18, complex: 8 }
    };
    
    // Use medium complexity as default
    const complexity = 'medium';
    
    // Calculate base duration for each object type
    const contactDuration = contactCount / baseRates.contact[complexity];
    const accountDuration = accountCount / baseRates.account[complexity];
    const opportunityDuration = opportunityCount / baseRates.opportunity[complexity];
    const customDuration = customObjectCount / baseRates.custom[complexity];
    
    // Total duration in seconds without concurrency
    const baseDuration = contactDuration + accountDuration + opportunityDuration + customDuration;
    
    // Apply concurrency factor (simplified estimation)
    // We'll use the average concurrency as a divisor
    const avgConcurrency = calculateTotalConcurrency() / 4;
    const estimatedDuration = baseDuration / avgConcurrency;
    
    return {
      seconds: Math.round(estimatedDuration),
      formatted: formatTimeRemaining(Math.round(estimatedDuration))
    };
  };
  
  const timeEstimate = calculateMigrationTimeEstimate();
  
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
        
        <Separator className="my-4" />
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contacts</label>
            <Input 
              type="number" 
              value={contactCount}
              onChange={(e) => setContactCount(parseInt(e.target.value) || 0)}
              disabled={isRunning}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Opportunities</label>
            <Input 
              type="number" 
              value={opportunityCount}
              onChange={(e) => setOpportunityCount(parseInt(e.target.value) || 0)}
              disabled={isRunning}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Accounts</label>
            <Input 
              type="number" 
              value={accountCount}
              onChange={(e) => setAccountCount(parseInt(e.target.value) || 0)}
              disabled={isRunning}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Objects</label>
            <Input 
              type="number" 
              value={customObjectCount}
              onChange={(e) => setCustomObjectCount(parseInt(e.target.value) || 0)}
              disabled={isRunning}
            />
          </div>
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
        
        <div className="bg-brand-50/30 dark:bg-brand-900/20 p-4 rounded-md border border-brand-200/30 dark:border-brand-700/20">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Estimated Migration Time</span>
            <span className="font-bold text-brand-600 dark:text-brand-400">{timeEstimate.formatted}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on your configuration and data volume, we estimate your migration would take approximately {timeEstimate.formatted}.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Estimated records per second: 
            Contacts: {Math.round(contactCount / timeEstimate.seconds * calculateTotalConcurrency() / 4)} | 
            Opportunities: {Math.round(opportunityCount / timeEstimate.seconds * calculateTotalConcurrency() / 4)} | 
            Accounts: {Math.round(accountCount / timeEstimate.seconds * calculateTotalConcurrency() / 4)}
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
