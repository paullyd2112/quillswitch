
import React, { useState, useEffect } from "react";
import { FieldMapping } from "@/integrations/supabase/migrationTypes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CircleAlert, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TransformationRuleEditorProps {
  mapping: FieldMapping;
  onSave: (transformationRule: string) => void;
  autoGenerate?: boolean;
}

// Helper function to determine common transformations based on field names
const suggestTransformations = (sourceField: string, destinationField: string) => {
  const suggestions = [];
  
  // Name transformations
  if ((sourceField.includes('name') || destinationField.includes('name'))) {
    suggestions.push({
      name: "Capitalize",
      code: `value => value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')`,
      description: "Capitalize each word in the name"
    });
    
    if (sourceField.includes('full') && (destinationField.includes('first') || destinationField.includes('last'))) {
      suggestions.push({
        name: "Extract First Name",
        code: `value => value.split(' ')[0]`,
        description: "Extract the first name from a full name"
      });
      suggestions.push({
        name: "Extract Last Name",
        code: `value => value.split(' ').slice(1).join(' ')`,
        description: "Extract the last name from a full name"
      });
    }
  }
  
  // Date transformations
  if (sourceField.includes('date') || destinationField.includes('date')) {
    suggestions.push({
      name: "Format Date (MM/DD/YYYY)",
      code: `value => {
  const date = new Date(value);
  return \`\${date.getMonth() + 1}/\${date.getDate()}/\${date.getFullYear()}\`;
}`,
      description: "Format date as MM/DD/YYYY"
    });
    suggestions.push({
      name: "Format Date (YYYY-MM-DD)",
      code: `value => {
  const date = new Date(value);
  return date.toISOString().split('T')[0];
}`,
      description: "Format date as YYYY-MM-DD (ISO format)"
    });
  }
  
  // Phone number transformations
  if (sourceField.includes('phone') || destinationField.includes('phone')) {
    suggestions.push({
      name: "Format Phone Number",
      code: `value => {
  // Remove non-numeric characters
  const digits = value.replace(/\\D/g, '');
  // Format as (XXX) XXX-XXXX if 10 digits
  if (digits.length === 10) {
    return \`(\${digits.slice(0, 3)}) \${digits.slice(3, 6)}-\${digits.slice(6)}\`;
  }
  return value;
}`,
      description: "Format as (XXX) XXX-XXXX"
    });
  }
  
  // Email transformations
  if (sourceField.includes('email') || destinationField.includes('email')) {
    suggestions.push({
      name: "Lowercase Email",
      code: `value => value.toLowerCase()`,
      description: "Convert email to lowercase"
    });
    suggestions.push({
      name: "Validate Email",
      code: `value => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(value) ? value : '';
}`,
      description: "Only return valid email addresses"
    });
  }
  
  // Currency/number transformations
  if (sourceField.includes('amount') || sourceField.includes('price') || 
      destinationField.includes('amount') || destinationField.includes('price')) {
    suggestions.push({
      name: "Format Currency",
      code: `value => {
  const num = parseFloat(value);
  return !isNaN(num) ? num.toFixed(2) : value;
}`,
      description: "Format as number with 2 decimal places"
    });
    suggestions.push({
      name: "Format as USD",
      code: `value => {
  const num = parseFloat(value);
  return !isNaN(num) ? '$' + num.toFixed(2) : value;
}`,
      description: "Format as USD currency ($X.XX)"
    });
  }
  
  // Add general transformations if no specific ones found
  if (suggestions.length === 0) {
    suggestions.push({
      name: "Trim Whitespace",
      code: `value => value.trim()`,
      description: "Remove leading and trailing whitespace"
    });
    suggestions.push({
      name: "Uppercase",
      code: `value => value.toUpperCase()`,
      description: "Convert text to UPPERCASE"
    });
    suggestions.push({
      name: "Lowercase",
      code: `value => value.toLowerCase()`,
      description: "Convert text to lowercase"
    });
  }
  
  return suggestions;
};

