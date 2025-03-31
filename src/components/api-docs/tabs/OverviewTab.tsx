import React from "react";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "../CodeBlock";

const OverviewTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">API Overview</h2>
        <p className="text-muted-foreground mb-4">
          Our CRM Migration API allows you to programmatically migrate data between different CRM platforms. The API follows REST principles and returns responses in JSON format.
        </p>
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Base URL</h3>
        <CodeBlock code="https://api.crm-migration-service.com/v1" />
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Available Endpoints</h3>
        <ul className="space-y-2">
          <li className="flex gap-2">
            <Badge>GET</Badge>
            <span className="font-mono text-sm">/sources</span>
            <span className="text-muted-foreground">List available source CRMs</span>
          </li>
          <li className="flex gap-2">
            <Badge>GET</Badge>
            <span className="font-mono text-sm">/destinations</span>
            <span className="text-muted-foreground">List available destination CRMs</span>
          </li>
          <li className="flex gap-2">
            <Badge>POST</Badge>
            <span className="font-mono text-sm">/migrations</span>
            <span className="text-muted-foreground">Create a new migration</span>
          </li>
          <li className="flex gap-2">
            <Badge>GET</Badge>
            <span className="font-mono text-sm">/migrations/:id</span>
            <span className="text-muted-foreground">Get migration status</span>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Response Format</h3>
        <CodeBlock code={`{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}`} />
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-3">Error Handling</h3>
        <CodeBlock code={`{
  "success": false,
  "error": {
    "code": "invalid_auth",
    "message": "Invalid authentication credentials",
    "details": { ... }
  }
}`} />
      </div>
    </div>
  );
};

export default OverviewTab;
