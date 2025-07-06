import nlp from 'compromise';
import { sendMessageToGemini } from '@/services/gemini/geminiService';
import { ExtractedData, ExtractedField } from '@/services/migration/extractionService';

export interface PIIDetectionResult {
  fieldName: string;
  value: any;
  piiTypes: PIIType[];
  confidence: number;
  suggestion: string;
  shouldMask: boolean;
  maskedValue?: string;
}

export interface PIIType {
  type: 'email' | 'phone' | 'ssn' | 'credit_card' | 'name' | 'address' | 'date_of_birth' | 'ip_address' | 'custom';
  confidence: number;
  pattern?: string;
}

/**
 * Advanced PII detection service using NLP and AI
 */
export class PIIDetectionService {
  private patterns: Record<string, RegExp> = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
    ssn: /\b(?:\d{3}[-.\s]?\d{2}[-.\s]?\d{4}|\d{9})\b/g,
    credit_card: /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g,
    ip_address: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
    date_of_birth: /\b(?:0?[1-9]|1[0-2])[-\/](?:0?[1-9]|[12][0-9]|3[01])[-\/](?:19|20)\d{2}\b/g
  };

  /**
   * Detect PII in extracted data
   */
  async detectPII(records: ExtractedData[]): Promise<PIIDetectionResult[]> {
    const results: PIIDetectionResult[] = [];

    for (const record of records) {
      for (const field of record.fields) {
        const piiResult = await this.analyzeField(field);
        if (piiResult.piiTypes.length > 0) {
          results.push(piiResult);
        }
      }
    }

    return results;
  }

  /**
   * Analyze a single field for PII
   */
  private async analyzeField(field: ExtractedField): Promise<PIIDetectionResult> {
    const value = String(field.value || '');
    const piiTypes: PIIType[] = [];

    // Pattern-based detection
    const patternResults = this.detectByPatterns(value);
    piiTypes.push(...patternResults);

    // NLP-based detection
    const nlpResults = this.detectByNLP(field.name, value);
    piiTypes.push(...nlpResults);

    // AI-enhanced detection for complex cases
    if (piiTypes.length === 0 && this.mightContainPII(field.name, value)) {
      const aiResults = await this.detectByAI(field.name, value);
      piiTypes.push(...aiResults);
    }

    // Calculate overall confidence and determine if should mask
    const maxConfidence = piiTypes.length > 0 ? Math.max(...piiTypes.map(p => p.confidence)) : 0;
    const shouldMask = maxConfidence >= 80;

    return {
      fieldName: field.name,
      value: field.value,
      piiTypes,
      confidence: maxConfidence,
      suggestion: this.generateSuggestion(field.name, piiTypes),
      shouldMask,
      maskedValue: shouldMask ? this.maskValue(value, piiTypes) : undefined
    };
  }

  /**
   * Pattern-based PII detection
   */
  private detectByPatterns(value: string): PIIType[] {
    const results: PIIType[] = [];

    for (const [type, pattern] of Object.entries(this.patterns)) {
      if (pattern.test(value)) {
        results.push({
          type: type as PIIType['type'],
          confidence: 95,
          pattern: pattern.source
        });
      }
    }

    return results;
  }

  /**
   * NLP-based PII detection using compromise
   */
  private detectByNLP(fieldName: string, value: string): PIIType[] {
    const results: PIIType[] = [];
    const doc = nlp(value);

    // Detect names
    const people = doc.people().out('array');
    if (people.length > 0) {
      results.push({
        type: 'name',
        confidence: 85
      });
    }

    // Detect places (potential addresses)
    const places = doc.places().out('array');
    if (places.length > 0) {
      results.push({
        type: 'address',
        confidence: 75
      });
    }

    // Field name analysis
    const lowerFieldName = fieldName.toLowerCase();
    if (lowerFieldName.includes('email')) {
      results.push({ type: 'email', confidence: 90 });
    } else if (lowerFieldName.includes('phone') || lowerFieldName.includes('tel')) {
      results.push({ type: 'phone', confidence: 90 });
    } else if (lowerFieldName.includes('ssn') || lowerFieldName.includes('social')) {
      results.push({ type: 'ssn', confidence: 95 });
    } else if (lowerFieldName.includes('birth') || lowerFieldName.includes('dob')) {
      results.push({ type: 'date_of_birth', confidence: 90 });
    } else if (lowerFieldName.includes('address') || lowerFieldName.includes('street')) {
      results.push({ type: 'address', confidence: 85 });
    }

    return results;
  }

  /**
   * AI-enhanced PII detection using Gemini
   */
  private async detectByAI(fieldName: string, value: string): Promise<PIIType[]> {
    try {
      const prompt = `Analyze this data field for personally identifiable information (PII):

Field Name: ${fieldName}
Field Value: ${value}

Determine if this contains PII and respond with JSON:
{
  "containsPII": boolean,
  "piiType": "email|phone|ssn|credit_card|name|address|date_of_birth|ip_address|custom",
  "confidence": number (0-100),
  "reasoning": "explanation"
}

Only consider it PII if you're confident. Be conservative.`;

      const response = await sendMessageToGemini([
        { role: 'user', content: prompt }
      ]);

      if (response.response) {
        try {
          const analysis = JSON.parse(response.response);
          if (analysis.containsPII && analysis.confidence >= 70) {
            return [{
              type: analysis.piiType,
              confidence: analysis.confidence
            }];
          }
        } catch (parseError) {
          console.warn('Failed to parse AI PII analysis:', parseError);
        }
      }
    } catch (error) {
      console.warn('AI PII detection failed:', error);
    }

    return [];
  }

  /**
   * Check if field might contain PII based on name and value characteristics
   */
  private mightContainPII(fieldName: string, value: string): boolean {
    const sensitiveKeywords = [
      'personal', 'private', 'confidential', 'sensitive',
      'user', 'customer', 'client', 'contact', 'person'
    ];

    const fieldLower = fieldName.toLowerCase();
    const hasSensitiveKeyword = sensitiveKeywords.some(keyword => 
      fieldLower.includes(keyword)
    );

    const hasPersonalData = value.length > 5 && (
      /[A-Za-z]/.test(value) && // Contains letters
      (/\d/.test(value) || /[@.-]/.test(value)) // Contains numbers or special chars
    );

    return hasSensitiveKeyword || hasPersonalData;
  }

  /**
   * Generate suggestion for handling PII
   */
  private generateSuggestion(fieldName: string, piiTypes: PIIType[]): string {
    if (piiTypes.length === 0) {
      return 'No PII detected';
    }

    const primaryType = piiTypes.reduce((prev, current) => 
      prev.confidence > current.confidence ? prev : current
    );

    switch (primaryType.type) {
      case 'email':
        return 'Consider masking email addresses or using hashed identifiers';
      case 'phone':
        return 'Phone numbers should be masked or encrypted';
      case 'ssn':
        return 'SSN detected - must be encrypted or removed for compliance';
      case 'credit_card':
        return 'Credit card number detected - immediate masking required';
      case 'name':
        return 'Personal name detected - consider pseudonymization';
      case 'address':
        return 'Address information - consider geographic aggregation';
      case 'date_of_birth':
        return 'Birth date detected - consider age ranges instead';
      default:
        return `Potential PII detected (${primaryType.type}) - review for compliance`;
    }
  }

  /**
   * Mask PII values appropriately
   */
  private maskValue(value: string, piiTypes: PIIType[]): string {
    const primaryType = piiTypes.reduce((prev, current) => 
      prev.confidence > current.confidence ? prev : current
    );

    switch (primaryType.type) {
      case 'email':
        return this.maskEmail(value);
      case 'phone':
        return this.maskPhone(value);
      case 'ssn':
        return 'XXX-XX-XXXX';
      case 'credit_card':
        return '**** **** **** ' + value.slice(-4);
      case 'name':
        return this.maskName(value);
      default:
        return '***MASKED***';
    }
  }

  private maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1);
    return `${maskedUsername}@${domain}`;
  }

  private maskPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    return digits.slice(0, 3) + '***' + digits.slice(-4);
  }

  private maskName(name: string): string {
    const parts = name.split(' ');
    return parts.map(part => 
      part.charAt(0) + '*'.repeat(Math.max(0, part.length - 1))
    ).join(' ');
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(results: PIIDetectionResult[]): Promise<{
    summary: {
      totalFields: number;
      piiFields: number;
      highRiskFields: number;
      maskedFields: number;
    };
    recommendations: string[];
    details: PIIDetectionResult[];
  }> {
    const piiFields = results.filter(r => r.piiTypes.length > 0);
    const highRiskFields = piiFields.filter(r => r.confidence >= 90);
    const maskedFields = piiFields.filter(r => r.shouldMask);

    const recommendations = [
      ...new Set(piiFields.map(r => r.suggestion))
    ];

    if (highRiskFields.length > 0) {
      recommendations.unshift('Immediate attention required for high-risk PII fields');
    }

    return {
      summary: {
        totalFields: results.length,
        piiFields: piiFields.length,
        highRiskFields: highRiskFields.length,
        maskedFields: maskedFields.length
      },
      recommendations,
      details: piiFields
    };
  }
}

export const piiDetectionService = new PIIDetectionService();