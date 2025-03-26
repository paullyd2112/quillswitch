
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Database, FileJson, Key } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ApiDocs = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
                API Documentation
              </Badge>
            </FadeIn>
            <FadeIn delay="100">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                CRM Migration API
              </h1>
            </FadeIn>
            <FadeIn delay="200">
              <p className="text-xl text-muted-foreground mb-8">
                Comprehensive documentation for our CRM migration REST API
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
      
      <ContentSection className="py-12 pb-32">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <GlassPanel className="sticky top-24">
              <div className="p-4">
                <h3 className="font-medium mb-4">API Navigation</h3>
                <ul className="space-y-1">
                  <li>
                    <Button
                      variant={activeTab === "overview" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeTab === "authentication" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("authentication")}
                    >
                      Authentication
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeTab === "contacts" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("contacts")}
                    >
                      Contacts API
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeTab === "accounts" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("accounts")}
                    >
                      Accounts API
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeTab === "opportunities" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("opportunities")}
                    >
                      Opportunities API
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeTab === "migration" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("migration")}
                    >
                      Migration API
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeTab === "webhooks" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("webhooks")}
                    >
                      Webhooks
                    </Button>
                  </li>
                </ul>
              </div>
            </GlassPanel>
          </div>
          
          <div className="md:col-span-9">
            <GlassPanel>
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="hidden">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="authentication">Authentication</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                  <TabsTrigger value="accounts">Accounts</TabsTrigger>
                  <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                  <TabsTrigger value="migration">Migration</TabsTrigger>
                  <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">API Overview</h2>
                      <p className="text-muted-foreground mb-4">
                        Our CRM Migration API allows you to programmatically migrate data between different CRM platforms. The API follows REST principles and returns responses in JSON format.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">Base URL</h3>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <code>https://api.crmmigration.example.com/v1</code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard("https://api.crmmigration.example.com/v1")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
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
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">Error Handling</h3>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`{
  "success": false,
  "error": {
    "code": "invalid_auth",
    "message": "Invalid authentication credentials",
    "details": { ... }
  }
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`{
  "success": false,
  "error": {
    "code": "invalid_auth",
    "message": "Invalid authentication credentials",
    "details": { ... }
  }
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="authentication" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
                      <p className="text-muted-foreground mb-4">
                        All API requests require authentication using an API key. You'll receive your API key when you create an account.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md">
                      <Key className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Keep Your API Key Secret</p>
                        <p className="text-sm">Your API key provides access to your account and should be kept confidential.</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">API Key Authentication</h3>
                      <p className="text-muted-foreground mb-4">
                        Include your API key in the <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Authorization</code> header of your requests.
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`Authorization: Bearer YOUR_API_KEY`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`Authorization: Bearer YOUR_API_KEY`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">Example Request</h3>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`curl --request GET \\
  --url https://api.crmmigration.example.com/v1/sources \\
  --header 'Authorization: Bearer YOUR_API_KEY'`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`curl --request GET \\
  --url https://api.crmmigration.example.com/v1/sources \\
  --header 'Authorization: Bearer YOUR_API_KEY'`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contacts" className="p-6">
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
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`// Request
GET /contacts?source=salesforce&page=1&limit=20

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
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`// Request
GET /contacts?source=salesforce&page=1&limit=20

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
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
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
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`// Request
POST /contacts/migrate
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
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`// Request
POST /contacts/migrate
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
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="accounts" className="p-6">
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
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`// Request
GET /accounts?source=salesforce&page=1&limit=20

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
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`// Request
GET /accounts?source=salesforce&page=1&limit=20

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
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
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
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`// Request
POST /accounts/migrate
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
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`// Request
POST /accounts/migrate
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
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="opportunities" className="p-6">
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
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`// Example Request
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
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`// Example Request
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
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
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
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`// Example Request
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
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`// Example Request
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
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="migration" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">Migration API</h2>
                      <p className="text-muted-foreground mb-4">
                        The Migration API allows you to create, manage, and monitor bulk migration jobs between CRM systems.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">Create Migration Job</h3>
                      <div className="mb-2 flex gap-2 items-center">
                        <Badge>POST</Badge>
                        <span className="font-mono text-sm">/migrations</span>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Create a new migration job to move data between CRM systems.
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`// Example Request
POST /migrations
{
  "name": "Q3 2023 Salesforce to HubSpot Migration",
  "source": {
    "type": "salesforce",
    "credentials": {
      "apiKey": "YOUR_SALESFORCE_API_KEY"
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
      "filters": {
        "industries": ["Technology", "Healthcare"]
      },
      "fieldMapping": {
        "name": "name",
        "industry": "industry",
        "website": "website"
      }
    },
    {
      "type": "opportunities",
      "filters": {
        "minimumAmount": 10000
      },
      "fieldMapping": {
        "name": "dealname",
        "amount": "amount",
        "stage": "dealstage"
      }
    }
  ],
  "schedule": {
    "startNow": true
  },
  "options": {
    "strategy": "full",
    "notifyOnCompletion": true,
    "skipDuplicates": true
  }
}

