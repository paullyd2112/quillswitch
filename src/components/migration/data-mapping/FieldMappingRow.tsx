
import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { FieldMapping } from "@/integrations/supabase/migrationTypes";
import { ArrowRight, Check, X, Edit, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TransformationRuleEditor from "./transformations";
import { detectFieldType, getDataTypeColor } from "./utils/fieldTypeUtils";

interface FieldMappingRowProps {
  mapping: FieldMapping;
  onUpdateMapping: (mappingId: string, updates: Partial<FieldMapping>) => void;
}

const FieldMappingRow: React.FC<FieldMappingRowProps> = ({ mapping, onUpdateMapping }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(mapping.destination_field);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditValue(mapping.destination_field);
  };

  const handleSaveEdit = () => {
    if (editValue) {
      onUpdateMapping(mapping.id, { destination_field: editValue });
    }
    setIsEditing(false);
  };

  return (
    <TableRow className="group hover:bg-slate-50 dark:hover:bg-slate-900/10 cursor-pointer">
      <TableCell className="font-medium">
        <div className="flex items-center">
          <Badge variant="outline" className={`mr-2 ${getDataTypeColor(mapping.source_field)}`}>
            {detectFieldType(mapping.source_field)}
          </Badge>
          {mapping.source_field}
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="w-full flex justify-center">
          <div className="h-0.5 w-12 bg-brand-100 dark:bg-brand-900/30"></div>
          <ArrowRight className="h-4 w-4 mx-auto text-brand-500" />
          <div className="h-0.5 w-12 bg-brand-100 dark:bg-brand-900/30"></div>
        </div>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 py-1"
            />
            <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
              Save
            </Button>
          </div>
        ) : (
          mapping.destination_field
        )}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={getDataTypeColor(mapping.destination_field)}>
          {detectFieldType(mapping.destination_field)}
        </Badge>
      </TableCell>
      <TableCell className="max-w-xs">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7">
              {mapping.transformation_rule ? (
                <span className="line-clamp-1 text-left text-sm">{mapping.transformation_rule}</span>
              ) : (
                <span className="text-muted-foreground text-sm italic">Add transformation</span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Transformation Rule</DialogTitle>
            </DialogHeader>
            <TransformationRuleEditor 
              sourceField={mapping.source_field}
              destinationField={mapping.destination_field}
              currentRule={mapping.transformation_rule}
              onSave={(rule) => onUpdateMapping(mapping.id, { transformation_rule: rule })} 
            />
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell className="text-center">
        {mapping.is_required ? (
          <Check className="h-4 w-4 mx-auto text-green-500" />
        ) : (
          <X className="h-4 w-4 mx-auto text-muted-foreground" />
        )}
      </TableCell>
      <TableCell>
        <div className="flex justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleEditClick}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit mapping</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Auto-generate Transformation</DialogTitle>
                    </DialogHeader>
                    <TransformationRuleEditor 
                      sourceField={mapping.source_field}
                      destinationField={mapping.destination_field}
                      currentRule={mapping.transformation_rule}
                      onSave={(rule) => onUpdateMapping(mapping.id, { transformation_rule: rule })}
                      autoGenerate
                    />
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Suggest transformation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default FieldMappingRow;
