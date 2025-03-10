
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Code, FileJson, Server, Key, Webhook, Play, Book } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { useState } from "react";

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  description: string;
  params?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  response?: string;
}

// Example API endpoints data
const apiEndpoints: Record<string, ApiEndpoint[]> = {
  flows: [
    {
      method: "GET",
      endpoint: "/api/flows",
      description: "Get all onboarding flows",
      response: `{
  "flows": [
    {
      "id": "flow-1",
      "title": "SaaS Product Onboarding",
      "description": "Welcome new users",
      "status": "active",
      "usagePercent": 78,
      "users": 1243,
      "lastUpdated": "2 days ago"
    },
    // More flows...
  ]
}`
    },
    {
      method: "POST",
      endpoint: "/api/flows",
      description: "Create a new onboarding flow",
      params: [
        {
          name: "title",
          type: "string",
          required: true,
          description: "Title of the flow"
        },
        {
          name: "description",
          type: "string",
          required: true,
          description: "Description of the flow"
        },
        {
          name: "status",
          type: "string",
          required: true,
          description: "Status of the flow (active, draft, archived)"
        }
      ],
      response: `{
  "id": "flow-123",
  "title": "New Flow",
  "description": "Description",
  "status": "draft",
  "usagePercent": 0,
  "users": 0,
  "lastUpdated": "just now"
}`
    },
    {
      method: "GET",
      endpoint: "/api/flows/:id",
      description: "Get a specific onboarding flow",
      response: `{
  "id": "flow-1",
  "title": "SaaS Product Onboarding",
  "description": "Welcome new users",
  "status": "active",
  "usagePercent": 78,
  "users": 1243,
  "lastUpdated": "2 days ago",
  "steps": [
    {
      "id": "step-1",
      "title": "Welcome",
      "content": "Welcome to our platform"
    },
    // More steps...
  ]
}`
    },
    {
      method: "PUT",
      endpoint: "/api/flows/:id",
      description: "Update an onboarding flow",
      params: [
        {
          name: "title",
          type: "string",
          required: false,
          description: "New title of the flow"
        },
        {
          name: "description",
          type: "string",
          required: false,
          description: "New description of the flow"
        },
        {
          name: "status",
          type: "string",
          required: false,
          description: "New status of the flow"
        }
      ],
      response: `{
  "id": "flow-1",
  "title": "Updated Title",
  "description": "Updated description",
  "status": "active",
  "usagePercent": 78,
  "users": 1243,
  "lastUpdated": "just now"
}`
    },
    {
      method: "DELETE",
      endpoint: "/api/flows/:id",
      description: "Delete an onboarding flow",
      response: `{
  "success": true,
  "message": "Flow deleted successfully"
}`
    }
  ],
  templates: [
    {
      method: "GET",
      endpoint: "/api/templates",
      description: "Get all onboarding templates",
      response: `{
  "templates": [
    {
      "id": "template-1",
      "title": "SaaS User Onboarding",
      "description": "A complete onboarding flow",
      "category": "User Onboarding",
      "isNew": true
    },
    // More templates...
  ]
}`
    },
    {
      method: "GET",
      endpoint: "/api/templates/:id",
      description: "Get a specific template",
      response: `{
  "id": "template-1",
  "title": "SaaS User Onboarding",
  "description": "A complete onboarding flow",
  "category": "User Onboarding",
  "isNew": true,
  "content": {
    // Template structure and content
  }
}`
    }
  ],
  analytics: [
    {
      method: "GET",
      endpoint: "/api/analytics/flows/:id",
      description: "Get analytics for a specific flow",
      response: `{
  "flowId": "flow-1",
  "usagePercent": 78,
  "users": 1243,
  "completionRate": 68.7,
  "avgCompletionTime": "5m 32s",
  "userFeedback": {
    "positive": 85,
    "neutral": 10,
    "negative": 5
  }
}`
    },
    {
      method: "GET",
      endpoint: "/api/analytics/overview",
      description: "Get overall platform analytics",
      response: `{
  "activeUsers": 2834,
  "completionRate": 68.7,
  "engagementScore": 7.9,
  "avgCompletionTime": "5m 32s",
  "totalFlows": 12,
  "activeFlows": 8
}`
    }
  ],
  webhooks: [
    {
      method: "POST",
      endpoint: "/api/webhooks",
      description: "Register a new webhook",
      params: [
        {
          name: "url",
          type: "string",
          required: true,
          description: "URL to send webhook events to"
        },
        {
          name: "events",
          type: "array",
          required: true,
          description: "Array of events to subscribe to"
        },
        {
          name: "secret",
          type: "string",
          required: true,
          description: "Secret for webhook verification"
        }
      ],
      response: `{
  "id": "webhook-123",
  "url": "https://example.com/webhook",
  "events": ["flow.completed", "flow.started"],
  "status": "active"
}`
    }
  ]
};

