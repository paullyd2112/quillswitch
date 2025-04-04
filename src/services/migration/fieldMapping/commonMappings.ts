
import { calculateStringSimilarity, areFieldsConceptuallySimilar } from "./utils/stringSimilarity";

// Define common field patterns across different CRM systems
export const fieldPatterns = {
  contact: {
    email: ['email', 'email_address', 'emailaddress', 'email_primary', 'primary_email'],
    phone: ['phone', 'telephone', 'phone_number', 'phonenumber', 'mobile', 'cell'],
    name: ['name', 'full_name', 'fullname', 'displayname'],
    firstName: ['first_name', 'firstname', 'given_name', 'givenname'],
    lastName: ['last_name', 'lastname', 'surname', 'family_name'],
    address: ['address', 'street_address', 'mailing_address'],
    company: ['company', 'organization', 'employer', 'business'],
    title: ['title', 'job_title', 'position', 'role']
  },
  account: {
    name: ['name', 'account_name', 'company_name', 'business_name'],
    industry: ['industry', 'sector', 'business_type', 'field'],
    website: ['website', 'web_address', 'url', 'site'],
    employees: ['employees', 'employee_count', 'staff_count', 'team_size', 'company_size'],
    revenue: ['revenue', 'annual_revenue', 'yearly_revenue', 'income']
  },
  opportunity: {
    name: ['name', 'opportunity_name', 'deal_name'],
    amount: ['amount', 'deal_amount', 'value', 'opportunity_value', 'deal_value'],
    stage: ['stage', 'sales_stage', 'opportunity_stage', 'deal_stage'],
    closeDate: ['close_date', 'expected_close', 'closing_date', 'expected_close_date']
  }
};

// Define common mappings with metadata for better suggestions
export const commonMappings: Record<string, { variations: string[], required: boolean }> = {
  // Contact fields
  "email": { variations: ['email', 'email_address', 'emailaddress', 'primary_email'], required: true },
  "phone": { variations: ['phone', 'telephone', 'phone_number', 'phonenumber', 'mobile'], required: false },
  "firstName": { variations: ['first_name', 'firstname', 'given_name'], required: true },
  "lastName": { variations: ['last_name', 'lastname', 'surname', 'family_name'], required: true },
  "address": { variations: ['address', 'street_address', 'mailing_address'], required: false },
  
  // Account fields
  "accountName": { variations: ['name', 'account_name', 'company_name', 'business_name'], required: true },
  "industry": { variations: ['industry', 'sector', 'business_type'], required: false },
  "website": { variations: ['website', 'web_address', 'url', 'site'], required: false },
  
  // Opportunity fields
  "opportunityName": { variations: ['name', 'opportunity_name', 'deal_name'], required: true },
  "amount": { variations: ['amount', 'deal_amount', 'value', 'opportunity_value'], required: false },
  "stage": { variations: ['stage', 'sales_stage', 'opportunity_stage', 'deal_stage'], required: true }
};

export { calculateStringSimilarity, areFieldsConceptuallySimilar };
