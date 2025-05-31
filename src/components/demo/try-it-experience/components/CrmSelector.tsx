
import React from "react";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { CrmSystem } from "../types";

interface CrmSelectorProps {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  crmSystems: CrmSystem[];
  selectedCrm: CrmSystem | null;
  onSelectCrm: (crm: CrmSystem) => void;
}

const CrmSelector: React.FC<CrmSelectorProps> = ({
  title,
  searchTerm,
  onSearchChange,
  crmSystems,
  selectedCrm,
  onSelectCrm
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">{title}</h4>
      
      <Input
        type="search"
        placeholder="Search CRM..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <div className="max-h-48 overflow-y-auto">
        {crmSystems.length > 0 ? (
          crmSystems.map(crm => (
            <div
              key={crm.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedCrm?.id === crm.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/80"
              }`}
              onClick={() => onSelectCrm(crm)}
            >
              {crm.name}
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No CRM systems match your search.
          </div>
        )}
      </div>
      
      {selectedCrm && (
        <div className="flex items-center gap-2 mt-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>{selectedCrm.name} connected</span>
        </div>
      )}
    </div>
  );
};

export default CrmSelector;
