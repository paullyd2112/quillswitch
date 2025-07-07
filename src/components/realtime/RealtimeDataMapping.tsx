import React, { useEffect, useState } from 'react';
import { useRealtime } from '@/contexts/RealtimeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowRight, 
  Users, 
  Eye, 
  Edit3, 
  Save, 
  X, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MappingChange {
  id: string;
  userId: string;
  userEmail: string;
  fieldId: string;
  sourceField: string;
  destinationField: string;
  previousDestination?: string;
  timestamp: Date;
  type: 'create' | 'update' | 'delete';
}

interface ActiveEditor {
  userId: string;
  userEmail: string;
  fieldId: string;
  startedAt: Date;
}

interface RealtimeDataMappingProps {
  projectId: string;
  mappings: Array<{
    id: string;
    sourceField: string;
    destinationField: string;
    isRequired: boolean;
  }>;
  destinationFields: string[];
  onMappingChange?: (fieldId: string, destinationField: string) => void;
}

export const RealtimeDataMapping: React.FC<RealtimeDataMappingProps> = ({
  projectId,
  mappings,
  destinationFields,
  onMappingChange
}) => {
  const { subscribeDataMapping, broadcastMappingChange } = useRealtime();
  const [recentChanges, setRecentChanges] = useState<MappingChange[]>([]);
  const [activeEditors, setActiveEditors] = useState<ActiveEditor[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  useEffect(() => {
    subscribeDataMapping(projectId, (change) => {
      if (change.type === 'mapping_change') {
        const mappingChange: MappingChange = {
          id: crypto.randomUUID(),
          userId: change.userId,
          userEmail: change.userEmail,
          fieldId: change.fieldId,
          sourceField: change.sourceField,
          destinationField: change.destinationField,
          previousDestination: change.previousDestination,
          timestamp: new Date(change.timestamp),
          type: change.changeType
        };
        
        setRecentChanges(prev => [mappingChange, ...prev].slice(0, 10));
      } else if (change.type === 'edit_start') {
        const editor: ActiveEditor = {
          userId: change.userId,
          userEmail: change.userEmail,
          fieldId: change.fieldId,
          startedAt: new Date(change.timestamp)
        };
        
        setActiveEditors(prev => {
          const filtered = prev.filter(e => !(e.userId === editor.userId && e.fieldId === editor.fieldId));
          return [...filtered, editor];
        });
      } else if (change.type === 'edit_end') {
        setActiveEditors(prev => 
          prev.filter(e => !(e.userId === change.userId && e.fieldId === change.fieldId))
        );
      }
    });
  }, [projectId, subscribeDataMapping]);

  const startEditing = (fieldId: string, currentValue: string) => {
    setEditingField(fieldId);
    setTempValue(currentValue);
    
    // Broadcast that we're editing this field
    broadcastMappingChange(projectId, {
      type: 'edit_start',
      fieldId,
      userId: 'current-user', // Would get from auth context
      userEmail: 'current@user.com', // Would get from auth context
      timestamp: new Date().toISOString()
    });
  };

  const saveMapping = (fieldId: string) => {
    const mapping = mappings.find(m => m.id === fieldId);
    if (!mapping) return;

    const previousDestination = mapping.destinationField;
    
    // Update local state
    onMappingChange?.(fieldId, tempValue);
    
    // Broadcast the change
    broadcastMappingChange(projectId, {
      type: 'mapping_change',
      fieldId,
      sourceField: mapping.sourceField,
      destinationField: tempValue,
      previousDestination,
      changeType: 'update',
      userId: 'current-user',
      userEmail: 'current@user.com',
      timestamp: new Date().toISOString()
    });

    cancelEditing();
  };

  const cancelEditing = () => {
    if (editingField) {
      // Broadcast that we stopped editing
      broadcastMappingChange(projectId, {
        type: 'edit_end',
        fieldId: editingField,
        userId: 'current-user',
        userEmail: 'current@user.com',
        timestamp: new Date().toISOString()
      });
    }
    
    setEditingField(null);
    setTempValue('');
  };

  const getFieldEditor = (fieldId: string) => {
    return activeEditors.find(e => e.fieldId === fieldId);
  };

  const getChangeTypeColor = (type: MappingChange['type']) => {
    switch (type) {
      case 'create': return 'default';
      case 'update': return 'outline';
      case 'delete': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mapping Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Field Mappings</span>
            <div className="flex items-center gap-2">
              {activeEditors.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Edit3 className="h-3 w-3" />
                  {activeEditors.length} editing
                </Badge>
              )}
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Live Collaboration
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            {mappings.map((mapping) => {
              const editor = getFieldEditor(mapping.id);
              const isBeingEdited = editingField === mapping.id;
              
              return (
                <div
                  key={mapping.id}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                    editor ? 'border-warning bg-warning/5' : 'border-border'
                  }`}
                >
                  {/* Source Field */}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{mapping.sourceField}</div>
                    {mapping.isRequired && (
                      <Badge variant="destructive" className="text-xs h-4 mt-1">
                        Required
                      </Badge>
                    )}
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                  {/* Destination Field */}
                  <div className="flex-1">
                    {isBeingEdited ? (
                      <div className="flex items-center gap-2">
                        <Select value={tempValue} onValueChange={setTempValue}>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select field..." />
                          </SelectTrigger>
                          <SelectContent>
                            {destinationFields.map((field) => (
                              <SelectItem key={field} value={field}>
                                {field}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => saveMapping(mapping.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEditing}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{mapping.destinationField || 'Not mapped'}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(mapping.id, mapping.destinationField)}
                          className="h-6 w-6 p-0"
                          disabled={!!editor}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {/* Editor Indicator */}
                    {editor && !isBeingEdited && (
                      <div className="flex items-center gap-1 mt-1">
                        <Eye className="h-3 w-3 text-warning" />
                        <span className="text-xs text-warning">
                          {editor.userEmail} is editing
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Changes */}
      {recentChanges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Changes
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              {recentChanges.map((change) => (
                <div
                  key={change.id}
                  className="flex items-center justify-between p-2 rounded bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={getChangeTypeColor(change.type)} className="text-xs h-5">
                      {change.type}
                    </Badge>
                    <span className="text-sm">
                      <strong>{change.sourceField}</strong> → <strong>{change.destinationField}</strong>
                    </span>
                    {change.previousDestination && (
                      <span className="text-xs text-muted-foreground">
                        (was: {change.previousDestination})
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-right">
                    <div>{change.userEmail}</div>
                    <div>{formatDistanceToNow(change.timestamp, { addSuffix: true })}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};