const ApiDocs = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderMethodBadge = (method: string) => {
    const methodColors: Record<string, string> = {
      GET: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
      POST: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400",
      PUT: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
      DELETE: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400",
    };

    return (
      <Badge className={methodColors[method]}>
        {method}
      </Badge>
    );
  };

  const renderEndpoint = (endpoint: ApiEndpoint, index: number) => {
    const uniqueId = `${endpoint.method}-${endpoint.endpoint}-${index}`;
    return (
      <GlassPanel key={uniqueId} className="mb-8 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {renderMethodBadge(endpoint.method)}
            <h3 className="text-lg font-mono">{endpoint.endpoint}</h3>
          </div>
        </div>

        <div className="p-5">
          <p className="text-muted-foreground mb-4">{endpoint.description}</p>
          
          {endpoint.params && endpoint.params.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Parameters</h4>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 mb-4">
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground">
                    <tr>
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Required</th>
                      <th className="pb-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.params.map((param, i) => (
                      <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                        <td className="py-2 font-mono">{param.name}</td>
                        <td className="py-2 font-mono">{param.type}</td>
                        <td className="py-2">{param.required ? "Yes" : "No"}</td>
                        <td className="py-2">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {endpoint.response && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Response</h4>
              <div className="relative">
                <pre className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 overflow-x-auto font-mono text-sm">
                  {endpoint.response}
                </pre>
                <button
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-white dark:bg-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => copyToClipboard(endpoint.response, uniqueId)}
                >
                  {copiedCode === uniqueId ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-muted-foreground" />}
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Example Request</h4>
            <div className="relative">
              <pre className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 overflow-x-auto font-mono text-sm">
                {`curl -X ${endpoint.method} \\
  "https://api.onboardify.com${endpoint.endpoint}" \\
  -H "Authorization: Bearer YOUR_API_KEY"${endpoint.method !== 'GET' && endpoint.params ? ` \\
  -H "Content-Type: application/json" \\
  -d '{
    ${endpoint.params.map(p => `"${p.name}": "${p.type === 'string' ? 'value' : p.type === 'array' ? '[]' : '0'}"${p.required ? ' // required' : ''}`).join(',\n    ')}
  }'` : ''}`}
              </pre>
              <button
                className="absolute top-2 right-2 p-1.5 rounded-md bg-white dark:bg-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => copyToClipboard(`curl -X ${endpoint.method} "https://api.onboardify.com${endpoint.endpoint}" -H "Authorization: Bearer YOUR_API_KEY"${endpoint.method !== 'GET' && endpoint.params ? ` -H "Content-Type: application/json" -d '{"${endpoint.params[0]?.name}":"value"}'` : ''}`, `${uniqueId}-curl`)}
              >
                {copiedCode === `${uniqueId}-curl` ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-muted-foreground" />}
              </button>
            </div>
          </div>
        </div>
      </GlassPanel>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50">
      <Navbar />
      
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
                Developer Resources
              </Badge>
            </FadeIn>
            <FadeIn delay="100">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                API Documentation
              </h1>
            </FadeIn>
            <FadeIn delay="200">
              <p className="text-xl text-muted-foreground mb-8">
                Integrate onboarding experiences directly into your SaaS platform with our comprehensive API.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
      
      <ContentSection className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <GlassPanel className="p-5">
                <h3 className="font-medium text-lg mb-4">Contents</h3>
                <nav className="space-y-1">
                  <a href="#getting-started" className="flex items-center py-2 px-3 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-brand-500 dark:text-brand-400">
                    <Book size={16} className="mr-2" />
                    Getting Started
                  </a>
                  <a href="#authentication" className="flex items-center py-2 px-3 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Key size={16} className="mr-2" />
                    Authentication
                  </a>
                  <a href="#flows" className="flex items-center py-2 px-3 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Play size={16} className="mr-2" />
                    Flows API
                  </a>
                  <a href="#templates" className="flex items-center py-2 px-3 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                    <FileJson size={16} className="mr-2" />
                    Templates API
                  </a>
                  <a href="#analytics" className="flex items-center py-2 px-3 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Server size={16} className="mr-2" />
                    Analytics API
                  </a>
                  <a href="#webhooks" className="flex items-center py-2 px-3 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Webhook size={16} className="mr-2" />
                    Webhooks
                  </a>
                </nav>
              </GlassPanel>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <section id="getting-started" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <GlassPanel className="p-5 mb-6">
                <p className="mb-4">
                  Our API allows you to programmatically manage all aspects of your onboarding flows, templates, and user interactions.
                  The API follows RESTful conventions and returns data in JSON format.
                </p>
                <p className="mb-4">
                  To start using the API, you'll need to:
                </p>
                <ol className="list-decimal ml-5 space-y-2 mb-4">
                  <li>Create an API key in your dashboard</li>
                  <li>Include the key in all API requests in the Authorization header</li>
                  <li>Make requests to our API endpoints</li>
                </ol>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md mb-4">
                  <p className="text-sm font-medium mb-2">Base URL</p>
                  <code className="font-mono text-sm">https://api.onboardify.com</code>
                </div>
              </GlassPanel>
            </section>
            
            <section id="authentication" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
              <GlassPanel className="p-5 mb-6">
                <p className="mb-4">
                  All API requests must include your API key in the HTTP header:
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md font-mono text-sm">
                  <p>Authorization: Bearer YOUR_API_KEY</p>
                </div>
                <div className="mt-4">
                  <p className="font-medium mb-2">Getting your API key</p>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>Go to your account settings</li>
                    <li>Navigate to the "API Keys" section</li>
                    <li>Click "Generate New Key"</li>
                    <li>Give your key a name and copy it immediately (it won't be shown again)</li>
                  </ol>
                </div>
              </GlassPanel>
            </section>
            
            <section id="flows" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Flows API</h2>
              <p className="text-muted-foreground mb-6">
                Create and manage onboarding flows programmatically.
              </p>
              {apiEndpoints.flows.map((endpoint, index) => renderEndpoint(endpoint, index))}
            </section>
            
            <section id="templates" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Templates API</h2>
              <p className="text-muted-foreground mb-6">
                Access pre-built templates to quickly create onboarding experiences.
              </p>
              {apiEndpoints.templates.map((endpoint, index) => renderEndpoint(endpoint, index))}
            </section>
            
            <section id="analytics" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Analytics API</h2>
              <p className="text-muted-foreground mb-6">
                Retrieve analytics data for your onboarding flows.
              </p>
              {apiEndpoints.analytics.map((endpoint, index) => renderEndpoint(endpoint, index))}
            </section>
            
            <section id="webhooks" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Webhooks</h2>
              <p className="text-muted-foreground mb-6">
                Set up webhooks to receive real-time notifications about events.
              </p>
              {apiEndpoints.webhooks.map((endpoint, index) => renderEndpoint(endpoint, index))}
              
              <GlassPanel className="p-5 mt-6">
                <h3 className="font-medium mb-3">Available Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                    <p className="font-medium mb-2">flow.started</p>
                    <p className="text-sm text-muted-foreground">Triggered when a user starts an onboarding flow</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                    <p className="font-medium mb-2">flow.completed</p>
                    <p className="text-sm text-muted-foreground">Triggered when a user completes an onboarding flow</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                    <p className="font-medium mb-2">flow.abandoned</p>
                    <p className="text-sm text-muted-foreground">Triggered when a user abandons an onboarding flow</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                    <p className="font-medium mb-2">step.completed</p>
                    <p className="text-sm text-muted-foreground">Triggered when a user completes a step in a flow</p>
                  </div>
                </div>
              </GlassPanel>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">SDKs & Libraries</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassPanel className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 p-2 rounded-md mr-3">
                      <Code size={24} />
                    </div>
                    <h3 className="font-medium">JavaScript SDK</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Integrate onboarding flows directly into your web applications
                  </p>
                  <Button variant="outline" className="w-full">View Documentation</Button>
                </GlassPanel>
                
                <GlassPanel className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-2 rounded-md mr-3">
                      <Code size={24} />
                    </div>
                    <h3 className="font-medium">React Components</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Drop-in React components for easy integration
                  </p>
                  <Button variant="outline" className="w-full">View Documentation</Button>
                </GlassPanel>
              </div>
            </section>
          </div>
        </div>
      </ContentSection>
    </div>
  );
};

export default ApiDocs;
