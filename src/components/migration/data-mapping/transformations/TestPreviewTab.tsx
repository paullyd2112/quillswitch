
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Code } from "lucide-react";

interface TestPreviewTabProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onTest: () => void;
  code: string;
  result: any;
  error: string | null;
  sourceField: string;
  destinationField: string;
}

const TestPreviewTab: React.FC<TestPreviewTabProps> = ({
  inputValue,
  onInputChange,
  onTest,
  code,
  result,
  error,
  sourceField,
  destinationField
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label>Input Value</Label>
          <div className="flex gap-2 mt-1">
            <Input 
              value={inputValue} 
              onChange={(e) => onInputChange(e.target.value)} 
              placeholder="Enter test value..." 
              className="flex-1"
            />
            <Button onClick={onTest} variant="secondary">
              <Play className="h-4 w-4 mr-1" />
              Test
            </Button>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label>Transformation Code</Label>
            <Badge variant="outline" className="text-xs">
              <Code className="h-3 w-3 mr-1" />
              JavaScript
            </Badge>
          </div>
          <div className="border rounded-md p-3 bg-muted/30 font-mono text-sm whitespace-pre-wrap">
            {code || "// No transformation code defined yet"}
          </div>
        </div>
        
        <div>
          <Label>Result Preview</Label>
          <div className="border rounded-md p-3 mt-1 min-h-[60px]">
            {error ? (
              <div className="text-destructive text-sm">
                <span className="font-semibold">Error:</span> {error}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge>Input</Badge>
                <span className="text-muted-foreground">{inputValue}</span>
                <span className="text-muted-foreground">→</span>
                <Badge>Output</Badge>
                <span>{result !== null ? String(result) : "Not tested yet"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <Label>Preview in context</Label>
        <Separator className="my-2" />
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div className="text-sm font-medium mb-1">Source ({sourceField})</div>
            <div className="border rounded-md p-2">{inputValue}</div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Destination ({destinationField})</div>
            <div className="border rounded-md p-2 bg-muted/30">
              {error ? (
                <span className="text-destructive text-xs">Error: {error}</span>
              ) : (
                <span>{result !== null ? String(result) : "Not transformed yet"}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPreviewTab;
