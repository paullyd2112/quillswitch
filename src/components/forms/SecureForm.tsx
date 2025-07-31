import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSecurity } from '@/components/security/SecurityProvider';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';
import { securityLog } from '@/utils/logging/consoleReplacer';

interface SecureFormProps {
  onSubmit: (data: Record<string, any>) => Promise<void>;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    validationType: string;
    required?: boolean;
  }>;
  submitLabel?: string;
  formType?: string;
}

/**
 * Secure form component with built-in validation, sanitization, and rate limiting
 */
export function SecureForm({ 
  onSubmit, 
  fields, 
  submitLabel = "Submit", 
  formType = "general" 
}: SecureFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { 
    checkFormRateLimit, 
    validateSecureInput, 
    sanitizeContent 
  } = useSecurity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Check rate limit
      if (!checkFormRateLimit(user.id, formType)) {
        return;
      }

      // Validate and sanitize all fields
      const validatedData: Record<string, any> = {};
      
      for (const field of fields) {
        const value = formData[field.name];
        
        if (field.required && (!value || value.toString().trim() === '')) {
          throw new Error(`${field.label} is required`);
        }
        
        if (value) {
          // Validate input
          const validatedValue = validateSecureInput(
            value, 
            field.validationType, 
            field.label
          );
          
          // Sanitize if it's text content
          validatedData[field.name] = field.type === 'text' || field.type === 'textarea' 
            ? sanitizeContent(validatedValue)
            : validatedValue;
        }
      }

      await onSubmit(validatedData);
      
      // Reset form on success
      setFormData({});
      
    } catch (error) {
      securityLog.error('Form submission error', error instanceof Error ? error : undefined, { 
        formType, 
        userId: user?.id,
        fieldCount: fields.length 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              disabled={isSubmitting}
            />
          ) : (
            <Input
              id={field.name}
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              disabled={isSubmitting}
            />
          )}
        </div>
      ))}
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? 'Processing...' : submitLabel}
      </Button>
    </form>
  );
}