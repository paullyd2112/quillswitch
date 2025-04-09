
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, FunctionSquare, Play, Eye, Save, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FieldMapping } from "@/integrations/supabase/migrationTypes";

export interface TransformationRuleEditorProps {
  sourceField?: string;
  destinationField?: string;
  currentRule?: string | null;
  onSave: (rule: string | null) => void;
  onCancel?: () => void;
  sourceExample?: string;
  mapping?: FieldMapping;
  autoGenerate?: boolean;
}

// Sample pre-defined transformation templates
const TRANSFORMATION_TEMPLATES = [
  { 
    name: "Uppercase", 
    description: "Convert text to uppercase", 
    code: "return value ? value.toUpperCase() : value;" 
  },
  { 
    name: "Lowercase", 
    description: "Convert text to lowercase", 
    code: "return value ? value.toLowerCase() : value;"
  },
  { 
    name: "Capitalize", 
    description: "Capitalize first letter of each word", 
    code: `return value ? value.replace(/\\b\\w/g, char => char.toUpperCase()) : value;`
  },
  { 
    name: "Trim", 
    description: "Remove whitespace from start and end", 
    code: "return value ? value.trim() : value;"
  },
  { 
    name: "Extract numbers", 
    description: "Extract only numbers from text", 
    code: `return value ? value.replace(/[^0-9]/g, '') : value;`
  },
  { 
    name: "Format phone", 
    description: "Format as (XXX) XXX-XXXX", 
    code: `const digits = value ? value.replace(/\\D/g, '') : '';
if (digits.length === 10) {
  return \`(\${digits.substring(0, 3)}) \${digits.substring(3, 6)}-\${digits.substring(6)}\`;
}
return value;`
  },
  { 
    name: "Format date", 
    description: "Format date as YYYY-MM-DD", 
    code: `if (!value) return value;
try {
  const date = new Date(value);
  return date.toISOString().split('T')[0];
} catch (e) {
  return value;
}`
  },
  { 
    name: "Round number", 
    description: "Round number to 2 decimal places", 
    code: `if (!value) return value;
const num = parseFloat(value);
return isNaN(num) ? value : num.toFixed(2);`
  }
];

const TransformationRuleEditor: React.FC<TransformationRuleEditorProps> = ({
  sourceField,
  destinationField,
  currentRule,
  onSave,
  onCancel,
  sourceExample = "Sample value",
  mapping,
  autoGenerate = false
}) => {
  // Use values from mapping if provided
  const actualSourceField = sourceField || (mapping ? mapping.source_field : "");
  const actualDestinationField = destinationField || (mapping ? mapping.destination_field : "");
  const actualCurrentRule = currentRule || (mapping ? mapping.transformation_rule : null);

  const [activeTab, setActiveTab] = useState<string>(autoGenerate ? "quick" : "code");
  const [code, setCode] = useState<string>(actualCurrentRule || "");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>(sourceExample);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  
  useEffect(() => {
    if (actualCurrentRule) {
      setCode(actualCurrentRule);
      setActiveTab("code");
    }
    
    if (autoGenerate) {
      // Auto-select a template based on field names
      const fieldName = actualDestinationField.toLowerCase();
      if (fieldName.includes('phone')) {
        setSelectedTemplate("Format phone");
        applyTemplate("Format phone");
      } else if (fieldName.includes('date')) {
        setSelectedTemplate("Format date");
        applyTemplate("Format date");
      } else if (fieldName.includes('name')) {
        setSelectedTemplate("Capitalize");
        applyTemplate("Capitalize");
      } else if (fieldName.includes('price') || fieldName.includes('amount')) {
        setSelectedTemplate("Round number");
        applyTemplate("Round number");
      }
    }
  }, [actualCurrentRule, autoGenerate, actualDestinationField]);
  
  const applyTemplate = (templateName: string) => {
    const template = TRANSFORMATION_TEMPLATES.find(t => t.name === templateName);
    if (template) {
      setCode(template.code);
      testCode(template.code, inputValue);
    }
  };
  
  const testCode = (codeToTest: string = code, input: string = inputValue) => {
    setError(null);
    try {
      // Create a safe evaluation environment
      const value = input;
      // eslint-disable-next-line no-new-func
      const transformFn = new Function('value', codeToTest);
      const output = transformFn(value);
      setResult(output);
    } catch (err: any) {
      console.error("Code evaluation error:", err);
      setError(err.message || "Error evaluating code");
      setResult(null);
    }
  };
  
  const handleSave = () => {
    if (code.trim() === "") {
      onSave(null); // Clear the rule
      toast.success("Transformation rule cleared");
    } else {
      // Validate the code works before saving
      try {
        // eslint-disable-next-line no-new-func
        new Function('value', code);
        onSave(code);
        toast.success("Transformation rule saved");
      } catch (err: any) {
        setError(err.message || "Invalid code");
        toast.error("Could not save invalid transformation rule");
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FunctionSquare className="h-5 w-5 text-brand-500" />
            Transformation Rule Editor
          </div>
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>
          Create a transformation rule to convert data from {actualSourceField} to {actualDestinationField}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="quick">Quick Templates</TabsTrigger>
            <TabsTrigger value="code">Custom Code</TabsTrigger>
            <TabsTrigger value="test">Test & Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick">
            <div className="space-y-4">
              <div>
                <Label>Select a Transformation Template</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={(value) => {
                    setSelectedTemplate(value);
                    applyTemplate(value);
                  }}
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
                  <div key={template.name} className="border rounded-lg p-3 hover:bg-muted/30 cursor-pointer" onClick={() => {
                    setSelectedTemplate(template.name);
                    applyTemplate(template.name);
                  }}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium">{template.name}</div>
                      <Badge variant="outline">{template.name === selectedTemplate ? 'Selected' : 'Select'}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code">
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
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => testCode()}>
                  <Play className="h-3.5 w-3.5 mr-1" />
                  Test Code
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="test">
            <div className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label>Input Value</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      value={inputValue} 
                      onChange={(e) => setInputValue(e.target.value)} 
                      placeholder="Enter test value..." 
                      className="flex-1"
                    />
                    <Button onClick={() => testCode(code, inputValue)} variant="secondary">
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
                    <div className="text-sm font-medium mb-1">Source ({actualSourceField})</div>
                    <div className="border rounded-md p-2">{inputValue}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Destination ({actualDestinationField})</div>
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
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          disabled={error !== null && activeTab === "test"}
          className="gap-1"
        >
          <Save className="h-4 w-4" />
          {code.trim() === "" ? "Clear Rule" : "Save Rule"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransformationRuleEditor;
