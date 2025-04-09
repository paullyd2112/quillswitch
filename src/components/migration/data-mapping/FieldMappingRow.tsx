
import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, Eye, ArrowRightLeft, LucideIcon } from "lucide-react";
import { FieldMapping } from "@/integrations/supabase/migrationTypes";
import { Switch } from "@/components/ui/switch";
import { TransformationRuleEditor } from "./transformations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getDataTypeColor, detectFieldType } from "./utils/fieldTypeUtils";

interface FieldMappingRowProps {
  mapping: FieldMapping;
  onUpdateMapping: (mappingId: string, updates: Partial<FieldMapping>) => void;
}

const FieldMappingRow: React.FC<FieldMappingRowProps> = ({ mapping, onUpdateMapping }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isTransformationEditorOpen, setIsTransformationEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const handleToggleRequired = () => {
    onUpdateMapping(mapping.id, { is_required: !mapping.is_required });
  };
  
  const handleTransformationSave = (rule: string) => {
    onUpdateMapping(mapping.id, { transformation_rule: rule });
    setIsTransformationEditorOpen(false);
  };
  
  const hasTransformation = !!mapping.transformation_rule && mapping.transformation_rule.length > 0;

  // Simple preview dialog for a single mapping
  const SingleMappingPreview = () => (
    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Field Mapping Preview</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-sm font-medium mb-1">Source Field</div>
            <div className="border rounded-md p-2">{mapping.source_field}</div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Destination Field</div>
            <div className="border rounded-md p-2">{mapping.destination_field}</div>
          </div>
          {hasTransformation && (
            <div className="col-span-2">
              <div className="text-sm font-medium mb-1">Transformation Rule</div>
              <div className="border rounded-md p-2 bg-muted/30 font-mono text-sm">
                {mapping.transformation_rule}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <TableRow className="hover:bg-slate-50/70 dark:hover:bg-slate-900/20">
      <TableCell className="font-medium break-all">
        {mapping.source_field}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center">
          <ArrowRightLeft size={18} className="text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="break-all">
        {mapping.destination_field}
      </TableCell>
      <TableCell>
        <Badge className={getDataTypeColor(mapping.source_field)}>
          {detectFieldType(mapping.source_field)}
        </Badge>
      </TableCell>
      <TableCell>
        {hasTransformation ? (
          <Badge 
            variant="outline" 
            className="cursor-pointer"
            onClick={() => setIsTransformationEditorOpen(true)}
          >
            {mapping.transformation_rule?.length > 30 
              ? mapping.transformation_rule.substring(0, 30) + '...' 
              : mapping.transformation_rule}
          </Badge>
        ) : (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsTransformationEditorOpen(true)}
          >
            Add
          </Button>
        )}
        
        {isTransformationEditorOpen && (
          <TransformationRuleEditor
            initialValue={mapping.transformation_rule || ''}
            onClose={() => setIsTransformationEditorOpen(false)}
            onSave={handleTransformationSave}
            fieldName={mapping.source_field}
          />
        )}
      </TableCell>
      <TableCell className="text-center">
        <Switch 
          checked={mapping.is_required} 
          onCheckedChange={handleToggleRequired}
        />
      </TableCell>
      <TableCell>
        <div className="flex justify-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye size={16} />
          </Button>
          
          {isPreviewOpen && <SingleMappingPreview />}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default FieldMappingRow;
