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
/**
 * Enhanced PII patterns with more comprehensive detection
 */
private enhancedPatterns: Record<string, { regex: RegExp; confidence: number }> = {
  email: { 
    regex: /\b[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\b/g,
    confidence: 95
  },
  phone: { 
    regex: /(?:\+?1[-.\s]?)?(?:\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}|(?:\+?[1-9]\d{0,3}[-.\s]?)?(?:\([0-9]{1,4}\)|[0-9]{1,4})[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}/g,
    confidence: 90
  },
  ssn: { 
    regex: /(?!000|666|9\d{2})\d{3}[-.\s]?(?!00)\d{2}[-.\s]?(?!0000)\d{4}|\d{9}/g,
    confidence: 98
  },
  credit_card: { 
    regex: /(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})/g,
    confidence: 95
  },
  ip_address: { 
    regex: /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g,
    confidence: 85
  },
  date_of_birth: { 
    regex: /(?:0?[1-9]|1[0-2])[-\/](?:0?[1-9]|[12][0-9]|3[01])[-\/](?:19|20)\d{2}|\b(?:19|20)\d{2}[-\/](?:0?[1-9]|1[0-2])[-\/](?:0?[1-9]|[12][0-9]|3[01])\b/g,
    confidence: 80
  },
  passport: {
    regex: /[A-Z]{1,2}[0-9]{6,9}/g,
    confidence: 75
  },
  license_plate: {
    regex: /[A-Z]{1,3}[-\s]?[0-9]{1,4}[-\s]?[A-Z]{0,3}/g,
    confidence: 70
  },
  bank_account: {
    regex: /\b[0-9]{8,17}\b/g,
    confidence: 65
  }
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
   * Enhanced pattern-based PII detection with confidence scoring
   */
  private detectByPatterns(value: string): PIIType[] {
    const results: PIIType[] = [];

    for (const [type, patternInfo] of Object.entries(this.enhancedPatterns)) {
      if (patternInfo.regex.test(value)) {
        // Additional validation for certain types
        let actualConfidence = patternInfo.confidence;
        
        if (type === 'credit_card') {
          // Luhn algorithm check for credit cards
          actualConfidence = this.validateCreditCard(value) ? patternInfo.confidence : 50;
        } else if (type === 'bank_account' && value.length < 10) {
          // Bank accounts should be longer
          actualConfidence = 40;
        }

        results.push({
          type: type as PIIType['type'],
          confidence: actualConfidence,
          pattern: patternInfo.regex.source
        });
      }
    }

    return results;
  }

  /**
   * Validate credit card using Luhn algorithm
   */
  private validateCreditCard(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0 && digits.length >= 13;
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