
import { DashboardFilter, FilterType, FilterOperator, FilterOption } from "./types";

/**
 * Filter Translation Service
 * Converts dashboard filters and criteria between CRM systems
 */
export class FilterTranslationService {
  private static instance: FilterTranslationService;

  public static getInstance(): FilterTranslationService {
    if (!FilterTranslationService.instance) {
      FilterTranslationService.instance = new FilterTranslationService();
    }
    return FilterTranslationService.instance;
  }

  /**
   * Translate filters from source to destination CRM format
   */
  async translateFilters(
    sourceFilters: DashboardFilter[],
    sourceCrm: string,
    destinationCrm: string,
    fieldMappings: Record<string, string>
  ): Promise<{
    translatedFilters: DashboardFilter[];
    translationNotes: string[];
    unsupportedFilters: DashboardFilter[];
  }> {
    const translatedFilters: DashboardFilter[] = [];
    const translationNotes: string[] = [];
    const unsupportedFilters: DashboardFilter[] = [];

    for (const filter of sourceFilters) {
      try {
        const translated = await this.translateFilter(
          filter, 
          sourceCrm, 
          destinationCrm, 
          fieldMappings
        );
        
        if (translated.success) {
          translatedFilters.push(translated.filter);
          if (translated.notes) {
            translationNotes.push(translated.notes);
          }
        } else {
          unsupportedFilters.push(filter);
          translationNotes.push(translated.error || 'Filter translation failed');
        }
      } catch (error) {
        console.error('Filter translation error:', error);
        unsupportedFilters.push(filter);
        translationNotes.push(`Failed to translate filter: ${filter.name}`);
      }
    }

    return { translatedFilters, translationNotes, unsupportedFilters };
  }

  /**
   * Translate a single filter
   */
  private async translateFilter(
    filter: DashboardFilter,
    sourceCrm: string,
    destinationCrm: string,
    fieldMappings: Record<string, string>
  ): Promise<{
    success: boolean;
    filter?: DashboardFilter;
    notes?: string;
    error?: string;
  }> {
    // Map field name
    const mappedField = fieldMappings[filter.field] || filter.field;
    if (!mappedField) {
      return {
        success: false,
        error: `No field mapping found for: ${filter.field}`
      };
    }

    // Translate filter type
    const typeTranslation = this.translateFilterType(filter.type, sourceCrm, destinationCrm);
    if (!typeTranslation.success) {
      return {
        success: false,
        error: typeTranslation.error
      };
    }

    // Translate operator
    const operatorTranslation = this.translateOperator(
      filter.operator, 
      filter.type, 
      typeTranslation.type!,
      sourceCrm, 
      destinationCrm
    );

    // Translate value
    const valueTranslation = await this.translateFilterValue(
      filter.value,
      filter.type,
      typeTranslation.type!,
      sourceCrm,
      destinationCrm
    );

    // Translate options if present
    let translatedOptions: FilterOption[] | undefined;
    if (filter.options) {
      translatedOptions = await this.translateFilterOptions(
        filter.options,
        filter.type,
        typeTranslation.type!,
        sourceCrm,
        destinationCrm
      );
    }

    const translatedFilter: DashboardFilter = {
      ...filter,
      field: mappedField,
      type: typeTranslation.type!,
      operator: operatorTranslation.operator,
      value: valueTranslation.value,
      defaultValue: valueTranslation.defaultValue,
      options: translatedOptions
    };

    const notes = [
      typeTranslation.notes,
      operatorTranslation.notes,
      valueTranslation.notes
    ].filter(Boolean).join('; ');

    return {
      success: true,
      filter: translatedFilter,
      notes: notes || undefined
    };
  }

  /**
   * Translate filter type between CRM systems
   */
  private translateFilterType(
    sourceType: FilterType,
    sourceCrm: string,
    destinationCrm: string
  ): {
    success: boolean;
    type?: FilterType;
    notes?: string;
    error?: string;
  } {
    // Get type mappings for CRM systems
    const sourceMappings = this.getFilterTypeMappings(sourceCrm);
    const destinationMappings = this.getFilterTypeMappings(destinationCrm);

    // Check if direct mapping exists
    if (destinationMappings.supported.includes(sourceType)) {
      return { success: true, type: sourceType };
    }

    // Look for alternative mapping
    const alternatives = this.getFilterTypeAlternatives(sourceType);
    for (const alt of alternatives) {
      if (destinationMappings.supported.includes(alt.type)) {
        return {
          success: true,
          type: alt.type,
          notes: alt.notes
        };
      }
    }

    return {
      success: false,
      error: `Filter type '${sourceType}' not supported in ${destinationCrm}`
    };
  }

