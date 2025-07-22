import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FieldMapping {
  id?: string;
  source_field: string;
  destination_field: string;
  transformation_rule?: string;
  is_required: boolean;
}

interface SchemaMappingInterfaceProps {
  projectId: string;
  objectType: string;
  sourceConnectionId: string;
  destinationConnectionId: string;
  onMappingsSaved?: () => void;
}

const SchemaMappingInterface: React.FC<SchemaMappingInterfaceProps> = ({
  projectId,
  objectType,
  sourceConnectionId,
  destinationConnectionId,
  onMappingsSaved
}) => {
  const { toast } = useToast();
  const [sourceFields, setSourceFields] = useState<string[]>([]);
  const [destinationFields, setDestinationFields] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('mappings');

  const transformationOptions = [
    { value: '', label: 'None' },
    { value: 'uppercase', label: 'Convert to Uppercase' },
    { value: 'lowercase', label: 'Convert to Lowercase' },
    { value: 'trim', label: 'Trim Whitespace' },
    { value: 'date_format', label: 'Format as ISO Date' }
  ];

  useEffect(() => {
    loadSchemas();
    loadExistingMappings();
  }, [projectId, objectType]);

  const loadSchemas = async () => {
    setIsLoading(true);
    try {
      // Get schema information from Native CRM Engine
      const [sourceResponse, destinationResponse] = await Promise.all([
        supabase.functions.invoke('native-get-schema', {
          body: {
            connection_id: sourceConnectionId,
            object_type: objectType
          }
        }),
        supabase.functions.invoke('native-get-schema', {
          body: {
            connection_id: destinationConnectionId,
            object_type: objectType
          }
        })
      ]);

      if (sourceResponse.data?.success) {
        setSourceFields(sourceResponse.data.fields || []);
      }

      if (destinationResponse.data?.success) {
        setDestinationFields(destinationResponse.data.fields || []);
      }

      // If schemas couldn't be loaded, use sample fields
      if (!sourceResponse.data?.success || !destinationResponse.data?.success) {
        const sampleFields = getSampleFields(objectType);
        if (!sourceResponse.data?.success) setSourceFields(sampleFields);
        if (!destinationResponse.data?.success) setDestinationFields(sampleFields);
      }

    } catch (error) {
      console.error('Error loading schemas:', error);
      // Fallback to sample fields
      const sampleFields = getSampleFields(objectType);
      setSourceFields(sampleFields);
      setDestinationFields(sampleFields);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingMappings = async () => {
    try {
      const { data, error } = await supabase
        .from('field_mappings')
        .select('*')
        .eq('project_id', projectId)
        .eq('object_type_id', objectType);

      if (error) throw error;

      setFieldMappings(data || []);
    } catch (error) {
      console.error('Error loading existing mappings:', error);
    }
  };

  const getSampleFields = (objectType: string): string[] => {
    const fieldMap: Record<string, string[]> = {
      contacts: ['id', 'first_name', 'last_name', 'email', 'phone', 'company', 'title', 'created_at', 'updated_at'],
      companies: ['id', 'name', 'domain', 'industry', 'size', 'phone', 'address', 'created_at', 'updated_at'],
      deals: ['id', 'name', 'amount', 'stage', 'probability', 'close_date', 'contact_id', 'company_id', 'created_at', 'updated_at'],
      opportunities: ['id', 'name', 'amount', 'stage', 'probability', 'close_date', 'account_id', 'contact_id', 'created_at', 'updated_at']
    };
    
    return fieldMap[objectType] || ['id', 'name', 'created_at', 'updated_at'];
  };

  const addMapping = () => {
    setFieldMappings([
      ...fieldMappings,
      {
        source_field: '',
        destination_field: '',
        transformation_rule: '',
        is_required: false
      }
    ]);
  };

  const updateMapping = (index: number, updates: Partial<FieldMapping>) => {
    const updated = [...fieldMappings];
    updated[index] = { ...updated[index], ...updates };
    setFieldMappings(updated);
  };

  const removeMapping = (index: number) => {
    setFieldMappings(fieldMappings.filter((_, i) => i !== index));
  };

  const generateAutoMappings = () => {
    const autoMappings: FieldMapping[] = [];
    
    sourceFields.forEach(sourceField => {
      // Try exact match first
      let destinationField = destinationFields.find(df => df === sourceField);
      
      // Try similar matches
      if (!destinationField) {
        destinationField = destinationFields.find(df => 
          df.toLowerCase().includes(sourceField.toLowerCase()) ||
          sourceField.toLowerCase().includes(df.toLowerCase())
        );
      }
      
      if (destinationField) {
        autoMappings.push({
          source_field: sourceField,
          destination_field: destinationField,
          transformation_rule: '',
          is_required: ['id', 'name', 'email'].includes(sourceField.toLowerCase())
        });
      }
    });

    setFieldMappings(autoMappings);
    toast({
      title: "Auto-mapping Generated",
      description: `Created ${autoMappings.length} field mappings based on field name similarity`
    });
  };

  const saveMappings = async () => {
    if (fieldMappings.length === 0) {
      toast({
        title: "No Mappings",
        description: "Please create at least one field mapping",
        variant: "destructive"
      });
      return;
    }

    const validMappings = fieldMappings.filter(m => m.source_field && m.destination_field);
    if (validMappings.length === 0) {
      toast({
        title: "Invalid Mappings",
        description: "Please ensure all mappings have both source and destination fields",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Delete existing mappings
      await supabase
        .from('field_mappings')
        .delete()
        .eq('project_id', projectId)
        .eq('object_type_id', objectType);

      // Insert new mappings
      const mappingsToInsert = validMappings.map(mapping => ({
        project_id: projectId,
        object_type_id: objectType,
        source_field: mapping.source_field,
        destination_field: mapping.destination_field,
        transformation_rule: mapping.transformation_rule || null,
        is_required: mapping.is_required
      }));

      const { error } = await supabase
        .from('field_mappings')
        .insert(mappingsToInsert);

      if (error) throw error;

      toast({
        title: "Mappings Saved",
        description: `Successfully saved ${validMappings.length} field mappings`
      });

      onMappingsSaved?.();
    } catch (error) {
      console.error('Error saving mappings:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save field mappings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading schemas...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Schema Mapping - {objectType}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={generateAutoMappings}
                disabled={sourceFields.length === 0 || destinationFields.length === 0}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Auto-Map
              </Button>
              <Button onClick={saveMappings} disabled={isSaving}>
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save Mappings'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="mappings">Field Mappings</TabsTrigger>
              <TabsTrigger value="schemas">View Schemas</TabsTrigger>
            </TabsList>

            <TabsContent value="mappings" className="space-y-4">
              {fieldMappings.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No field mappings configured. Click "Auto-Map" to generate mappings automatically, or "Add Mapping" to create them manually.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {fieldMappings.map((mapping, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <Select
                            value={mapping.source_field}
                            onValueChange={(value) => updateMapping(index, { source_field: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Source field" />
                            </SelectTrigger>
                            <SelectContent>
                              {sourceFields.map(field => (
                                <SelectItem key={field} value={field}>{field}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-1 flex justify-center">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="col-span-4">
                          <Select
                            value={mapping.destination_field}
                            onValueChange={(value) => updateMapping(index, { destination_field: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Destination field" />
                            </SelectTrigger>
                            <SelectContent>
                              {destinationFields.map(field => (
                                <SelectItem key={field} value={field}>{field}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-2">
                          <Select
                            value={mapping.transformation_rule || ''}
                            onValueChange={(value) => updateMapping(index, { transformation_rule: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Transform" />
                            </SelectTrigger>
                            <SelectContent>
                              {transformationOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-1 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMapping(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {mapping.is_required && (
                        <Badge variant="secondary" className="mt-2">Required</Badge>
                      )}
                    </Card>
                  ))}
                </div>
              )}

              <Button onClick={addMapping} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Mapping
              </Button>
            </TabsContent>

            <TabsContent value="schemas" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Source Fields ({sourceFields.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {sourceFields.map(field => (
                        <Badge key={field} variant="outline">{field}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Destination Fields ({destinationFields.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {destinationFields.map(field => (
                        <Badge key={field} variant="outline">{field}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchemaMappingInterface;