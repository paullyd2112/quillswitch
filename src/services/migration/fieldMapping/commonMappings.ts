
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

export { calculateStringSimilarity, areFieldsConceptuallySimilar };
