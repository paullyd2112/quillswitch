
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import { FieldMapping, MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import DataPreview from "./DataPreview";

interface MappingPreviewDialogProps {
  objectType: MigrationObjectType;
  fieldMappings: FieldMapping[];
}

const MappingPreviewDialog: React.FC<MappingPreviewDialogProps> = ({ objectType, fieldMappings }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="h-4 w-4" /> Preview Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Data Preview - {objectType.name}</DialogTitle>
              </DialogHeader>
              <DataPreview objectType={objectType} fieldMappings={fieldMappings} />
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>
          <p>Preview how your data will look after migration</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MappingPreviewDialog;
