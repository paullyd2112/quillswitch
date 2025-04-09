
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FunctionSquare, Save, X } from "lucide-react";
import { FieldMapping } from "@/integrations/supabase/migrationTypes";
import { toast } from "sonner";
import {
  QuickTemplatesTab,
  CodeEditorTab,
  TestPreviewTab,
  TRANSFORMATION_TEMPLATES,
  evaluateTransformation,
  validateTransformationCode,
  suggestTemplateForField
} from "./transformations";

export interface TransformationRuleEditorProps {
  initialValue?: string;
  fieldName?: string;
  sourceField?: string;
  destinationField?: string;
  currentRule?: string | null;
  onSave: (rule: string | null) => void;
  onClose?: () => void;
  sourceExample?: string;
  mapping?: FieldMapping;
  autoGenerate?: boolean;
}

const TransformationRuleEditor: React.FC<TransformationRuleEditorProps> = ({
  initialValue = '',
  fieldName = '',
  sourceField,
  destinationField,
  currentRule,
  onSave,
  onClose,
  sourceExample = "Sample value",
  mapping,
  autoGenerate = false
}) => {
  // Use values from mapping if provided
  const actualSourceField = sourceField || fieldName || (mapping ? mapping.source_field : "");
  const actualDestinationField = destinationField || (mapping ? mapping.destination_field : "");
  const actualCurrentRule = initialValue || currentRule || (mapping ? mapping.transformation_rule : null);

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
      const suggestedTemplate = suggestTemplateForField(actualDestinationField);
      if (suggestedTemplate) {
        setSelectedTemplate(suggestedTemplate);
        applyTemplate(suggestedTemplate);
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
    const { result: evalResult, error: evalError } = evaluateTransformation(codeToTest, input);
    setResult(evalResult);
    if (evalError) {
      setError(evalError);
    }
  };
  
  const handleSave = () => {
    if (code.trim() === "") {
      onSave(null); // Clear the rule
      toast.success("Transformation rule cleared");
    } else {
      // Validate the code works before saving
      if (validateTransformationCode(code)) {
        onSave(code);
        toast.success("Transformation rule saved");
      } else {
        setError("Invalid code structure");
        toast.error("Could not save invalid transformation rule");
      }
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
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
            <TabsTrigger value="test">Test &amp; Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick">
            <QuickTemplatesTab
              selectedTemplate={selectedTemplate}
              onTemplateChange={(templateName) => {
                setSelectedTemplate(templateName);
                applyTemplate(templateName);
              }}
            />
          </TabsContent>
          
          <TabsContent value="code">
            <CodeEditorTab
              code={code}
              onCodeChange={setCode}
              onTest={() => testCode()}
            />
          </TabsContent>
          
          <TabsContent value="test">
            <TestPreviewTab
              inputValue={inputValue}
              onInputChange={setInputValue}
              onTest={() => testCode(code, inputValue)}
              code={code}
              result={result}
              error={error}
              sourceField={actualSourceField}
              destinationField={actualDestinationField}
            />
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
