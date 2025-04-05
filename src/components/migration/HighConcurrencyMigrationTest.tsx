
import React, { useState, useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { formatTimeRemaining } from '@/components/home/migration-demo/utils/format-utils';
import MultiSourceSelection, { CrmSource } from './MultiSourceSelection';
import { Database, ServerCog } from 'lucide-react';

const HighConcurrencyMigrationTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [smb, setSMB] = useState(DEFAULT_BATCH_CONFIG.concurrentBatches);
  const [enterprise, setEnterprise] = useState(ENTERPRISE_BATCH_CONFIG.concurrentBatches);
  const [enterpriseSimple, setEnterpriseSimple] = useState(ENTERPRISE_SIMPLE_BATCH_CONFIG.concurrentBatches);
  const [enterpriseComplex, setEnterpriseComplex] = useState(ENTERPRISE_COMPLEX_BATCH_CONFIG.concurrentBatches);
  
  // Initial CRM sources
  const initialSources: CrmSource[] = [
    {
      id: '1',
      name: 'Salesforce',
      type: 'salesforce',
      selected: true,
      recordCounts: {
        contacts: 20000,
        accounts: 5000,
        opportunities: 5000,
        customObjects: 2000
      },
      complexity: 'medium'
    },
    {
      id: '2',
      name: 'HubSpot',
      type: 'hubspot',
      selected: false,
      recordCounts: {
        contacts: 15000,
        accounts: 3000,
        opportunities: 2000,
        customObjects: 1000
      },
      complexity: 'medium'
    },
    {
      id: '3',
      name: 'Microsoft Dynamics',
      type: 'dynamics',
      selected: false,
      recordCounts: {
        contacts: 25000,
        accounts: 7000,
        opportunities: 6000,
        customObjects: 3000
      },
      complexity: 'complex'
    },
    {
      id: '4',
      name: 'Zoho CRM',
      type: 'zoho',
      selected: false,
      recordCounts: {
        contacts: 10000,
        accounts: 2000,
        opportunities: 1500,
        customObjects: 500
      },
      complexity: 'simple'
    },
    {
      id: '5',
      name: 'Pipedrive',
      type: 'pipedrive',
      selected: false,
      recordCounts: {
        contacts: 8000,
        accounts: 1500,
        opportunities: 1000,
        customObjects: 300
      },
      complexity: 'simple'
    }
  ];
  
  const [sources, setSources] = useState<CrmSource[]>(initialSources);
  
  const startTest = () => {
    setIsRunning(true);
    setProgress(0);
    
    const selectedSources = sources.filter(source => source.selected);
    
    toast({
      title: "Multi-CRM Migration Test Started",
      description: `Testing migration from ${selectedSources.length} CRM sources with ${calculateTotalConcurrency()} concurrent integrations`,
    });
    
    // Simulate the test progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          
          toast({
            title: "Multi-CRM Migration Test Complete",
            description: `Successfully migrated data from ${selectedSources.length} sources`,
            variant: "default",
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
  
  // Calculate total records across all selected sources
  const calculateTotalRecords = (recordType: keyof CrmSource['recordCounts']) => {
    return sources
      .filter(source => source.selected)
      .reduce((total, source) => total + source.recordCounts[recordType], 0);
  };
  
  // Calculate migration time estimates
  const calculateMigrationTimeEstimate = () => {
    const selectedSources = sources.filter(source => source.selected);
    
    if (selectedSources.length === 0) {
      return {
        seconds: 0,
        formatted: '0s'
      };
    }
    
    // Base processing rates (records per second) for different object types and complexity
    const baseRates = {
      contact: { simple: 50, medium: 30, complex: 15 },
      account: { simple: 40, medium: 20, complex: 10 },
      opportunity: { simple: 30, medium: 15, complex: 7 },
      custom: { simple: 35, medium: 18, complex: 8 }
    };
    
    // Calculate total duration for each source
    let totalDuration = 0;
    
    selectedSources.forEach(source => {
      const complexity = source.complexity;
      
      // Calculate base duration for each object type in this source
      const contactDuration = source.recordCounts.contacts / baseRates.contact[complexity];
      const accountDuration = source.recordCounts.accounts / baseRates.account[complexity];
      const opportunityDuration = source.recordCounts.opportunities / baseRates.opportunity[complexity];
      const customDuration = source.recordCounts.customObjects / baseRates.custom[complexity];
      
      // Add this source's duration to the total
      totalDuration += contactDuration + accountDuration + opportunityDuration + customDuration;
    });
    
    // Apply concurrency factor (simplified estimation)
    // We'll use the average concurrency as a divisor
    const avgConcurrency = calculateTotalConcurrency() / 4;
    const estimatedDuration = totalDuration / (avgConcurrency * (1 + (selectedSources.length > 1 ? 0.2 : 0)));
    
    // If multiple sources, add 20% overhead for cross-CRM coordination
    const adjustedDuration = selectedSources.length > 1 
      ? estimatedDuration * 1.2 
      : estimatedDuration;
    
    return {
      seconds: Math.round(adjustedDuration),
      formatted: formatTimeRemaining(Math.round(adjustedDuration))
    };
  };
  
  const timeEstimate = calculateMigrationTimeEstimate();
  
  // Total record counts from all selected sources
  const totalContacts = calculateTotalRecords('contacts');
  const totalAccounts = calculateTotalRecords('accounts');
  const totalOpportunities = calculateTotalRecords('opportunities');
  const totalCustomObjects = calculateTotalRecords('customObjects');
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Multi-CRM Migration Test</h3>
      <p className="text-muted-foreground mb-6">
        Configure and test the system's ability to handle migrations from multiple CRM sources simultaneously
      </p>
      
      <div className="space-y-6">
        <MultiSourceSelection 
          sources={sources}
          onSourcesChange={setSources}
        />
        
        <Separator className="my-6" />
        
        <div>
          <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
            <ServerCog className="h-5 w-5 text-primary" />
            <span>Concurrency Configuration</span>
          </h4>
          
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
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <span>Migration Summary</span>
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-accent/30 p-4 rounded-md">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Contacts:</span>
                  <span className="font-medium">{totalContacts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Accounts:</span>
                  <span className="font-medium">{totalAccounts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Opportunities:</span>
                  <span className="font-medium">{totalOpportunities.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Custom Objects:</span>
                  <span className="font-medium">{totalCustomObjects.toLocaleString()}</span>
                </div>
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
          </div>
        </div>
        
        <div className="bg-brand-50/30 dark:bg-brand-900/20 p-4 rounded-md border border-brand-200/30 dark:border-brand-700/20">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Estimated Migration Time</span>
            <span className="font-bold text-brand-600 dark:text-brand-400">{timeEstimate.formatted}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on your configuration and data volume, we estimate your migration would take approximately {timeEstimate.formatted}.
            {sources.filter(s => s.selected).length > 1 && 
              " The estimate includes a 20% overhead for coordinating migrations from multiple CRM sources."}
          </p>
          
          {timeEstimate.seconds > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Estimated records/sec: </span>
                {Math.round((totalContacts + totalAccounts + totalOpportunities + totalCustomObjects) / timeEstimate.seconds)}
              </div>
              <div>
                <span className="font-medium">Selected sources: </span>
                {sources.filter(s => s.selected).length}
              </div>
              <div>
                <span className="font-medium">Total records: </span>
                {(totalContacts + totalAccounts + totalOpportunities + totalCustomObjects).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Concurrency factor: </span>
                {calculateTotalConcurrency()}
              </div>
            </div>
          )}
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
          disabled={isRunning || sources.filter(s => s.selected).length === 0}
        >
          {isRunning ? "Running Test..." : sources.filter(s => s.selected).length === 0 ? 
            "Select at least one CRM source" : "Run Multi-CRM Migration Test"}
        </Button>
      </div>
    </Card>
  );
};

export default HighConcurrencyMigrationTest;
