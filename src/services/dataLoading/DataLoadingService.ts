
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    type: string;
    message: string;
    value?: any;
    suggestion?: string;
  }[];
}

export class DataLoadingService {
  private jobId: string;
  private sourceType: string;
  private duplicateKeys: Set<string>;

  constructor(sourceType: string) {
    this.sourceType = sourceType;
    this.duplicateKeys = new Set();
  }

  async initializeJob() {
    const { data, error } = await supabase
      .from('data_loading_jobs')
      .insert({
        source_type: this.sourceType,
        status: 'initializing'
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
    const errors = [];

    // Validate required fields are present
    for (const field of ['name', 'email']) {
      if (!record[field]) {
        errors.push({
          field,
          type: 'required_field',
          message: `${field} is required`,
          value: record[field]
        });
      }
    }

    // Validate email format
    if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
      errors.push({
        field: 'email',
        type: 'invalid_format',
        message: 'Invalid email format',
        value: record.email
      });
    }

    // Check for duplicates using a composite key (e.g., email)
    const duplicateKey = record.email?.toLowerCase();
    if (duplicateKey && this.duplicateKeys.has(duplicateKey)) {
      errors.push({
        field: 'email',
        type: 'duplicate',
        message: 'Duplicate email address found',
        value: record.email
      });
    } else if (duplicateKey) {
      this.duplicateKeys.add(duplicateKey);
    }

    // Log validation issues if any
    if (errors.length > 0) {
      await this.logValidationIssues(index, errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private async logValidationIssues(recordIndex: number, errors: any[]) {
    const validationIssues = errors.map(error => ({
      job_id: this.jobId,
      record_index: recordIndex,
      field_name: error.field,
      error_type: error.type,
      error_message: error.message,
      raw_value: error.value,
      suggestion: error.suggestion
    }));

    await supabase
      .from('validation_issues')
      .insert(validationIssues);
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

  async getValidationIssues() {
    const { data, error } = await supabase
      .from('validation_issues')
      .select('*')
      .eq('job_id', this.jobId)
      .order('record_index', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch validation issues: ${error.message}`);
    }

    return data;
  }
}