// Example Response
{
  "success": true,
  "data": {
    "migrationId": "mig_123456",
    "name": "Q3 2023 Salesforce to HubSpot Migration",
    "status": "scheduled",
    "createdAt": "2023-07-15T10:30:00Z",
    "estimatedCompletionTime": "2023-07-15T11:15:00Z"
  }
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`// Example Request
POST /migrations
{
  "name": "Q3 2023 Salesforce to HubSpot Migration",
  "source": {
    "type": "salesforce",
    "credentials": {
      "apiKey": "YOUR_SALESFORCE_API_KEY"
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
      "filters": {
        "industries": ["Technology", "Healthcare"]
      },
      "fieldMapping": {
        "name": "name",
        "industry": "industry",
        "website": "website"
      }
    },
    {
      "type": "opportunities",
      "filters": {
        "minimumAmount": 10000
      },
      "fieldMapping": {
        "name": "dealname",
        "amount": "amount",
        "stage": "dealstage"
      }
    }
  ],
  "schedule": {
    "startNow": true
  },
  "options": {
    "strategy": "full",
    "notifyOnCompletion": true,
    "skipDuplicates": true
  }
}

// Example Response
{
  "success": true,
  "data": {
    "migrationId": "mig_123456",
    "name": "Q3 2023 Salesforce to HubSpot Migration",
    "status": "scheduled",
    "createdAt": "2023-07-15T10:30:00Z",
    "estimatedCompletionTime": "2023-07-15T11:15:00Z"
  }
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">Get Migration Status</h3>
                      <div className="mb-2 flex gap-2 items-center">
                        <Badge>GET</Badge>
                        <span className="font-mono text-sm">/migrations/:id</span>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Get the current status of a migration job.
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`// Example Request
GET /migrations/mig_123456

// Example Response
{
  "success": true,
  "data": {
    "migrationId": "mig_123456",
    "name": "Q3 2023 Salesforce to HubSpot Migration",
    "status": "in_progress",
    "progress": {
      "contacts": {
        "total": 1250,
        "migrated": 843,
        "failed": 12,
        "percentage": 67.4
      },
      "accounts": {
        "total": 87,
        "migrated": 65,
        "failed": 0,
        "percentage": 74.7
      },
      "opportunities": {
        "total": 138,
        "migrated": 42,
        "failed": 3,
        "percentage": 30.4
      },
      "overall": {
        "total": 1475,
        "migrated": 950,
        "failed": 15,
        "percentage": 64.4
      }
    },
    "startTime": "2023-07-15T10:35:12Z",
    "estimatedCompletionTime": "2023-07-15T11:20:00Z"
  }
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`// Example Request
GET /migrations/mig_123456

// Example Response
{
  "success": true,
  "data": {
    "migrationId": "mig_123456",
    "name": "Q3 2023 Salesforce to HubSpot Migration",
    "status": "in_progress",
    "progress": {
      "contacts": {
        "total": 1250,
        "migrated": 843,
        "failed": 12,
        "percentage": 67.4
      },
      "accounts": {
        "total": 87,
        "migrated": 65,
        "failed": 0,
        "percentage": 74.7
      },
      "opportunities": {
        "total": 138,
        "migrated": 42,
        "failed": 3,
        "percentage": 30.4
      },
      "overall": {
        "total": 1475,
        "migrated": 950,
        "failed": 15,
        "percentage": 64.4
      }
    },
    "startTime": "2023-07-15T10:35:12Z",
    "estimatedCompletionTime": "2023-07-15T11:20:00Z"
  }
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="webhooks" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">Webhooks</h2>
                      <p className="text-muted-foreground mb-4">
                        Set up webhooks to receive real-time notifications about migration events.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">Register Webhook</h3>
                      <div className="mb-2 flex gap-2 items-center">
                        <Badge>POST</Badge>
                        <span className="font-mono text-sm">/webhooks</span>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Register a new webhook endpoint to receive event notifications.
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`// Example Request
POST /webhooks
{
  "url": "https://your-app.example.com/webhooks/crm-migration",
  "events": [
    "migration.started",
    "migration.completed",
    "migration.failed",
    "record.created",
    "record.failed"
  ],
  "secret": "your_webhook_secret"
}

// Example Response
{
  "success": true,
  "data": {
    "webhookId": "wh_123456",
    "url": "https://your-app.example.com/webhooks/crm-migration",
    "events": [
      "migration.started",
      "migration.completed",
      "migration.failed",
      "record.created",
      "record.failed"
    ],
    "createdAt": "2023-07-15T10:30:00Z"
  }
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`// Example Request
POST /webhooks
{
  "url": "https://your-app.example.com/webhooks/crm-migration",
  "events": [
    "migration.started",
    "migration.completed",
    "migration.failed",
    "record.created",
    "record.failed"
  ],
  "secret": "your_webhook_secret"
}

// Example Response
{
  "success": true,
  "data": {
    "webhookId": "wh_123456",
    "url": "https://your-app.example.com/webhooks/crm-migration",
    "events": [
      "migration.started",
      "migration.completed",
      "migration.failed",
      "record.created",
      "record.failed"
    ],
    "createdAt": "2023-07-15T10:30:00Z"
  }
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">Webhook Event Format</h3>
                      <p className="text-muted-foreground mb-4">
                        Example payload format for webhook events.
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm relative group">
                        <pre>{`{
  "event": "migration.completed",
  "timestamp": "2023-07-15T11:45:00Z",
  "data": {
    "migrationId": "mig_123456",
    "name": "Q3 2023 Salesforce to HubSpot Migration",
    "source": "salesforce",
    "destination": "hubspot",
    "stats": {
      "total": 1475,
      "migrated": 1450,
      "failed": 25,
      "duration": "01:10:23"
    }
  }
}`}</pre>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(`{
  "event": "migration.completed",
  "timestamp": "2023-07-15T11:45:00Z",
  "data": {
    "migrationId": "mig_123456",
    "name": "Q3 2023 Salesforce to HubSpot Migration",
    "source": "salesforce",
    "destination": "hubspot",
    "stats": {
      "total": 1475,
      "migrated": 1450,
      "failed": 25,
      "duration": "01:10:23"
    }
  }
}`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-3">Webhook Security</h3>
                      <p className="text-muted-foreground mb-4">
                        Every webhook request includes a signature for verification.
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md font-mono text-sm">
                        <pre>{`// The X-Signature header contains a HMAC SHA-256 hash of the request body
// using your webhook secret as the key
X-Signature: sha256=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce308b2cd7e

// Verify the signature in your webhook handler
const crypto = require('crypto');

function verifyWebhookSignature(body, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
    
  return signature === \`sha256=\${expectedSignature}\`;
}`}</pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </GlassPanel>
          </div>
        </div>
      </ContentSection>
    </div>
  );
};

export default ApiDocs;
