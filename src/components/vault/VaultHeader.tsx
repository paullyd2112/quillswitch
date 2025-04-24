
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield } from "lucide-react";

interface VaultHeaderProps {
  onAddClick: () => void;
  showAddForm: boolean;
}

const VaultHeader: React.FC<VaultHeaderProps> = ({ onAddClick, showAddForm }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Credentials Vault</h2>
        <p className="text-muted-foreground">
          Securely store and manage your API keys, tokens, and other service credentials.
        </p>
      </div>
      <div className="flex items-center">
        <Badge variant="outline" className="mr-2 bg-green-50 text-green-700 border-green-200">
          <Shield className="h-3 w-3 mr-1" />
          Encrypted Storage
        </Badge>
        <Button onClick={onAddClick} disabled={showAddForm}>
          <Plus className="h-4 w-4 mr-1" />
          Add Credential
        </Button>
      </div>
    </div>
  );
};

export default VaultHeader;
