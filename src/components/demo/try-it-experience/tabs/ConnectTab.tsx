
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CrmSelector from "../components/CrmSelector";
import { CrmSystem } from "../types";

interface ConnectTabProps {
  sourceCrm: CrmSystem | null;
  targetCrm: CrmSystem | null;
  searchTerm: string;
  filteredCrmSystems: CrmSystem[];
  onSearchChange: (value: string) => void;
  onSelectSourceCrm: (crm: CrmSystem) => void;
  onSelectTargetCrm: (crm: CrmSystem) => void;
  onNext: () => void;
  isComplete: boolean;
}

const ConnectTab: React.FC<ConnectTabProps> = ({
  sourceCrm,
  targetCrm,
  searchTerm,
  filteredCrmSystems,
  onSearchChange,
  onSelectSourceCrm,
  onSelectTargetCrm,
  onNext,
  isComplete
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Connect Your CRMs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CrmSelector
            title="Select Source CRM"
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            crmSystems={filteredCrmSystems}
            selectedCrm={sourceCrm}
            onSelectCrm={onSelectSourceCrm}
          />
          
          <CrmSelector
            title="Select Target CRM"
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            crmSystems={filteredCrmSystems}
            selectedCrm={targetCrm}
            onSelectCrm={onSelectTargetCrm}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onNext}
          disabled={!isComplete}
        >
          Next: Select Data <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ConnectTab;
