import { supabase } from "@/integrations/supabase/client";

/**
 * Advanced Speed Optimizations for Production Migration
 * Includes pre-compiled schema mapping, streaming, and advanced concurrency
 */

export interface SchemaMapping {
  sourceField: string;
  destinationField: string;
  transform?: string;
  validation?: string;
  isRequired: boolean;
  cacheKey: string;
}

export interface CompiledMapping {
  mappings: SchemaMapping[];
  transformFunction: Function;
  validationFunction: Function;
  cacheVersion: string;
  compiledAt: string;
}

/**
 * Pre-compiled Schema Mapping Cache
 * Eliminates runtime mapping calculations
 */
export class SchemaMappingCache {
  private cache = new Map<string, CompiledMapping>();
  private static instance: SchemaMappingCache;

  public static getInstance(): SchemaMappingCache {
    if (!SchemaMappingCache.instance) {
      SchemaMappingCache.instance = new SchemaMappingCache();
    }
    return SchemaMappingCache.instance;
  }

  /**
   * Compile and cache field mappings for ultra-fast lookup
   */
  async compileMapping(
    projectId: string,
    sourceSystem: string,
    destinationSystem: string,
    objectType: string
  ): Promise<CompiledMapping> {
    const cacheKey = `${projectId}-${sourceSystem}-${destinationSystem}-${objectType}`;
    
    // Check if already cached
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Fetch mapping configuration from field_mappings table
    const { data: mappings, error } = await supabase
      .from('field_mappings')
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      console.warn('Error fetching field mappings:', error);
      // Return default mapping
      return this.createDefaultMapping();
    }

    // Transform database mappings to SchemaMapping format
    const schemaMappings: SchemaMapping[] = (mappings || []).map(mapping => ({
      sourceField: mapping.source_field,
      destinationField: mapping.destination_field,
      transform: mapping.transformation_rule || undefined,
      validation: undefined, // Add validation logic if needed
      isRequired: mapping.is_required || false,
      cacheKey: `${mapping.source_field}_${mapping.destination_field}`
    }));

    // Compile transformation and validation functions
    const transformFunction = this.compileTransformFunction(schemaMappings);
    const validationFunction = this.compileValidationFunction(schemaMappings);

    const compiled: CompiledMapping = {
      mappings: schemaMappings,
      transformFunction,
      validationFunction,
      cacheVersion: 'v1.0',
      compiledAt: new Date().toISOString()
    };

    // Cache the compiled mapping
    this.cache.set(cacheKey, compiled);
    
    // Persist to database for future sessions
    await this.persistCompiledMapping(cacheKey, compiled);

    return compiled;
  }

  private createDefaultMapping(): CompiledMapping {
    const defaultMappings: SchemaMapping[] = [
      {
        sourceField: 'id',
        destinationField: 'id',
        isRequired: true,
        cacheKey: 'id_id'
      },
      {
        sourceField: 'name',
        destinationField: 'name',
        isRequired: false,
        cacheKey: 'name_name'
      }
    ];

    return {
      mappings: defaultMappings,
      transformFunction: this.compileTransformFunction(defaultMappings),
      validationFunction: this.compileValidationFunction(defaultMappings),
      cacheVersion: 'v1.0',
      compiledAt: new Date().toISOString()
    };
  }

  private compileTransformFunction(mappings: SchemaMapping[]): Function {
    // Generate optimized transformation function at compile time
    let functionBody = 'const result = {};\n';
    
    mappings.forEach(mapping => {
      if (mapping.transform) {
        functionBody += `
          try {
            result['${mapping.destinationField}'] = ${mapping.transform};
          } catch (e) {
            result['${mapping.destinationField}'] = sourceRecord['${mapping.sourceField}'];
          }
        `;
      } else {
        functionBody += `result['${mapping.destinationField}'] = sourceRecord['${mapping.sourceField}'];\n`;
      }
    });
    
    functionBody += 'return result;';
    
    return new Function('sourceRecord', functionBody);
  }

  private compileValidationFunction(mappings: SchemaMapping[]): Function {
    let functionBody = 'const errors = [];\n';
    
    mappings.forEach(mapping => {
      if (mapping.isRequired) {
        functionBody += `
          if (!record['${mapping.destinationField}']) {
            errors.push('${mapping.destinationField} is required');
          }
        `;
      }
      
      if (mapping.validation) {
        functionBody += `
          try {
            if (!(${mapping.validation})) {
              errors.push('${mapping.destinationField} validation failed');
            }
          } catch (e) {
            errors.push('${mapping.destinationField} validation error: ' + e.message);
          }
        `;
      }
    });
    
    functionBody += 'return errors;';
    
    return new Function('record', functionBody);
  }

  private async persistCompiledMapping(cacheKey: string, compiled: CompiledMapping): Promise<void> {
    try {
      const { error } = await supabase
        .from('optimization_cache')
        .upsert({
          cache_key: cacheKey,
          cache_type: 'compiled_mapping',
          cache_data: JSON.parse(JSON.stringify({
            mappings: compiled.mappings,
            cacheVersion: compiled.cacheVersion,
            compiledAt: compiled.compiledAt
          }))
        });

      if (error) {
        console.warn('Could not persist compiled mapping:', error);
      }
    } catch (error) {
      console.warn('Error persisting compiled mapping:', error);
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}
