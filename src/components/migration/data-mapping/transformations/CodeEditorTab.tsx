
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface CodeEditorTabProps {
  code: string;
  onCodeChange: (code: string) => void;
  onTest: () => void;
}

const CodeEditorTab: React.FC<CodeEditorTabProps> = ({ 
  code, 
  onCodeChange, 
  onTest 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Transformation Code</Label>
          <div className="text-xs text-muted-foreground">JavaScript</div>
        </div>
        <Textarea
          className="font-mono h-40 resize-y"
          placeholder="// Write your transformation code here
// For example: return value.toUpperCase();
// Access the input value using the 'value' variable
return value;"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onTest}>
          <Play className="h-3.5 w-3.5 mr-1" />
          Test Code
        </Button>
      </div>
    </div>
  );
};

export default CodeEditorTab;
