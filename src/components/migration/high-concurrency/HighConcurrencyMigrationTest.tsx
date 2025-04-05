
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  DEFAULT_BATCH_CONFIG, 
  ENTERPRISE_BATCH_CONFIG, 
  ENTERPRISE_SIMPLE_BATCH_CONFIG, 
  ENTERPRISE_COMPLEX_BATCH_CONFIG
} from '@/services/migration/types/transferTypes';
import MultiSourceSelection, { CrmSource } from '../MultiSourceSelection';
import ConcurrencyConfig from './ConcurrencyConfig';
import MigrationSummary from './MigrationSummary';
import TimeEstimate from './TimeEstimate';
import ProgressIndicator from './ProgressIndicator';
import { 
  calculateTotalRecords, 
  calculateMigrationTimeEstimate, 
  initialCrmSources 
} from './utils';

const HighConcurrencyMigrationTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [smb, setSMB] = useState(DEFAULT_BATCH_CONFIG.concurrentBatches);
  const [enterprise, setEnterprise] = useState(ENTERPRISE_BATCH_CONFIG.concurrentBatches);
  const [enterpriseSimple, setEnterpriseSimple] = useState(ENTERPRISE_SIMPLE_BATCH_CONFIG.concurrentBatches);
  const [enterpriseComplex, setEnterpriseComplex] = useState(ENTERPRISE_COMPLEX_BATCH_CONFIG.concurrentBatches);
  const [sources, setSources] = useState<CrmSource[]>(initialCrmSources);
  
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
  
  // Total record counts across all selected sources
  const totalContacts = calculateTotalRecords(sources, 'contacts');
  const totalAccounts = calculateTotalRecords(sources, 'accounts');
  const totalOpportunities = calculateTotalRecords(sources, 'opportunities');
  const totalCustomObjects = calculateTotalRecords(sources, 'customObjects');
  
  const totalRecords = totalContacts + totalAccounts + totalOpportunities + totalCustomObjects;
  const totalConcurrency = calculateTotalConcurrency();
  const selectedSourcesCount = sources.filter(s => s.selected).length;
  
  // Calculate migration time estimates
  const timeEstimate = calculateMigrationTimeEstimate(sources, totalConcurrency);
  
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
        
        <ConcurrencyConfig
          smb={smb}
          enterprise={enterprise}
          enterpriseSimple={enterpriseSimple}
          enterpriseComplex={enterpriseComplex}
          onSmbChange={setSMB}
          onEnterpriseChange={setEnterprise}
          onEnterpriseSimpleChange={setEnterpriseSimple}
          onEnterpriseComplexChange={setEnterpriseComplex}
          isRunning={isRunning}
        />
        
        <Separator className="my-4" />
        
        <MigrationSummary
          totalContacts={totalContacts}
          totalAccounts={totalAccounts}
          totalOpportunities={totalOpportunities}
          totalCustomObjects={totalCustomObjects}
          totalConcurrency={totalConcurrency}
          selectedSourcesCount={selectedSourcesCount}
        />
        
        <TimeEstimate
          timeEstimate={timeEstimate}
          selectedSourcesCount={selectedSourcesCount}
          totalRecords={totalRecords}
          totalConcurrency={totalConcurrency}
        />
        
        <ProgressIndicator isRunning={isRunning} progress={progress} />
        
        <Button 
          className="w-full" 
          size="lg"
          onClick={startTest}
          disabled={isRunning || selectedSourcesCount === 0}
        >
          {isRunning ? "Running Test..." : selectedSourcesCount === 0 ? 
            "Select at least one CRM source" : "Run Multi-CRM Migration Test"}
        </Button>
      </div>
    </Card>
  );
};

export default HighConcurrencyMigrationTest;
