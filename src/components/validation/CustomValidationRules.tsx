import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  field_type: string;
  validation_type: string;
  rule_config: any;
  error_message: string;
  is_active: boolean;
  created_at: string;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'url', label: 'URL' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'currency', label: 'Currency' }
];

const VALIDATION_TYPES = [
  { value: 'regex', label: 'Regular Expression' },
  { value: 'length', label: 'Length Validation' },
  { value: 'range', label: 'Range Validation' },
  { value: 'required', label: 'Required Field' },
  { value: 'unique', label: 'Unique Value' },
  { value: 'format', label: 'Format Validation' },
  { value: 'custom', label: 'Custom Logic' }
];

const CustomValidationRules: React.FC = () => {
  const { currentWorkspace } = useWorkspace();
  const [rules, setRules] = useState<ValidationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<ValidationRule | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fieldType, setFieldType] = useState('');
  const [validationType, setValidationType] = useState('');
  const [ruleConfig, setRuleConfig] = useState('{}');
  const [errorMessage, setErrorMessage] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Load validation rules
  const loadRules = async () => {
    if (!currentWorkspace) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('custom_validation_rules')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Failed to load validation rules:', error);
      toast.error('Failed to load validation rules');
    } finally {
      setIsLoading(false);
    }
  };

  // Save validation rule
  const saveRule = async () => {
    if (!currentWorkspace || !name || !fieldType || !validationType) {
      toast.error('Please fill in all required fields');
      return;
    }

    let parsedConfig;
    try {
      parsedConfig = JSON.parse(ruleConfig);
    } catch (error) {
      toast.error('Invalid JSON in rule configuration');
      return;
    }

    try {
      const ruleData = {
        workspace_id: currentWorkspace.id,
        user_id: (await supabase.auth.getUser()).data.user?.id || '',
        name,
        description,
        field_type: fieldType,
        validation_type: validationType,
        rule_config: parsedConfig,
        error_message: errorMessage,
        is_active: isActive
      };

      if (editingRule) {
        const { error } = await supabase
          .from('custom_validation_rules')
          .update(ruleData)
          .eq('id', editingRule.id);
        if (error) throw error;
        toast.success('Validation rule updated successfully');
      } else {
        const { error } = await supabase
          .from('custom_validation_rules')
          .insert(ruleData);
        if (error) throw error;
        toast.success('Validation rule created successfully');
      }

      resetForm();
      setShowCreateDialog(false);
      setEditingRule(null);
      loadRules();
    } catch (error) {
      console.error('Failed to save validation rule:', error);
      toast.error('Failed to save validation rule');
    }
  };

  // Delete validation rule
  const deleteRule = async (ruleId: string) => {
    try {
      const { error } = await supabase
        .from('custom_validation_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
      toast.success('Validation rule deleted successfully');
      loadRules();
    } catch (error) {
      console.error('Failed to delete validation rule:', error);
      toast.error('Failed to delete validation rule');
    }
  };

  // Toggle rule active status
  const toggleRule = async (ruleId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_validation_rules')
        .update({ is_active: active })
        .eq('id', ruleId);

      if (error) throw error;
      toast.success(`Rule ${active ? 'activated' : 'deactivated'}`);
      loadRules();
    } catch (error) {
      console.error('Failed to toggle rule:', error);
      toast.error('Failed to update rule');
    }
  };

  // Edit rule
  const editRule = (rule: ValidationRule) => {
    setEditingRule(rule);
    setName(rule.name);
    setDescription(rule.description);
    setFieldType(rule.field_type);
    setValidationType(rule.validation_type);
    setRuleConfig(JSON.stringify(rule.rule_config, null, 2));
    setErrorMessage(rule.error_message);
    setIsActive(rule.is_active);
    setShowCreateDialog(true);
  };

  // Reset form
  const resetForm = () => {
    setName('');
    setDescription('');
    setFieldType('');
    setValidationType('');
    setRuleConfig('{}');
    setErrorMessage('');
    setIsActive(true);
  };

  // Generate rule config template based on validation type
  const generateConfigTemplate = (type: string) => {
    const templates = {
      regex: { pattern: '^[A-Za-z0-9]+$', flags: 'i' },
      length: { min: 1, max: 100 },
      range: { min: 0, max: 1000 },
      required: { allowEmpty: false },
      unique: { scope: 'global' },
      format: { formatType: 'email' },
      custom: { function: 'return value.length > 0;' }
    };
    
    return JSON.stringify(templates[type as keyof typeof templates] || {}, null, 2);
  };

  useEffect(() => {
    loadRules();
  }, [currentWorkspace]);

  useEffect(() => {
    if (validationType) {
      setRuleConfig(generateConfigTemplate(validationType));
    }
  }, [validationType]);

  if (!currentWorkspace) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Please select a workspace to manage validation rules.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Custom Validation Rules</h2>
          <p className="text-muted-foreground">
            Define custom validation logic for your migration data
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setEditingRule(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              New Rule
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? 'Edit Validation Rule' : 'Create Validation Rule'}
              </DialogTitle>
              <DialogDescription>
                Define custom validation logic that will be applied during data migration
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Phone Number Validation"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="field-type">Field Type</Label>
                  <Select value={fieldType} onValueChange={setFieldType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validation-type">Validation Type</Label>
                  <Select value={validationType} onValueChange={setValidationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select validation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VALIDATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 flex items-center">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <Label htmlFor="is-active">Active</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Validates phone numbers in international format..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rule-config">Rule Configuration (JSON)</Label>
                <Textarea
                  id="rule-config"
                  value={ruleConfig}
                  onChange={(e) => setRuleConfig(e.target.value)}
                  placeholder='{"pattern": "^\\+?[1-9]\\d{1,14}$"}'
                  className="font-mono text-sm"
                  rows={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="error-message">Error Message</Label>
                <Input
                  id="error-message"
                  value={errorMessage}
                  onChange={(e) => setErrorMessage(e.target.value)}
                  placeholder="Please enter a valid phone number"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingRule(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveRule}>
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p>Loading validation rules...</p>
          </CardContent>
        </Card>
      ) : rules.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No validation rules found</p>
            <p className="text-sm text-muted-foreground">Create your first custom validation rule</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{rule.field_type}</Badge>
                      <Badge variant="outline">{rule.validation_type}</Badge>
                    </div>
                    
                    {rule.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {rule.description}
                      </p>
                    )}
                    
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="font-medium">Error Message: </span>
                        <span className="text-muted-foreground">{rule.error_message}</span>
                      </div>
                      <div>
                        <span className="font-medium">Configuration: </span>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {JSON.stringify(rule.rule_config)}
                        </code>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={rule.is_active}
                      onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editRule(rule)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomValidationRules;