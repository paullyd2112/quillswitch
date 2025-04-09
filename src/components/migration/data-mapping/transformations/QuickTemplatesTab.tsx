
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TRANSFORMATION_TEMPLATES } from "./templates";

interface QuickTemplatesTabProps {
  selectedTemplate: string;
  onTemplateChange: (templateName: string) => void;
}

const QuickTemplatesTab: React.FC<QuickTemplatesTabProps> = ({ 
  selectedTemplate, 
  onTemplateChange 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Select a Transformation Template</Label>
        <Select
          value={selectedTemplate}
          onValueChange={onTemplateChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a template..." />
          </SelectTrigger>
          <SelectContent>
            {TRANSFORMATION_TEMPLATES.map(template => (
              <SelectItem key={template.name} value={template.name}>
                {template.name} - {template.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-4 mt-4">
        {TRANSFORMATION_TEMPLATES.map(template => (
          <div 
            key={template.name} 
            className="border rounded-lg p-3 hover:bg-muted/30 cursor-pointer" 
            onClick={() => onTemplateChange(template.name)}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium">{template.name}</div>
              <Badge variant="outline">{template.name === selectedTemplate ? 'Selected' : 'Select'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickTemplatesTab;
