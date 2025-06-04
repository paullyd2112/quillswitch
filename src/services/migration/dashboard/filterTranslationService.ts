
import { DashboardFilter, FilterType, FilterOperator } from "./types";

/**
 * Filter Translation Service
 * Converts filters between different CRM systems
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
   * Translate filters between CRM systems
   */
  async translateFilters(
    sourceFilters: DashboardFilter[],
    sourceCrm: string,
    destinationCrm: string,
    fieldMappings: Record<string, string> = {}
  ): Promise<{
    translatedFilters: DashboardFilter[];
    warnings: string[];
    errors: string[];
  }> {
    const translatedFilters: DashboardFilter[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    for (const filter of sourceFilters) {
      try {
        const translated = await this.translateFilter(
          filter,
          sourceCrm,
          destinationCrm,
          fieldMappings
        );
        
        if (translated) {
          translatedFilters.push(translated);
        } else {
          warnings.push(`Could not translate filter: ${filter.name}`);
        }
      } catch (error) {
        errors.push(`Failed to translate filter ${filter.name}: ${error}`);
      }
    }

    return {
      translatedFilters,
      warnings,
      errors
    };
  }

  /**
   * Translate individual filter
   */
  private async translateFilter(
    sourceFilter: DashboardFilter,
    sourceCrm: string,
    destinationCrm: string,
    fieldMappings: Record<string, string>
  ): Promise<DashboardFilter | null> {
    const translated: DashboardFilter = {
      ...sourceFilter,
      field: fieldMappings[sourceFilter.field] || sourceFilter.field
    };

    // Translate filter type if needed
    const typeMapping = this.getFilterTypeMapping(sourceFilter.type, sourceCrm, destinationCrm);
    if (typeMapping) {
      translated.type = typeMapping.type;
      if (typeMapping.valueTransform) {
        translated.value = typeMapping.valueTransform(sourceFilter.value);
      }
    }

    // Translate operator if needed
    const operatorMapping = this.getOperatorMapping(sourceFilter.operator, sourceCrm, destinationCrm);
    if (operatorMapping) {
      translated.operator = operatorMapping;
    }

    return translated;
  }

  /**
   * Get filter type mapping between CRM systems
   */
  private getFilterTypeMapping(
    sourceType: FilterType,
    sourceCrm: string,
    destinationCrm: string
  ): {
    type: FilterType;
    valueTransform?: (value: any) => any;
  } | null {
    // Simple mapping - in real implementation, this would be more comprehensive
    const mappings: Record<string, Record<FilterType, FilterType>> = {
      'salesforce_to_hubspot': {
        'multipicklist': 'picklist',
        'user': 'text',
        'record': 'text',
        'datetime': 'date',
        'text': 'text',
        'number': 'number',
        'date': 'date',
        'picklist': 'picklist',
        'boolean': 'boolean'
      }
    };

    const key = `${sourceCrm}_to_${destinationCrm}`;
    const mapping = mappings[key];
    
    if (mapping && mapping[sourceType]) {
      return { type: mapping[sourceType] };
    }

    return { type: sourceType }; // Return original if no mapping needed
  }

  /**
   * Get operator mapping between CRM systems
   */
  private getOperatorMapping(
    sourceOperator: FilterOperator,
    sourceCrm: string,
    destinationCrm: string
  ): FilterOperator | null {
    // Most operators are universal, but some might need translation
    return sourceOperator;
  }
}

export const filterTranslationService = FilterTranslationService.getInstance();