  /**
   * Translate filter operator
   */
  private translateOperator(
    sourceOperator: FilterOperator,
    sourceType: FilterType,
    destinationType: FilterType,
    sourceCrm: string,
    destinationCrm: string
  ): {
    operator: FilterOperator;
    notes?: string;
  } {
    // Get operator mappings
    const sourceOperators = this.getSupportedOperators(sourceType, sourceCrm);
    const destinationOperators = this.getSupportedOperators(destinationType, destinationCrm);

    // Direct mapping if supported
    if (destinationOperators.includes(sourceOperator)) {
      return { operator: sourceOperator };
    }

    // Find alternative operator
    const alternative = this.findAlternativeOperator(
      sourceOperator, 
      sourceType, 
      destinationType, 
      destinationOperators
    );

    return {
      operator: alternative.operator,
      notes: alternative.notes
    };
  }

  /**
   * Translate filter value
   */
  private async translateFilterValue(
    sourceValue: any,
    sourceType: FilterType,
    destinationType: FilterType,
    sourceCrm: string,
    destinationCrm: string
  ): Promise<{
    value: any;
    defaultValue?: any;
    notes?: string;
  }> {
    // Handle type-specific value translations
    switch (sourceType) {
      case 'user':
        return this.translateUserValue(sourceValue, destinationType, sourceCrm, destinationCrm);
      
      case 'record':
        return this.translateRecordValue(sourceValue, destinationType, sourceCrm, destinationCrm);
      
      case 'picklist':
      case 'multipicklist':
        return this.translatePicklistValue(sourceValue, destinationType, sourceCrm, destinationCrm);
      
      case 'date':
      case 'datetime':
        return this.translateDateValue(sourceValue, destinationType);
      
      default:
        return { value: sourceValue };
    }
  }

  /**
   * Translate user filter values
   */
  private async translateUserValue(
    sourceValue: any,
    destinationType: FilterType,
    sourceCrm: string,
    destinationCrm: string
  ): Promise<{ value: any; notes?: string; }> {
    if (destinationType === 'user') {
      // Try to map user IDs between systems
      // This would require user mapping service
      return { 
        value: sourceValue,
        notes: 'User IDs may need manual verification'
      };
    }

    if (destinationType === 'picklist') {
      // Convert to user name list
      return {
        value: Array.isArray(sourceValue) ? sourceValue[0] : sourceValue,
        notes: 'User filter converted to dropdown selection'
      };
    }

    return { 
      value: sourceValue,
      notes: 'User filter value may need adjustment'
    };
  }

  /**
   * Translate record filter values
   */
  private async translateRecordValue(
    sourceValue: any,
    destinationType: FilterType,
    sourceCrm: string,
    destinationCrm: string
  ): Promise<{ value: any; notes?: string; }> {
    if (destinationType === 'text') {
      // Convert record ID to text search
      return {
        value: sourceValue,
        notes: 'Record lookup converted to text search'
      };
    }

    return { 
      value: sourceValue,
      notes: 'Record reference may need manual mapping'
    };
  }

  /**
   * Translate picklist values
   */
  private async translatePicklistValue(
    sourceValue: any,
    destinationType: FilterType,
    sourceCrm: string,
    destinationCrm: string
  ): Promise<{ value: any; notes?: string; }> {
    if (destinationType === 'picklist' && Array.isArray(sourceValue)) {
      // Convert multipicklist to single picklist
      return {
        value: sourceValue[0],
        notes: 'Multiple values reduced to first selection'
      };
    }

    return { value: sourceValue };
  }

  /**
   * Translate date values
   */
  private translateDateValue(
    sourceValue: any,
    destinationType: FilterType
  ): { value: any; notes?: string; } {
    if (destinationType === 'date' && typeof sourceValue === 'string') {
      // Extract date part from datetime
      const dateOnly = sourceValue.split('T')[0];
      return {
        value: dateOnly,
        notes: 'DateTime converted to date only'
      };
    }

    return { value: sourceValue };
  }

