
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ValidationService } from "./ValidationService";
import { DataLoadingConfig, DEFAULT_CONFIG, ValidationIssue, ValidationResult } from "./types";
import { handleServiceError } from "@/services/utils/serviceUtils";

export class DataLoadingService {
  private jobId: string;
  private sourceType: string;
  private duplicateKeys: Set<string>;
  private config: DataLoadingConfig;
  private validationService: ValidationService;

  constructor(sourceType: string, config?: Partial<DataLoadingConfig>) {
    this.sourceType = sourceType;
    this.duplicateKeys = new Set();
    
    // Merge default config with provided config
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Initialize validation service with default rules for the source type
    this.validationService = new ValidationService(
      ValidationService.getDefaultRulesForType(sourceType)
    );
    
    // Add custom validation rules if provided
    if (this.config.validationRules) {
      this.validationService.addRules(this.config.validationRules);
    }
  }

  async initializeJob() {
    // Get current user session to get the user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("User must be authenticated to load data");
    }
    
    const userId = session.user.id;
    
    const { data, error } = await supabase
      .from('data_loading_jobs')
      .insert({
        source_type: this.sourceType,
        status: 'initializing',
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to initialize job: ${error.message}`);
    }

    this.jobId = data.id;
    return data;
  }

  private async validateRecord(record: any, index: number): Promise<ValidationResult> {
    // Use the validation service to validate the record
    const issues = this.validationService.validateRecord(record, index);
    
    // Apply transformations if configured
    if (this.config.transformations) {
      for (const [field, transformFn] of Object.entries(this.config.transformations)) {
        if (record[field] !== undefined) {
          try {
            record[field] = transformFn(record[field], record);
          } catch (error) {
            issues.push({
              record_index: index,
              field_name: field,
              error_type: 'transformation_error',
              error_message: `Failed to transform field: ${error instanceof Error ? error.message : 'Unknown error'}`,
              raw_value: typeof record[field] === 'string' ? record[field] : JSON.stringify(record[field])
            });
          }
        }
      }
    }
    
    // Check for duplicates using configured deduplication keys
    const deduplicationKeys = this.config.deduplicationKeys || ['email'];
    
    for (const key of deduplicationKeys) {
      const value = record[key];
      if (value) {
        const duplicateKey = String(value).toLowerCase();
        if (this.duplicateKeys.has(duplicateKey)) {
          issues.push({
            record_index: index,
            field_name: key,
            error_type: 'duplicate',
            error_message: `Duplicate ${key} found: ${value}`,
            raw_value: value,
            suggestion: `Consider removing or updating this record as it's a duplicate`
          });
          break; // Only report one duplicate issue per record
        } else {
          this.duplicateKeys.add(duplicateKey);
        }
      }
    }

    // Log validation issues if any
    if (issues.length > 0) {
      await this.logValidationIssues(index, issues);
    }

    return {
      isValid: issues.length === 0,
      errors: issues
    };
  }

  private async logValidationIssues(recordIndex: number, issues: ValidationIssue[]) {
    const validationIssues = issues.map(error => ({
      job_id: this.jobId,
      record_index: recordIndex,
      field_name: error.field_name,
      error_type: error.error_type,
      error_message: error.error_message,
      raw_value: error.raw_value,
      suggestion: error.suggestion
    }));

    try {
      await supabase
        .from('validation_issues')
        .insert(validationIssues);
    } catch (error) {
      console.error("Failed to log validation issues:", error);
      // Continue processing even if logging validation issues fails
    }
  }

  async processRecords(records: any[]) {
    try {
      const job = await this.initializeJob();
      let validCount = 0;
      let errorCount = 0;

      // Update job with total records
      await supabase
        .from('data_loading_jobs')
        .update({ 
          total_records: records.length,
          status: 'processing' 
        })
        .eq('id', this.jobId);

      // Process each record
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const validation = await this.validateRecord(record, i);

        if (validation.isValid) {
          validCount++;
        } else {
          errorCount++;
        }

        // Update progress periodically
        if (i % 100 === 0 || i === records.length - 1) {
          await supabase
            .from('data_loading_jobs')
            .update({
              processed_records: i + 1,
              validated_records: validCount,
              error_count: errorCount,
              duplicate_records: this.duplicateKeys.size
            })
            .eq('id', this.jobId);
        }
      }

      // Update final job status
      await supabase
        .from('data_loading_jobs')
        .update({
          status: errorCount === 0 ? 'completed' : 'completed_with_errors',
          processed_records: records.length,
          validated_records: validCount,
          error_count: errorCount,
          duplicate_records: this.duplicateKeys.size
        })
        .eq('id', this.jobId);

      // Show completion message
      toast.success(
        `Data loading completed: ${validCount} valid records, ${errorCount} errors, ${this.duplicateKeys.size} duplicates`
      );

      return {
        jobId: this.jobId,
        validCount,
        errorCount,
        duplicateCount: this.duplicateKeys.size
      };
    } catch (error: any) {
      console.error('Error processing records:', error);
      toast.error('Error processing records: ' + error.message);

      // Update job status to failed
      await supabase
        .from('data_loading_jobs')
        .update({
          status: 'failed',
          metadata: { error: error.message }
        })
        .eq('id', this.jobId);

      throw error;
    }
  }

  async getValidationIssues(jobId?: string) {
    try {
      const targetJobId = jobId || this.jobId;
      
      if (!targetJobId) {
        // If no job ID is provided and no job has been initialized, try to get the most recent job
        const { data: recentJob, error: recentJobError } = await supabase
          .from('data_loading_jobs')
          .select('id')
          .eq('source_type', this.sourceType)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (recentJobError || !recentJob) {
          return [];
        }
        
        this.jobId = recentJob.id;
      }
      
      const { data, error } = await supabase
        .from('validation_issues')
        .select('*')
        .eq('job_id', targetJobId || this.jobId)
        .order('record_index', { ascending: true });

      if (error) {
        handleServiceError(error, "Failed to fetch validation issues", true);
        return [];
      }

      return data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch validation issues", true);
      return [];
    }
  }

  async getDataQualityMetrics(jobId?: string) {
    try {
      const targetJobId = jobId || this.jobId;
      
      if (!targetJobId) {
        return {
          completeness: 0,
          accuracy: 0, 
          uniqueness: 0,
          consistency: 0,
          overall: 0
        };
      }
      
      const { data: job, error: jobError } = await supabase
        .from('data_loading_jobs')
        .select('*')
        .eq('id', targetJobId)
        .single();
        
      if (jobError || !job) {
        return {
          completeness: 0,
          accuracy: 0, 
          uniqueness: 0,
          consistency: 0,
          overall: 0
        };
      }
      
      const totalRecords = job.total_records || 0;
      if (totalRecords === 0) {
        return {
          completeness: 0,
          accuracy: 0, 
          uniqueness: 0,
          consistency: 0,
          overall: 0
        };
      }
      
      const validRecords = job.validated_records || 0;
      const errorRecords = job.error_count || 0;
      const duplicateRecords = job.duplicate_records || 0;
      
      // Calculate metrics
      const accuracy = totalRecords > 0 ? (validRecords / totalRecords) * 100 : 0;
      const uniqueness = totalRecords > 0 ? ((totalRecords - duplicateRecords) / totalRecords) * 100 : 0;
      
      // For simplicity, we're using the accuracy as completeness since we don't have specific completeness data
      const completeness = accuracy;
      
      // Consistency is a measure of how well the data adheres to patterns
      // Without specific consistency checks, we'll estimate it based on validation success
      const consistency = totalRecords > 0 ? ((totalRecords - errorRecords) / totalRecords) * 100 : 0;
      
      // Overall score is an average of the other metrics
      const overall = (completeness + accuracy + uniqueness + consistency) / 4;
      
      return {
        completeness: Math.round(completeness * 10) / 10,
        accuracy: Math.round(accuracy * 10) / 10,
        uniqueness: Math.round(uniqueness * 10) / 10,
        consistency: Math.round(consistency * 10) / 10,
        overall: Math.round(overall * 10) / 10
      };
    } catch (error) {
      handleServiceError(error, "Failed to calculate data quality metrics", true);
      return {
        completeness: 0,
        accuracy: 0, 
        uniqueness: 0,
        consistency: 0,
        overall: 0
      };
    }
  }
}
