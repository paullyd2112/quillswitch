
import React from "react";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "../CodeBlock";

const OpportunitiesTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Opportunities API</h2>
        <p className="text-muted-foreground mb-4">
          The Opportunities API allows you to manage and migrate deal/opportunity data between CRM systems.
        </p>
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">List Opportunities</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>GET</Badge>
          <span className="font-mono text-sm">/opportunities</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Retrieve a list of opportunities/deals from the source CRM.
        </p>
        <CodeBlock code={`// Example Request
GET /opportunities?source=salesforce&page=1&limit=20

// Example Response
{
  "success": true,
  "data": [
    {
      "id": "opp_123456",
      "name": "Enterprise License Deal",
      "accountId": "acc_123456",
      "stage": "Negotiation",
      "amount": 75000,
      "probability": 80,
      "expectedCloseDate": "2023-08-30",
      "createdAt": "2023-04-15T11:20:00Z",
      "updatedAt": "2023-06-22T13:45:00Z"
    },
    ...
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 58
  }
}`} />
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Migrate Opportunities</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>POST</Badge>
          <span className="font-mono text-sm">/opportunities/migrate</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Migrate opportunities/deals from the source CRM to the destination CRM.
        </p>
        <CodeBlock code={`// Example Request
POST /opportunities/migrate
{
  "source": "salesforce",
  "destination": "hubspot",
  "filters": {
    "updatedAfter": "2023-01-01T00:00:00Z",
    "stages": ["Proposal", "Negotiation", "Closing"],
    "minimumAmount": 10000
  },
  "fieldMapping": {
    "name": "dealname",
    "accountId": "company_id",
    "amount": "amount",
    "stage": "dealstage",
    "expectedCloseDate": "closedate"
  },
  "stageMapping": {
    "Proposal": "presentationscheduled",
    "Negotiation": "contractsent",
    "Closing": "closedwon"
  }
}

// Example Response
{
  "success": true,
  "data": {
    "migrationId": "mig_345678",
    "status": "in_progress",
    "totalRecords": 35,
    "estimatedTimeMinutes": 4
  }
}`} />
      </div>
    </div>
  );
};

export default OpportunitiesTab;
