
import React from "react";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "../CodeBlock";

const MigrationTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Migration API</h2>
        <p className="text-muted-foreground mb-4">
          The Migration API allows you to manage and monitor data migration processes.
        </p>
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Create Migration</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>POST</Badge>
          <span className="font-mono text-sm">/migrations</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Create a new migration job to transfer data between CRMs.
        </p>
        <CodeBlock code={`// Request
POST /migrations
{
  "name": "Full CRM Migration",
  "source": {
    "type": "salesforce",
    "credentials": {
      "accessToken": "YOUR_SF_ACCESS_TOKEN",
      "instanceUrl": "https://yourinstance.salesforce.com"
    }
  },
  "destination": {
    "type": "hubspot",
    "credentials": {
      "apiKey": "YOUR_HUBSPOT_API_KEY"
    }
  },
  "dataTypes": [
    {
      "type": "contacts",
      "filters": {
        "updatedAfter": "2023-01-01T00:00:00Z"
      },
      "fieldMapping": {
        "firstName": "firstName",
        "lastName": "lastName",
        "email": "email"
      }
    },
    {
      "type": "accounts",
      "fieldMapping": {
        "name": "name",
        "industry": "industry"
      }
    }
  ],
  "schedule": {
    "startNow": true
  }
}

// Response
{
  "success": true,
  "data": {
    "migrationId": "mig_123456",
    "status": "queued",
    "estimatedTimeMinutes": 15,
    "createdAt": "2023-07-25T14:30:00Z"
  }
}`} />
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Get Migration Status</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>GET</Badge>
          <span className="font-mono text-sm">/migrations/:id</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Check the status of an ongoing migration.
        </p>
        <CodeBlock code={`// Request
GET /migrations/mig_123456

// Response
{
  "success": true,
  "data": {
    "migrationId": "mig_123456",
    "status": "in_progress",
    "progress": {
      "percentage": 45,
      "stage": "Migrating Contacts",
      "completedItems": 67,
      "totalItems": 150
    },
    "startedAt": "2023-07-25T14:30:00Z",
    "estimatedCompletionAt": "2023-07-25T14:45:00Z"
  }
}`} />
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Cancel Migration</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>DELETE</Badge>
          <span className="font-mono text-sm">/migrations/:id</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Cancel an in-progress migration.
        </p>
        <CodeBlock code={`// Request
DELETE /migrations/mig_123456

// Response
{
  "success": true,
  "data": {
    "migrationId": "mig_123456",
    "status": "cancelled",
    "cancelledAt": "2023-07-25T14:40:00Z"
  }
}`} />
      </div>
    </div>
  );
};

export default MigrationTab;