const TransformationRuleEditor: React.FC<TransformationRuleEditorProps> = ({ 
  mapping, 
  onSave,
  autoGenerate = false
}) => {
  const [transformationType, setTransformationType] = useState<string>("custom");
  const [customRule, setCustomRule] = useState<string>(mapping.transformation_rule || "");
  const [presetRule, setPresetRule] = useState<string>("");
  const [testInput, setTestInput] = useState<string>("");
  const [testOutput, setTestOutput] = useState<string>("");
  const [testError, setTestError] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate suggestions based on field names
    const newSuggestions = suggestTransformations(mapping.source_field, mapping.destination_field);
    setSuggestions(newSuggestions);
    
    // If autoGenerate is true, automatically select the first suggestion
    if (autoGenerate && newSuggestions.length > 0) {
      setPresetRule(newSuggestions[0].code);
      setTransformationType("preset");
      
      // Set a sample test input based on field type
      if (mapping.source_field.includes('name')) {
        setTestInput("john smith");
      } else if (mapping.source_field.includes('email')) {
        setTestInput("USER@example.com");
      } else if (mapping.source_field.includes('phone')) {
        setTestInput("5551234567");
      } else if (mapping.source_field.includes('date')) {
        setTestInput(new Date().toISOString());
      } else {
        setTestInput("Sample Input");
      }
    }
  }, [mapping.source_field, mapping.destination_field, autoGenerate]);
  
  const handlePresetChange = (value: string) => {
    setPresetRule(value);
  };
  
  const handleTestTransformation = () => {
    setTestError("");
    
    const ruleToParse = transformationType === "custom" ? customRule : presetRule;
    
    if (!ruleToParse) {
      setTestOutput("No transformation rule specified");
      return;
    }
    
    try {
      // Try to create a function from the rule text
      // eslint-disable-next-line no-new-func
      const transformFunc = new Function('value', `return (${ruleToParse})(value);`);
      const result = transformFunc(testInput);
      setTestOutput(String(result));
    } catch (error) {
      console.error("Transformation test error:", error);
      setTestError("Error executing transformation. Check your code syntax.");
      setTestOutput("");
    }
  };
  
  const handleSave = () => {
    const finalRule = transformationType === "custom" ? customRule : presetRule;
    onSave(finalRule);
  };

  return (
    <div className="space-y-4 py-4">
      <Tabs defaultValue={autoGenerate ? "preset" : "custom"} onValueChange={setTransformationType}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="preset">Preset Transformations</TabsTrigger>
          <TabsTrigger value="custom">Custom Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preset" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Select a Transformation</Label>
            {suggestions.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((suggestion, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-colors ${presetRule === suggestion.code ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10' : ''}`}
                    onClick={() => handlePresetChange(suggestion.code)}
                  >
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{suggestion.name}</CardTitle>
                        {presetRule === suggestion.code && (
                          <Check className="h-4 w-4 text-brand-500" />
                        )}
                      </div>
                      <CardDescription>{suggestion.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No preset transformations available for these fields.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Custom Transformation Function</Label>
            <Textarea
              value={customRule}
              onChange={(e) => setCustomRule(e.target.value)}
              placeholder="value => value.toUpperCase()"
              className="font-mono text-sm h-32"
            />
            <p className="text-xs text-muted-foreground">
              Write a JavaScript arrow function that takes a value and returns the transformed value. 
              Example: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">value => value.toUpperCase()</code>
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="border rounded-md p-4 space-y-4 bg-slate-50 dark:bg-slate-900/20">
        <h3 className="font-medium">Test Your Transformation</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label>Test Input</Label>
            <Input
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter test value"
            />
          </div>
          
          <div>
            <Button type="button" onClick={handleTestTransformation} variant="outline" size="sm">
              Test Transformation
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Result</Label>
              {testError && (
                <Badge variant="destructive" className="text-xs">Error</Badge>
              )}
            </div>
            {testError ? (
              <div className="p-2 border rounded bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm">
                {testError}
              </div>
            ) : (
              <div className="p-2 border rounded bg-slate-100 dark:bg-slate-800">
                {testOutput || "No result yet. Click 'Test Transformation'."}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2">
        {testError && (
          <div className="flex items-center text-red-600 text-sm">
            <CircleAlert className="h-4 w-4 mr-1" />
            Fix errors before saving
          </div>
        )}
        <div className="ml-auto">
          <Button type="button" onClick={handleSave} disabled={!!testError}>
            Save Transformation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransformationRuleEditor;
