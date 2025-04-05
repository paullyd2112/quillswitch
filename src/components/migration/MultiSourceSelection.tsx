
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export interface CrmSource {
  id: string;
  name: string;
  type: 'salesforce' | 'hubspot' | 'dynamics' | 'zoho' | 'pipedrive';
  recordCounts: {
    contacts: number;
    accounts: number;
    opportunities: number;
    customObjects: number;
  };
  complexity: 'simple' | 'medium' | 'complex';
}

interface MultiSourceSelectionProps {
  sources: CrmSource[];
  onSourcesChange: (sources: CrmSource[]) => void;
}

export const MultiSourceSelection: React.FC<MultiSourceSelectionProps> = ({ 
  sources, 
  onSourcesChange 
}) => {
  const handleToggleSource = (sourceId: string) => {
    const updatedSources = sources.map(source => {
      if (source.id === sourceId) {
        return {
          ...source,
          selected: !source.selected
        };
      }
      return source;
    });
    onSourcesChange(updatedSources);
  };

  const handleUpdateRecordCount = (
    sourceId: string, 
    recordType: keyof CrmSource['recordCounts'], 
    value: number
  ) => {
    const updatedSources = sources.map(source => {
      if (source.id === sourceId) {
        return {
          ...source,
          recordCounts: {
            ...source.recordCounts,
            [recordType]: value
          }
        };
      }
      return source;
    });
    onSourcesChange(updatedSources);
  };

  const handleUpdateComplexity = (sourceId: string, complexity: CrmSource['complexity']) => {
    const updatedSources = sources.map(source => {
      if (source.id === sourceId) {
        return {
          ...source,
          complexity
        };
      }
      return source;
    });
    onSourcesChange(updatedSources);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">CRM Sources</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Select multiple CRM sources to simulate a multi-CRM migration scenario
      </p>
      
      <div className="grid gap-4">
        {sources.map((source) => (
          <Card key={source.id} className={`overflow-hidden transition-all ${source.selected ? 'border-brand-400 dark:border-brand-600' : ''}`}>
            <div className="p-4 flex items-center justify-between bg-accent/20">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id={`source-${source.id}`} 
                  checked={source.selected}
                  onCheckedChange={() => handleToggleSource(source.id)}
                />
                <Label 
                  htmlFor={`source-${source.id}`} 
                  className="font-medium cursor-pointer"
                >
                  {source.name}
                </Label>
                <Badge variant="outline" className="ml-2 capitalize">
                  {source.type}
                </Badge>
              </div>
              
              {source.selected && (
                <Select
                  value={source.complexity}
                  onValueChange={(value) => handleUpdateComplexity(source.id, value as CrmSource['complexity'])}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="complex">Complex</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {source.selected && (
              <CardContent className="p-4 pt-4 bg-card">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`contacts-${source.id}`}>Contacts</Label>
                    <Input
                      id={`contacts-${source.id}`}
                      type="number"
                      value={source.recordCounts.contacts}
                      onChange={(e) => handleUpdateRecordCount(
                        source.id, 
                        'contacts', 
                        parseInt(e.target.value) || 0
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`accounts-${source.id}`}>Accounts</Label>
                    <Input
                      id={`accounts-${source.id}`}
                      type="number"
                      value={source.recordCounts.accounts}
                      onChange={(e) => handleUpdateRecordCount(
                        source.id, 
                        'accounts', 
                        parseInt(e.target.value) || 0
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`opportunities-${source.id}`}>Opportunities</Label>
                    <Input
                      id={`opportunities-${source.id}`}
                      type="number" 
                      value={source.recordCounts.opportunities}
                      onChange={(e) => handleUpdateRecordCount(
                        source.id, 
                        'opportunities', 
                        parseInt(e.target.value) || 0
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`custom-${source.id}`}>Custom Objects</Label>
                    <Input
                      id={`custom-${source.id}`}
                      type="number"
                      value={source.recordCounts.customObjects}
                      onChange={(e) => handleUpdateRecordCount(
                        source.id, 
                        'customObjects', 
                        parseInt(e.target.value) || 0
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MultiSourceSelection;
