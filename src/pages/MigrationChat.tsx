
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MigrationChatInterface from "@/components/migration/chat/MigrationChatInterface";

interface ExtractedMigrationInfo {
  sourceCrm?: string;
  destinationCrm?: string;
  dataTypes?: string[];
  recordCount?: string;
  timeline?: string;
  challenges?: string[];
  readyForSetup?: boolean;
}

const MigrationChat: React.FC = () => {
  const [extractedInfo, setExtractedInfo] = useState<ExtractedMigrationInfo>({});
  const navigate = useNavigate();

  const handleMigrationInfoExtracted = (info: ExtractedMigrationInfo) => {
    setExtractedInfo(info);
  };

  const handleStartTraditionalSetup = () => {
    navigate('/app/setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Describe Your Migration Needs
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Tell our AI assistant about your CRM migration in natural language. 
            We'll help you plan and configure the perfect migration setup.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4" />
              Powered by Gemini AI
            </div>
            <div className="text-sm text-muted-foreground">•</div>
            <div className="text-sm text-muted-foreground">
              Natural Language Processing
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <MigrationChatInterface 
              onMigrationInfoExtracted={handleMigrationInfoExtracted}
              className="h-[600px]"
            />
          </div>

          {/* Sidebar with information and options */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    1
                  </div>
                  <p className="text-sm">Tell us about your current CRM and what you want to achieve</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    2
                  </div>
                  <p className="text-sm">Our AI asks clarifying questions to understand your needs</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    3
                  </div>
                  <p className="text-sm">We automatically configure your migration setup</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example Questions</CardTitle>
                <CardDescription>
                  Here are some things you can tell our AI:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-muted rounded-lg text-sm">
                  "I'm moving from Salesforce to HubSpot and need to migrate all my contacts and deals"
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  "We have about 10,000 contacts in Pipedrive and want to switch to Zoho"
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  "I need to migrate everything except notes and keep all custom fields"
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prefer Traditional Setup?</CardTitle>
                <CardDescription>
                  You can also use our step-by-step wizard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  onClick={handleStartTraditionalSetup}
                  className="w-full gap-2"
                >
                  Use Setup Wizard <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationChat;
