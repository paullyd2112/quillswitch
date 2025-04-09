
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FieldMapping, MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import { ArrowRight, Check, X, Edit, Eye, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DataPreview from "./data-mapping/DataPreview";
import TransformationRuleEditor from "./data-mapping/TransformationRuleEditor";

interface DataMappingVisualizerProps {
  objectType: MigrationObjectType;
  fieldMappings: FieldMapping[];
  onUpdateMapping?: (mappingId: string, updates: Partial<FieldMapping>) => void;
}

const DataMappingVisualizer: React.FC<DataMappingVisualizerProps> = ({ 
  objectType, 
  fieldMappings,
  onUpdateMapping 
}) => {
  const [editingMapping, setEditingMapping] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEditClick = (mapping: FieldMapping) => {
    setEditingMapping(mapping.id);
    setEditValue(mapping.destination_field);
  };

  const handleSaveEdit = (mappingId: string) => {
    if (onUpdateMapping && editValue) {
      onUpdateMapping(mappingId, { destination_field: editValue });
    }
    setEditingMapping(null);
  };

  const getDataTypeColor = (fieldName: string) => {
    if (fieldName.includes('date') || fieldName.includes('time')) 
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    if (fieldName.includes('email')) 
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    if (fieldName.includes('phone')) 
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (fieldName.includes('name')) 
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    if (fieldName.includes('id') || fieldName.includes('key'))
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{objectType.name} Field Mapping</span>
            <Badge variant="outline" className="ml-2">
              {fieldMappings.length} Fields
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {fieldMappings.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/20">
                <TableRow>
                  <TableHead>Source Field</TableHead>
                  <TableHead className="w-1/12 text-center"></TableHead>
                  <TableHead>Destination Field</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Transformation</TableHead>
                  <TableHead className="text-center">Required</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldMappings.map((mapping) => (
                  <TableRow 
                    key={mapping.id} 
                    className="group hover:bg-slate-50 dark:hover:bg-slate-900/10 cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Badge variant="outline" className={`mr-2 ${getDataTypeColor(mapping.source_field)}`}>
                          {mapping.source_field.includes('date') ? 'Date' : 
                           mapping.source_field.includes('email') ? 'Email' :
                           mapping.source_field.includes('phone') ? 'Phone' :
                           mapping.source_field.includes('name') ? 'Name' : 'Text'}
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
                      {editingMapping === mapping.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-8 py-1"
                          />
                          <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(mapping.id)}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        mapping.destination_field
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getDataTypeColor(mapping.destination_field)}>
                        {mapping.destination_field.includes('date') ? 'Date' : 
                         mapping.destination_field.includes('email') ? 'Email' :
                         mapping.destination_field.includes('phone') ? 'Phone' :
                         mapping.destination_field.includes('name') ? 'Name' : 'Text'}
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
                            mapping={mapping} 
                            onSave={(rule) => onUpdateMapping && onUpdateMapping(mapping.id, { transformation_rule: rule })} 
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
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditClick(mapping)}>
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
                                    mapping={mapping} 
                                    onSave={(rule) => onUpdateMapping && onUpdateMapping(mapping.id, { transformation_rule: rule })}
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
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No field mappings configured</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataMappingVisualizer;
