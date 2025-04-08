
import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import { Button } from "@/components/ui/button";
import { Code, Copy, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FadeIn from "@/components/animations/FadeIn";

const ApiPlaygroundPreview = () => {
  const navigate = useNavigate();
  
  return (
    <ContentSection className="py-24">
      <div className="text-center max-w-xl mx-auto mb-12">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Interactive API Documentation
          </h2>
          <p className="text-muted-foreground">
            Explore and test our migration API directly in your browser with our interactive playground.
          </p>
        </FadeIn>
      </div>
      
      <div className="grid md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2">
          <FadeIn delay={0.1}>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Powerful Migration API</h3>
                <p className="text-muted-foreground">
                  Our RESTful API gives you complete control over every aspect of your CRM migration.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-brand-100 dark:bg-brand-800/30 flex items-center justify-center text-brand-700 dark:text-brand-300 text-xs font-medium mr-3 mt-0.5">1</div>
                  <div>
                    <h4 className="font-medium">Extract Data</h4>
                    <p className="text-sm text-muted-foreground">Pull data from any supported CRM with advanced filtering</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-brand-100 dark:bg-brand-800/30 flex items-center justify-center text-brand-700 dark:text-brand-300 text-xs font-medium mr-3 mt-0.5">2</div>
                  <div>
                    <h4 className="font-medium">Transform Fields</h4>
                    <p className="text-sm text-muted-foreground">Map fields between CRMs with custom transformations</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-brand-100 dark:bg-brand-800/30 flex items-center justify-center text-brand-700 dark:text-brand-300 text-xs font-medium mr-3 mt-0.5">3</div>
                  <div>
                    <h4 className="font-medium">Load & Verify</h4>
                    <p className="text-sm text-muted-foreground">Import data with verification and deduplication checks</p>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => navigate("/api-docs")} className="gap-2">
                <Code className="h-4 w-4" />
                Explore Full API Docs
              </Button>
            </div>
          </FadeIn>
        </div>
        
        <div className="md:col-span-3">
          <FadeIn delay={0.2}>
            <div className="rounded-lg overflow-hidden border shadow-md">
              <div className="bg-slate-800 p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex space-x-2 mr-4">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <p className="text-xs text-slate-400">API Playground - POST /migrations</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <PlayCircle className="h-3.5 w-3.5 text-slate-400" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-slate-900 p-4 text-slate-300 font-mono text-sm overflow-x-auto">
                <pre>
{`// Create a new migration
POST /api/migrations

{
  "name": "Salesforce to HubSpot - Q2 2025",
  "source": {
    "type": "salesforce",
    "credentials": {
      "clientId": "{{CLIENT_ID}}",
      "clientSecret": "{{CLIENT_SECRET}}",
      "refreshToken": "{{REFRESH_TOKEN}}"
    }
  },
  "destination": {
    "type": "hubspot",
    "credentials": {
      "apiKey": "{{API_KEY}}"
    }
  },
  "dataTypes": [
    {
      "type": "contacts",
      "mapping": {
        "Email": "email",
        "FirstName": "firstname",
        "LastName": "lastname",
        "Title": "jobtitle"
      }
    }
  ]
}`}
                </pre>
              </div>
              
              <div className="bg-slate-800 p-3 border-t border-slate-700">
                <p className="text-xs text-slate-400">Response · 200 OK · 135ms</p>
                <pre className="text-xs text-green-400 mt-1">
{`{
  "success": true,
  "data": {
    "migrationId": "mig_5f3e9b2c",
    "status": "scheduled",
    "estimatedCompletionTime": "2025-04-08T15:45:23Z"
  }
}`}
                </pre>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </ContentSection>
  );
};

export default ApiPlaygroundPreview;
