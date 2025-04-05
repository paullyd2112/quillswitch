
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ServerCog } from 'lucide-react';

interface ConcurrencyConfigProps {
  smb: number;
  enterprise: number;
  enterpriseSimple: number;
  enterpriseComplex: number;
  onSmbChange: (value: number) => void;
  onEnterpriseChange: (value: number) => void;
  onEnterpriseSimpleChange: (value: number) => void;
  onEnterpriseComplexChange: (value: number) => void;
  isRunning: boolean;
}

const ConcurrencyConfig: React.FC<ConcurrencyConfigProps> = ({
  smb,
  enterprise,
  enterpriseSimple,
  enterpriseComplex,
  onSmbChange,
  onEnterpriseChange,
  onEnterpriseSimpleChange,
  onEnterpriseComplexChange,
  isRunning
}) => {
  return (
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
            onValueChange={(value) => onSmbChange(value[0])}
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
            onValueChange={(value) => onEnterpriseChange(value[0])}
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
            onValueChange={(value) => onEnterpriseSimpleChange(value[0])}
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
            onValueChange={(value) => onEnterpriseComplexChange(value[0])}
            disabled={isRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default ConcurrencyConfig;
