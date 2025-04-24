
import { calculateStringSimilarity, areFieldsConceptuallySimilar } from "./utils/stringSimilarity";

// Define common field patterns across different CRM systems
export const fieldPatterns = {
  contact: {
    email: ['email', 'email_address', 'emailaddress', 'primary_email'],
    phone: ['phone', 'telephone', 'phone_number', 'phonenumber', 'mobile'],
    name: ['name', 'full_name', 'fullname', 'displayname'],
    firstName: ['first_name', 'firstname', 'given_name'],
    lastName: ['last_name', 'lastname', 'surname', 'family_name'],
    address: ['address', 'street_address', 'mailing_address'],
    company: ['company', 'organization', 'employer', 'business'],
    title: ['title', 'job_title', 'position', 'role']
  },
  account: {
    name: ['name', 'account_name', 'company_name', 'business_name'],
    industry: ['industry', 'sector', 'business_type'],
    website: ['website', 'web_address', 'url', 'site'],
    employees: ['employees', 'employee_count', 'staff_count', 'team_size'],
    revenue: ['revenue', 'annual_revenue', 'yearly_revenue', 'income']
  }
};

// Define common mappings with metadata
export const commonMappings: Record<string, { variations: string[], required: boolean }> = {
  "email": { variations: ['email', 'email_address', 'emailaddress'], required: true },
  "phone": { variations: ['phone', 'telephone', 'phone_number', 'phonenumber'], required: false },
  "firstName": { variations: ['first_name', 'firstname', 'given_name'], required: true },
  "lastName": { variations: ['last_name', 'lastname', 'surname'], required: true },
  "address": { variations: ['address', 'street_address', 'mailing_address'], required: false }
};

export { calculateStringSimilarity, areFieldsConceptuallySimilar };
