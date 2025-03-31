
import React from "react";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "../CodeBlock";

const AccountsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Accounts API</h2>
        <p className="text-muted-foreground mb-4">
          The Accounts API allows you to manage and migrate company/account data between CRM systems.
        </p>
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">List Accounts</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>GET</Badge>
          <span className="font-mono text-sm">/accounts</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Retrieve a list of accounts/companies from the source CRM.
        </p>
        <CodeBlock code={`// Request
GET https://api.crm-migration-service.com/v1/accounts?source=salesforce&page=1&limit=20

// Response
{
  "success": true,
  "data": [
    {
      "id": "acc_123456",
      "name": "Acme Inc.",
      "industry": "Technology",
      "website": "https://acme.example.com",
      "annualRevenue": 1500000,
      "employeeCount": 250,
      "createdAt": "2022-03-10T14:20:00Z",
      "updatedAt": "2023-05-12T09:15:00Z"
    },
    ...
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 87
  }
}`} />
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Migrate Accounts</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>POST</Badge>
          <span className="font-mono text-sm">/accounts/migrate</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Migrate accounts/companies from the source CRM to the destination CRM.
        </p>
        <CodeBlock code={`// Request
POST https://api.crm-migration-service.com/v1/accounts/migrate
{
  "source": "salesforce",
  "destination": "hubspot",
  "filters": {
    "updatedAfter": "2023-01-01T00:00:00Z",
    "industries": ["Technology", "Healthcare"]
  },
  "fieldMapping": {
    "name": "name",
    "industry": "industry",
    "website": "website",
    "annualRevenue": "annual_revenue"
  }
}

// Response
{
  "success": true,
  "data": {
    "migrationId": "mig_456789",
    "status": "in_progress",
    "totalRecords": 42,
    "estimatedTimeMinutes": 3
  }
}`} />
      </div>
    </div>
  );
};

export default AccountsTab;
