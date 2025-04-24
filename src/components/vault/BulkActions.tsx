
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { BulkActionProps } from "./types";

interface BulkActionsProps extends BulkActionProps {
  onDelete: (ids: string[]) => Promise<void>;
}

const BulkActions: React.FC<BulkActionsProps> = ({ 
  selectedCredentialIds, 
  onDelete,
  onComplete 
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (selectedCredentialIds.length === 0) return;
    
    try {
      setIsDeleting(true);
      await onDelete(selectedCredentialIds);
      toast.success(`${selectedCredentialIds.length} credentials deleted successfully`);
      onComplete();
    } catch (error) {
      console.error("Error deleting credentials:", error);
      toast.error("Failed to delete credentials");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (selectedCredentialIds.length === 0) return null;

  return (
    <div className="p-2 mb-4 border bg-muted/20 rounded-md flex justify-between items-center">
      <span className="text-sm font-medium ml-2">
        {selectedCredentialIds.length} {selectedCredentialIds.length === 1 ? 'credential' : 'credentials'} selected
      </span>
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onComplete()}
        >
          Cancel
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Credentials</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCredentialIds.length} {selectedCredentialIds.length === 1 ? 'credential' : 'credentials'}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BulkActions;
