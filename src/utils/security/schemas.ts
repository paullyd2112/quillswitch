import { z } from 'zod';

// Common validation schemas
export const securitySchemas = {
  email: z.string().email().max(320), // RFC 5321 limit
  password: z.string().min(8).max(128),
  apiKey: z.string().min(10).max(500),
  companyName: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\s\-_.&]+$/),
  crmId: z.string().regex(/^[a-zA-Z0-9\-_]+$/),
  migrationStrategy: z.enum(['full', 'incremental', 'parallel']),
  dataTypes: z.array(z.string().regex(/^[a-zA-Z0-9\-_]+$/)),
  customMapping: z.string().max(5000),
  fieldName: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\-_\.]+$/),
  recordId: z.string().min(1).max(50).regex(/^[a-zA-Z0-9\-_]+$/),
  url: z.string().url().max(500),
  filename: z.string().min(1).max(255).regex(/^[a-zA-Z0-9\-_\.\s]+$/),
  jsonData: z.object({}).passthrough().refine((data) => {
    try {
      JSON.stringify(data);
      return true;
    } catch {
      return false;
    }
  }, 'Invalid JSON data')
};