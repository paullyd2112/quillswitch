import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface TransformationRequest {
  sourceData: any[];
  sourceCrm: string;
  destinationCrm: string;
  objectType: string;
  fieldMappings: Array<{
    sourceField: string;
    destinationField: string;
    transformationRule?: string;
    isRequired?: boolean;
  }>;
  customTransformations?: Record<string, string>;
}

interface TransformationResult {
  transformedData: any[];
  validRecords: any[];
  invalidRecords: Array<{
    record: any;
    errors: string[];
    index: number;
  }>;
  summary: {
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    transformationErrors: string[];
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Only POST method is supported');
    }

    const transformationRequest: TransformationRequest = await req.json();
    
    console.log(`Transforming ${transformationRequest.sourceData.length} records from ${transformationRequest.sourceCrm} to ${transformationRequest.destinationCrm}`);

    const result = await transformData(transformationRequest);

    console.log(`Transformation complete: ${result.summary.validRecords} valid, ${result.summary.invalidRecords} invalid records`);

    return new Response(
      JSON.stringify({
        success: true,
        ...result,
        metadata: {
          transformedAt: new Date().toISOString(),
          sourceCrm: transformationRequest.sourceCrm,
          destinationCrm: transformationRequest.destinationCrm,
          objectType: transformationRequest.objectType
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Data transformation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function transformData(request: TransformationRequest): Promise<TransformationResult> {
  const { sourceData, sourceCrm, destinationCrm, objectType, fieldMappings, customTransformations } = request;
  
  const transformedData: any[] = [];
  const validRecords: any[] = [];
  const invalidRecords: Array<{ record: any; errors: string[]; index: number }> = [];
  const transformationErrors: string[] = [];

  for (let i = 0; i < sourceData.length; i++) {
    const sourceRecord = sourceData[i];
    const errors: string[] = [];

    try {
      const transformedRecord = await transformRecord(
        sourceRecord,
        fieldMappings,
        sourceCrm,
        destinationCrm,
        objectType,
        customTransformations
      );

      // Validate required fields
      const validationErrors = validateRecord(transformedRecord, fieldMappings);
      
      if (validationErrors.length === 0) {
        transformedData.push(transformedRecord);
        validRecords.push(transformedRecord);
      } else {
        errors.push(...validationErrors);
        invalidRecords.push({
          record: transformedRecord,
          errors,
          index: i
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown transformation error';
      errors.push(errorMessage);
      transformationErrors.push(`Record ${i}: ${errorMessage}`);
      
      invalidRecords.push({
        record: sourceRecord,
        errors,
        index: i
      });
    }
  }

  return {
    transformedData,
    validRecords,
    invalidRecords,
    summary: {
      totalRecords: sourceData.length,
      validRecords: validRecords.length,
      invalidRecords: invalidRecords.length,
      transformationErrors
    }
  };
}

async function transformRecord(
  sourceRecord: any,
  fieldMappings: TransformationRequest['fieldMappings'],
  sourceCrm: string,
  destinationCrm: string,
  objectType: string,
  customTransformations?: Record<string, string>
): Promise<any> {
  const transformedRecord: any = {};

  // Apply field mappings
  for (const mapping of fieldMappings) {
    const sourceValue = getNestedValue(sourceRecord, mapping.sourceField);
    
    if (sourceValue !== undefined && sourceValue !== null) {
      let transformedValue = sourceValue;

      // Apply transformation rule if specified
      if (mapping.transformationRule) {
        transformedValue = await applyTransformationRule(
          sourceValue,
          mapping.transformationRule,
          sourceCrm,
          destinationCrm
        );
      }

      // Apply custom transformations
      if (customTransformations && customTransformations[mapping.destinationField]) {
        transformedValue = await applyCustomTransformation(
          transformedValue,
          customTransformations[mapping.destinationField]
        );
      }

      // Apply CRM-specific field transformations
      transformedValue = await applyCrmSpecificTransformation(
        transformedValue,
        mapping.destinationField,
        sourceCrm,
        destinationCrm,
        objectType
      );

      setNestedValue(transformedRecord, mapping.destinationField, transformedValue);
    }
  }

  return transformedRecord;
}

function validateRecord(record: any, fieldMappings: TransformationRequest['fieldMappings']): string[] {
  const errors: string[] = [];

  for (const mapping of fieldMappings) {
    if (mapping.isRequired) {
      const value = getNestedValue(record, mapping.destinationField);
      if (value === undefined || value === null || value === '') {
        errors.push(`Required field '${mapping.destinationField}' is missing or empty`);
      }
    }
  }

  return errors;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key];
  }, obj);
  
  target[lastKey] = value;
}

async function applyTransformationRule(
  value: any,
  rule: string,
  sourceCrm: string,
  destinationCrm: string
): Promise<any> {
  try {
    // Common transformation rules
    switch (rule.toLowerCase()) {
      case 'uppercase':
        return typeof value === 'string' ? value.toUpperCase() : value;
      
      case 'lowercase':
        return typeof value === 'string' ? value.toLowerCase() : value;
      
      case 'capitalize':
        return typeof value === 'string' 
          ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() 
          : value;
      
      case 'trim':
        return typeof value === 'string' ? value.trim() : value;
      
      case 'phone_format':
        return formatPhoneNumber(value);
      
      case 'email_normalize':
        return normalizeEmail(value);
      
      case 'date_iso':
        return formatDateToISO(value);
      
      case 'boolean_convert':
        return convertToBoolean(value);
      
      case 'number_convert':
        return convertToNumber(value);
      
      default:
        // If it's a custom JavaScript expression, evaluate it safely
        if (rule.includes('return') || rule.includes('=>')) {
          return evaluateCustomRule(value, rule);
        }
        return value;
    }
  } catch (error) {
    console.warn(`Transformation rule '${rule}' failed for value '${value}':`, error);
    return value; // Return original value if transformation fails
  }
}

async function applyCustomTransformation(value: any, customRule: string): Promise<any> {
  try {
    return evaluateCustomRule(value, customRule);
  } catch (error) {
    console.warn(`Custom transformation failed for value '${value}':`, error);
    return value;
  }
}

function evaluateCustomRule(value: any, rule: string): any {
  try {
    // Create a safe evaluation context
    const context = { value, input: value };
    
    // Use Function constructor for safer evaluation than eval
    const transformFunction = new Function('value', 'input', `return ${rule}`);
    return transformFunction(value, value);
  } catch (error) {
    throw new Error(`Custom rule evaluation failed: ${error.message}`);
  }
}

async function applyCrmSpecificTransformation(
  value: any,
  fieldName: string,
  sourceCrm: string,
  destinationCrm: string,
  objectType: string
): Promise<any> {
  // Handle CRM-specific field format differences
  
  // Salesforce to HubSpot transformations
  if (sourceCrm === 'salesforce' && destinationCrm === 'hubspot') {
    if (fieldName === 'email' && objectType === 'contacts') {
      // HubSpot contacts use 'email' instead of multiple email fields
      return value;
    }
    if (fieldName.endsWith('__c')) {
      // Salesforce custom fields to HubSpot custom properties
      return value;
    }
  }

  // HubSpot to Salesforce transformations
  if (sourceCrm === 'hubspot' && destinationCrm === 'salesforce') {
    if (fieldName === 'Email' && objectType === 'Contact') {
      // Salesforce expects proper email format
      return normalizeEmail(value);
    }
  }

  // Pipedrive transformations
  if (destinationCrm === 'pipedrive') {
    if (fieldName.includes('_time') || fieldName.includes('_date')) {
      // Pipedrive expects specific date formats
      return formatDateToISO(value);
    }
  }

  return value;
}

// Utility transformation functions
function formatPhoneNumber(phone: any): string {
  if (!phone || typeof phone !== 'string') return phone;
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format US phone numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  return phone; // Return original if not recognizable format
}

function normalizeEmail(email: any): string {
  if (!email || typeof email !== 'string') return email;
  return email.toLowerCase().trim();
}

function formatDateToISO(date: any): string | null {
  if (!date) return null;
  
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null;
    return parsedDate.toISOString();
  } catch {
    return null;
  }
}

function convertToBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'on';
  }
  if (typeof value === 'number') return value !== 0;
  return Boolean(value);
}

function convertToNumber(value: any): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}