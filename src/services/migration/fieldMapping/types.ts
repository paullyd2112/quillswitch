
export interface MappingSuggestion {
  source_field: string;
  destination_field: string;
  confidence: number;
  is_required?: boolean;
  reason?: string;
}
