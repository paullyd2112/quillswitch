
/**
 * Database of common field mappings with variations and metadata
 */

interface FieldMappingInfo {
  variations: string[];
  required: boolean;
  category: string;
}

/**
 * Enhanced common field name patterns with variations and categories
 */
export const commonMappings: Record<string, FieldMappingInfo> = {
  // Contact fields
  "email": { 
    variations: ["email", "email_address", "emailaddress", "contact_email", "primary_email", "work_email", "business_email", "personal_email", "e_mail", "mail"],
    required: true,
    category: "contact"
  },
  "name": { 
    variations: ["name", "full_name", "fullname", "contact_name", "complete_name", "display_name"],
    required: true,
    category: "contact"
  },
  "first_name": { 
    variations: ["first_name", "firstname", "given_name", "givenname", "forename", "first", "contact_firstname"],
    required: false,
    category: "contact"
  },
  "last_name": { 
    variations: ["last_name", "lastname", "surname", "family_name", "familyname", "contact_lastname"],
    required: false,
    category: "contact"
  },
  "phone": { 
    variations: ["phone", "phone_number", "phonenumber", "telephone", "mobile", "cell", "contact_phone", "work_phone", "business_phone", "mobile_phone", "primary_phone", "phone_work", "phone_mobile"],
    required: false,
    category: "contact"
  },
  "company": { 
    variations: ["company", "company_name", "companyname", "organization", "organisation", "business", "employer", "firm", "company_id"],
    required: false,
    category: "contact"
  },
  "title": { 
    variations: ["title", "job_title", "jobtitle", "position", "role", "job_role", "job_position", "designation", "job_function"],
    required: false,
    category: "contact"
  },
  
  // Account/Company mappings
  "account_name": { 
    variations: ["account_name", "accountname", "company_name", "companyname", "business_name", "organization_name", "org_name", "account", "account_id", "client_name"],
    required: true,
    category: "account"
  },
  "industry": { 
    variations: ["industry", "sector", "business_type", "company_industry", "account_industry", "business_sector", "industry_type", "market_segment"],
    required: false,
    category: "account"
  },
  "website": { 
    variations: ["website", "web_site", "site", "url", "web", "company_website", "web_address", "homepage", "domain", "web_url"],
    required: false,
    category: "account"
  },
  "employees": { 
    variations: ["employees", "employee_count", "num_employees", "number_of_employees", "company_size", "company_employees", "staff_count", "headcount", "size", "total_employees"],
    required: false,
    category: "account"
  },
  "revenue": { 
    variations: ["revenue", "annual_revenue", "yearly_revenue", "company_revenue", "account_revenue", "total_revenue", "turnover", "sales_revenue", "income"],
    required: false,
    category: "account"
  },
  
  // Address fields
  "address": { 
    variations: ["address", "street_address", "streetaddress", "mailing_address", "primary_address", "billing_address", "shipping_address", "street", "address_line_1", "address1"],
    required: false,
    category: "address"
  },
  "city": { 
    variations: ["city", "town", "municipality", "locality", "city_name", "billing_city", "shipping_city", "address_city"],
    required: false,
    category: "address"
  },
  "state": { 
    variations: ["state", "province", "region", "county", "territory", "billing_state", "shipping_state", "address_state", "state_province"],
    required: false,
    category: "address"
  },
  "postal_code": { 
    variations: ["postal_code", "postalcode", "zip", "zip_code", "zipcode", "billing_zip", "shipping_zip", "address_zip", "pincode", "postcode"],
    required: false,
    category: "address"
  },
  "country": { 
    variations: ["country", "nation", "billing_country", "shipping_country", "address_country", "country_code", "country_name"],
    required: false,
    category: "address"
  },
  
  // Opportunity/Deal fields
  "amount": { 
    variations: ["amount", "deal_amount", "opportunity_amount", "value", "deal_value", "opportunity_value", "price", "contract_value", "total_amount"],
    required: false,
    category: "opportunity"
  },
  "stage": { 
    variations: ["stage", "deal_stage", "opportunity_stage", "sales_stage", "pipeline_stage", "status", "deal_status", "phase", "step"],
    required: false,
    category: "opportunity"
  },
  "close_date": { 
    variations: ["close_date", "closedate", "expected_close_date", "close", "closing_date", "completion_date", "end_date", "finish_date", "deal_close_date"],
    required: false,
    category: "opportunity"
  },
  "probability": { 
    variations: ["probability", "win_probability", "likelihood", "confidence", "chance", "win_rate", "success_probability", "forecast", "win_likelihood"],
    required: false,
    category: "opportunity"
  },
  
  // Additional common fields
  "description": {
    variations: ["description", "notes", "details", "comments", "info", "summary", "overview", "about", "remarks", "text"],
    required: false,
    category: "general"
  },
  "owner": {
    variations: ["owner", "owner_id", "owner_name", "assigned_to", "assignee", "responsible", "sales_rep", "rep", "agent", "account_manager"],
    required: false,
    category: "general"
  },
  "date_created": {
    variations: ["date_created", "created_date", "creation_date", "date_added", "created_on", "created_at", "create_date", "entry_date"],
    required: false,
    category: "general"
  },
  "date_modified": {
    variations: ["date_modified", "modified_date", "last_modified", "updated_date", "updated_on", "updated_at", "last_update", "edit_date"],
    required: false,
    category: "general"
  }
};
