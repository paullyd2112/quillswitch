
import React from "react";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "../CodeBlock";

const WebhooksTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Webhooks</h2>
        <p className="text-muted-foreground mb-4">
          Use webhooks to receive real-time notifications about events in your migrations.
        </p>
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Register Webhook</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>POST</Badge>
          <span className="font-mono text-sm">/webhooks</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Register a new webhook to receive notifications.
        </p>
        <CodeBlock code={`// Request
POST https://api.crm-migration-service.com/v1/webhooks
{
  "url": "https://your-server.example.com/webhook",
  "events": ["migration.started", "migration.completed", "migration.failed"],
  "secret": "your_webhook_signing_secret"
}

// Response
{
  "success": true,
  "data": {
    "id": "wh_123456",
    "url": "https://your-server.example.com/webhook",
    "events": ["migration.started", "migration.completed", "migration.failed"],
    "createdAt": "2023-07-25T10:30:00Z"
  }
}`} />
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">List Webhooks</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>GET</Badge>
          <span className="font-mono text-sm">/webhooks</span>
        </div>
        <p className="text-muted-foreground mb-4">
          List all registered webhooks.
        </p>
        <CodeBlock code={`// Request
GET https://api.crm-migration-service.com/v1/webhooks

// Response
{
  "success": true,
  "data": [
    {
      "id": "wh_123456",
      "url": "https://your-server.example.com/webhook",
      "events": ["migration.started", "migration.completed", "migration.failed"],
      "createdAt": "2023-07-25T10:30:00Z"
    },
    {
      "id": "wh_789012",
      "url": "https://another-server.example.com/notifications",
      "events": ["error.occurred"],
      "createdAt": "2023-07-20T14:15:00Z"
    }
  ]
}`} />
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Delete Webhook</h3>
        <div className="mb-2 flex gap-2 items-center">
          <Badge>DELETE</Badge>
          <span className="font-mono text-sm">/webhooks/:id</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Delete a registered webhook.
        </p>
        <CodeBlock code={`// Request
DELETE https://api.crm-migration-service.com/v1/webhooks/wh_123456

// Response
{
  "success": true,
  "data": {
    "id": "wh_123456",
    "deleted": true
  }
}`} />
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Webhook Payload Example</h3>
        <p className="text-muted-foreground mb-4">
          This is what your server will receive when an event occurs.
        </p>
        <CodeBlock code={`{
  "event": "migration.completed",
  "timestamp": "2023-07-25T15:30:00Z",
  "data": {
    "migrationId": "mig_123456",
    "status": "completed",
    "stats": {
      "totalRecords": 150,
      "successfulRecords": 148,
      "failedRecords": 2
    },
    "completedAt": "2023-07-25T15:30:00Z"
  }
}`} />
      </div>
    </div>
  );
};

export default WebhooksTab;
