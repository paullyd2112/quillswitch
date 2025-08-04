import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Settings, RefreshCw } from "lucide-react";

interface MaskingRule {
  id: string;
  fieldType: string;
  enabled: boolean;
  maskingStrategy: string;
  preserveFormat: boolean;
}

const defaultRules: MaskingRule[] = [
  { id: "names", fieldType: "Full Names", enabled: true, maskingStrategy: "faker", preserveFormat: false },
  { id: "emails", fieldType: "Email Addresses", enabled: true, maskingStrategy: "domain_preserve", preserveFormat: true },
  { id: "phones", fieldType: "Phone Numbers", enabled: true, maskingStrategy: "format_preserve", preserveFormat: true },
  { id: "addresses", fieldType: "Street Addresses", enabled: true, maskingStrategy: "faker", preserveFormat: false },
  { id: "ssn", fieldType: "Social Security Numbers", enabled: true, maskingStrategy: "redact", preserveFormat: true },
  { id: "credit_cards", fieldType: "Credit Card Numbers", enabled: true, maskingStrategy: "luhn_valid", preserveFormat: true },
  { id: "bank_accounts", fieldType: "Bank Account Numbers", enabled: true, maskingStrategy: "redact", preserveFormat: true },
  { id: "custom_ids", fieldType: "Custom ID Fields", enabled: false, maskingStrategy: "hash", preserveFormat: false },
];

const PiiMaskingConfig: React.FC = () => {
  const [rules, setRules] = useState<MaskingRule[]>(defaultRules);
  const [showPreview, setShowPreview] = useState(false);

  const updateRule = (id: string, field: keyof MaskingRule, value: any) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const getMaskingStrategyDescription = (strategy: string) => {
    const descriptions = {
      faker: "Replace with realistic fake data",
      domain_preserve: "Keep domain, randomize local part",
      format_preserve: "Maintain format, randomize digits",
      redact: "Replace with asterisks or X's",
      hash: "One-way hash (consistent per value)",
      luhn_valid: "Generate valid but fake numbers"
    };
    return descriptions[strategy as keyof typeof descriptions] || strategy;
  };

  const getPreviewExample = (fieldType: string, strategy: string) => {
    const examples = {
      "Full Names": { original: "John Smith", masked: "Michael Johnson" },
      "Email Addresses": { original: "john.smith@company.com", masked: "random.user@company.com" },
      "Phone Numbers": { original: "(555) 123-4567", masked: "(555) 987-6543" },
      "Street Addresses": { original: "123 Main St, Anytown", masked: "456 Oak Ave, Testville" },
      "Social Security Numbers": { original: "123-45-6789", masked: "XXX-XX-6789" },
      "Credit Card Numbers": { original: "4532 1234 5678 9012", masked: "4532 XXXX XXXX 5678" },
      "Bank Account Numbers": { original: "123456789", masked: "XXXXXXXXX" },
      "Custom ID Fields": { original: "CUST-12345", masked: "abc123def" }
    };
    return examples[fieldType as keyof typeof examples] || { original: "Sample Data", masked: "Masked Data" };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                PII Masking Configuration
              </CardTitle>
              <CardDescription>
                Configure how sensitive data should be masked in your test environments
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {rules.map((rule, index) => (
            <div key={rule.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => updateRule(rule.id, "enabled", checked)}
                  />
                  <div>
                    <Label className="font-medium">{rule.fieldType}</Label>
                    <p className="text-sm text-muted-foreground">
                      {getMaskingStrategyDescription(rule.maskingStrategy)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={rule.enabled ? "default" : "secondary"}>
                    {rule.enabled ? "Active" : "Disabled"}
                  </Badge>
                  <Select
                    value={rule.maskingStrategy}
                    onValueChange={(value) => updateRule(rule.id, "maskingStrategy", value)}
                    disabled={!rule.enabled}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="faker">Realistic Fake</SelectItem>
                      <SelectItem value="domain_preserve">Domain Preserve</SelectItem>
                      <SelectItem value="format_preserve">Format Preserve</SelectItem>
                      <SelectItem value="redact">Redact</SelectItem>
                      <SelectItem value="hash">Hash</SelectItem>
                      <SelectItem value="luhn_valid">Valid Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showPreview && rule.enabled && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-muted-foreground">Original:</span>
                        <code className="ml-2 px-2 py-1 bg-background rounded text-red-600">
                          {getPreviewExample(rule.fieldType, rule.maskingStrategy).original}
                        </code>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Masked:</span>
                        <code className="ml-2 px-2 py-1 bg-background rounded text-green-600">
                          {getPreviewExample(rule.fieldType, rule.maskingStrategy).masked}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {index < rules.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Fine-tune masking behavior and performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Consistency Mode</Label>
              <p className="text-sm text-muted-foreground">
                Ensure the same real value always maps to the same masked value
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Reference Data Preservation</Label>
              <p className="text-sm text-muted-foreground">
                Maintain referential integrity across related tables
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Custom Field Detection</Label>
              <p className="text-sm text-muted-foreground">
                Use AI to identify additional PII fields automatically
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default PiiMaskingConfig;