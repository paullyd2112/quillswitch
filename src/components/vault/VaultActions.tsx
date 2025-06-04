
import React from "react";
import { Card } from "@/components/ui/card";
import AddCredentialForm from "./AddCredentialForm";
import BulkActions from "./BulkActions";
import { ServiceCredential } from "./types";

interface VaultActionsProps {
  showAddForm: boolean;
  onAddCredential: (credential: ServiceCredential) => Promise<void>;
  onCancelAdd: () => void;
  isSubmitting: boolean;
  availableTags: string[];
  selectedCredentialIds: string[];
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkComplete: () => void;
}

const VaultActions: React.FC<VaultActionsProps> = ({
  showAddForm,
  onAddCredential,
  onCancelAdd,
  isSubmitting,
  availableTags,
  selectedCredentialIds,
  onBulkDelete,
  onBulkComplete
}) => {
  return (
    <>
      {showAddForm && (
        <Card className="border-2 border-blue-200 shadow-md">
          <AddCredentialForm 
            onAdd={onAddCredential}
            onCancel={onCancelAdd}
            isSubmitting={isSubmitting}
            availableTags={availableTags}
          />
        </Card>
      )}

      {selectedCredentialIds.length > 0 && (
        <BulkActions 
          selectedCredentialIds={selectedCredentialIds}
          onDelete={onBulkDelete}
          onComplete={onBulkComplete}
        />
      )}
    </>
  );
};

export default VaultActions;
