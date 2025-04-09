import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldMapping, MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import { ArrowRightLeft, Search, Plus, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { createFieldMapping } from "@/services/migration/fieldMappingService";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock source and destination fields for the unmapped fields component
// In a real application, these would come from your API
const mockSourceFields = [
  "email", "phone", "first_name", "last_name", "address", "city", "state", "zip", 
  "country", "company", "title", "department", "fax", "mobile_phone", "created_date",
  "updated_date", "lead_source", "lead_status", "rating", "custom_field_1", "custom_field_2"
];

const mockDestinationFields = [
  "email_address", "phone_number", "first_name", "last_name", "street", "city", "state_province", "postal_code",
  "country", "company_name", "job_title", "department", "fax_number", "mobile", "created_at",
  "updated_at", "source", "status", "score", "custom_1", "custom_2"
];

interface UnmappedFieldsPanelProps {
  objectType: MigrationObjectType;
  mappedFields: FieldMapping[];
  onMappingsCreated: () => void;
}

const UnmappedFieldsPanel: React.FC<UnmappedFieldsPanelProps> = ({ 
  objectType, 
  mappedFields,
  onMappingsCreated
}) => {
  const [searchSource, setSearchSource] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // In a real app, get these from your API
  const sourceFields = mockSourceFields;
  const destinationFields = mockDestinationFields;
  
  // Filter out already mapped fields
  const mappedSourceFields = mappedFields.map(m => m.source_field);
  const mappedDestinationFields = mappedFields.map(m => m.destination_field);
  
  const unmappedSourceFields = sourceFields.filter(field => !mappedSourceFields.includes(field));
  const unmappedDestinationFields = destinationFields.filter(field => !mappedDestinationFields.includes(field));
  
  // Filter by search term
  const filteredSourceFields = unmappedSourceFields.filter(field => 
    field.toLowerCase().includes(searchSource.toLowerCase())
  );
  
  const filteredDestinationFields = unmappedDestinationFields.filter(field => 
    field.toLowerCase().includes(searchDestination.toLowerCase())
  );
  
  const handleCreateMapping = async () => {
    if (!selectedSource || !selectedDestination) {
      toast.error("Please select both source and destination fields");
      return;
    }
    
    setIsCreating(true);
    try {
      await createFieldMapping({
        source_field: selectedSource,
        destination_field: selectedDestination,
        object_type_id: objectType.id,
        project_id: objectType.project_id,
        is_required: false,
        transformation_rule: null  // Add the missing transformation_rule property
      });
      
      toast.success("Field mapping created successfully");
      setSelectedSource(null);
      setSelectedDestination(null);
      onMappingsCreated();
    } catch (error) {
      console.error("Error creating field mapping:", error);
      toast.error("Failed to create field mapping");
    } finally {
      setIsCreating(false);
    }
  };
  
  const calculateSimilarity = (str1: string, str2: string): number => {
    // Simple string similarity check
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Check for exact match or contained strings
    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // Check for similar words
    const words1 = s1.split(/[_\s]+/);
    const words2 = s2.split(/[_\s]+/);
    
    let matchCount = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
          matchCount++;
        }
      }
    }
    
    return matchCount / Math.max(words1.length, words2.length);
  };
  
  const getSuggestedDestinationField = (sourceField: string): string | null => {
    if (!sourceField) return null;
    
    let bestMatch: { field: string; score: number } = { field: "", score: 0 };
    
    for (const destField of unmappedDestinationFields) {
      const score = calculateSimilarity(sourceField, destField);
      if (score > bestMatch.score && score >= 0.6) {
        bestMatch = { field: destField, score };
      }
    }
    
    return bestMatch.score > 0 ? bestMatch.field : null;
  };
  
  const handleSelectSource = (field: string) => {
    setSelectedSource(field);
    
    // If we have a good suggested match, auto-select it
    const suggestedDest = getSuggestedDestinationField(field);
    if (suggestedDest) {
      setSelectedDestination(suggestedDest);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-brand-500" />
          Unmapped Fields
        </CardTitle>
        <CardDescription>
          Map remaining fields between your source and destination CRMs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Source Fields</h3>
              <Badge variant="outline">{unmappedSourceFields.length}</Badge>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search source fields..."
                className="pl-9"
                value={searchSource}
                onChange={(e) => setSearchSource(e.target.value)}
              />
            </div>
            
            <ScrollArea className="h-64 border rounded-md">
              <div className="p-1">
                {filteredSourceFields.length > 0 ? (
                  <div className="space-y-1">
                    {filteredSourceFields.map((field) => {
                      const isSelected = field === selectedSource;
                      return (
                        <div 
                          key={field}
                          className={`p-2 rounded-md cursor-pointer transition-colors ${
                            isSelected ? 'bg-brand-100 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                          onClick={() => handleSelectSource(field)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{field}</span>
                            {isSelected && <Database className="h-3.5 w-3.5 text-brand-500" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No unmapped source fields
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Destination Fields</h3>
              <Badge variant="outline">{unmappedDestinationFields.length}</Badge>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search destination fields..."
                className="pl-9"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
              />
            </div>
            
            <ScrollArea className="h-64 border rounded-md">
              <div className="p-1">
                {filteredDestinationFields.length > 0 ? (
                  <div className="space-y-1">
                    {filteredDestinationFields.map((field) => {
                      const isSelected = field === selectedDestination;
                      // If source is selected, highlight suggested match
                      const suggested = selectedSource && field === getSuggestedDestinationField(selectedSource);
                      
                      return (
                        <div 
                          key={field}
                          className={`p-2 rounded-md cursor-pointer transition-colors ${
                            isSelected ? 'bg-brand-100 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800' : 
                            suggested ? 'bg-brand-50 dark:bg-brand-900/10 border-brand-100 dark:border-brand-900' :
                            'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                          onClick={() => setSelectedDestination(field)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{field}</span>
                            {isSelected && <Database className="h-3.5 w-3.5 text-brand-500" />}
                            {suggested && !isSelected && <ArrowRightLeft className="h-3.5 w-3.5 text-brand-400" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No unmapped destination fields
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {(selectedSource || selectedDestination) && (
          <div className="mt-6 p-4 border rounded-md bg-slate-50 dark:bg-slate-900/20">
            <h3 className="text-sm font-medium mb-2">Create New Mapping</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Field</TableHead>
                  <TableHead className="w-[50px] text-center"></TableHead>
                  <TableHead>Destination Field</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className={selectedSource ? "" : "text-muted-foreground italic"}>
                    {selectedSource || "Select a source field"}
                  </TableCell>
                  <TableCell className="text-center">
                    <ArrowRightLeft className="h-4 w-4 mx-auto text-brand-500" />
                  </TableCell>
                  <TableCell className={selectedDestination ? "" : "text-muted-foreground italic"}>
                    {selectedDestination || "Select a destination field"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      onClick={handleCreateMapping}
                      disabled={!selectedSource || !selectedDestination || isCreating}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {isCreating ? "Creating..." : "Create Mapping"}
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnmappedFieldsPanel;
