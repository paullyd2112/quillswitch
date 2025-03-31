
import React from "react";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "../CodeBlock";

const ContactsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Contacts API</h2>
        <p className="text-muted-foreground mb-4">
          The Contacts API allows you to manage and migrate contact data between CRM systems.
        </p>
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">List Contacts</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>GET</Badge>
          <span className="font-mono text-sm">/contacts</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Retrieve a list of contacts from the source CRM.
        </p>
        <CodeBlock code={`// Request
GET https://api.crm-migration-service.com/v1/contacts?source=salesforce&page=1&limit=20

// Response
{
  "success": true,
  "data": [
    {
      "id": "con_123456",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "company": "Acme Inc.",
      "title": "CEO",
      "createdAt": "2023-01-15T10:30:00Z",
      "updatedAt": "2023-06-22T15:45:00Z"
    },
    ...
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142
  }
}`} />
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Migrate Contacts</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>POST</Badge>
          <span className="font-mono text-sm">/contacts/migrate</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Migrate contacts from the source CRM to the destination CRM.
        </p>
        <CodeBlock code={`// Request
POST https://api.crm-migration-service.com/v1/contacts/migrate
{
  "source": "salesforce",
  "destination": "hubspot",
  "filters": {
    "updatedAfter": "2023-01-01T00:00:00Z",
    "tags": ["vip", "customer"]
  },
  "fieldMapping": {
    "firstName": "firstName",
    "lastName": "lastName",
    "email": "email",
    "companyName": "company"
  }
}

// Response
{
  "success": true,
  "data": {
    "migrationId": "mig_789012",
    "status": "in_progress",
    "totalRecords": 215,
    "estimatedTimeMinutes": 5
  }
}`} />
      </div>
    </div>
  );
};

export default ContactsTab;