  /**
   * Translate filter options
   */
  private async translateFilterOptions(
    sourceOptions: FilterOption[],
    sourceType: FilterType,
    destinationType: FilterType,
    sourceCrm: string,
    destinationCrm: string
  ): Promise<FilterOption[]> {
    // For picklist options, might need value mapping
    if (sourceType === 'picklist' && destinationType === 'picklist') {
      // This would use picklist value mapping service
      return sourceOptions.map(option => ({
        ...option,
        // Potentially map values here
      }));
    }

    return sourceOptions;
  }

  /**
   * Get supported filter types for CRM system
   */
  private getFilterTypeMappings(crmSystem: string): { supported: FilterType[] } {
    const mappings: Record<string, { supported: FilterType[] }> = {
      salesforce: {
        supported: ['text', 'number', 'date', 'datetime', 'picklist', 'multipicklist', 'boolean', 'user', 'record']
      },
      hubspot: {
        supported: ['text', 'number', 'date', 'picklist', 'boolean']
      },
      pipedrive: {
        supported: ['text', 'number', 'date', 'picklist', 'boolean', 'user']
      }
    };

    return mappings[crmSystem.toLowerCase()] || { supported: ['text', 'number', 'date', 'boolean'] };
  }

  /**
   * Get alternative filter types
   */
  private getFilterTypeAlternatives(sourceType: FilterType): Array<{ type: FilterType; notes: string }> {
    const alternatives: Record<FilterType, Array<{ type: FilterType; notes: string }>> = {
      multipicklist: [
        { type: 'picklist', notes: 'Multi-select converted to single select' }
      ],
      user: [
        { type: 'picklist', notes: 'User filter converted to dropdown' },
        { type: 'text', notes: 'User filter converted to text search' }
      ],
      record: [
        { type: 'text', notes: 'Record lookup converted to text search' }
      ],
      datetime: [
        { type: 'date', notes: 'DateTime filter converted to date only' }
      ],
      text: [],
      number: [],
      date: [],
      picklist: [],
      boolean: []
    };

    return alternatives[sourceType] || [];
  }

  /**
   * Get supported operators for filter type and CRM
   */
  private getSupportedOperators(filterType: FilterType, crmSystem: string): FilterOperator[] {
    const baseOperators: Record<FilterType, FilterOperator[]> = {
      text: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with'],
      number: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'between'],
      date: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'between'],
      datetime: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'between'],
      picklist: ['equals', 'not_equals', 'in', 'not_in'],
      multipicklist: ['contains', 'not_contains', 'in', 'not_in'],
      boolean: ['equals', 'not_equals'],
      user: ['equals', 'not_equals', 'in', 'not_in'],
      record: ['equals', 'not_equals', 'in', 'not_in']
    };

    return baseOperators[filterType] || ['equals', 'not_equals'];
  }

  /**
   * Find alternative operator
   */
  private findAlternativeOperator(
    sourceOperator: FilterOperator,
    sourceType: FilterType,
    destinationType: FilterType,
    availableOperators: FilterOperator[]
  ): { operator: FilterOperator; notes?: string } {
    // Try exact match first
    if (availableOperators.includes(sourceOperator)) {
      return { operator: sourceOperator };
    }

    // Find closest alternative
    const alternatives: Record<FilterOperator, FilterOperator[]> = {
      contains: ['equals', 'starts_with'],
      not_contains: ['not_equals'],
      starts_with: ['contains', 'equals'],
      ends_with: ['contains', 'equals'],
      in: ['equals'],
      not_in: ['not_equals'],
      between: ['greater_equal'],
      is_null: ['equals'],
      is_not_null: ['not_equals'],
      equals: [],
      not_equals: [],
      greater_than: [],
      less_than: [],
      greater_equal: [],
      less_equal: []
    };

    const alts = alternatives[sourceOperator] || [];
    for (const alt of alts) {
      if (availableOperators.includes(alt)) {
        return {
          operator: alt,
          notes: `Operator changed from '${sourceOperator}' to '${alt}'`
        };
      }
    }

    // Default fallback
    return {
      operator: availableOperators[0] || 'equals',
      notes: `Operator '${sourceOperator}' not supported, using '${availableOperators[0] || 'equals'}'`
    };
  }
}

export const filterTranslationService = FilterTranslationService.getInstance();
