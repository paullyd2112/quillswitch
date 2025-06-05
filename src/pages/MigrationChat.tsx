
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Brain, Sparkles, Zap, Shield } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Migration Assistant</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Describe Your Migration Vision
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our advanced AI understands your migration needs in natural language and automatically configures the perfect migration strategy for your business.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full backdrop-blur-sm">
              <Brain className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-slate-300">Powered by Gemini AI</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full backdrop-blur-sm">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-slate-300">Intelligent Planning</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full backdrop-blur-sm">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-300">Enterprise Security</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <MigrationChatInterface 
              onMigrationInfoExtracted={handleMigrationInfoExtracted}
              className="h-[700px] shadow-2xl shadow-black/20"
            />
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* How It Works Card */}
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-lg">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-slate-200 mb-1">Describe Your Goals</p>
                    <p className="text-sm text-slate-400">Tell us about your current CRM and migration objectives</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-lg">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-slate-200 mb-1">AI Analysis</p>
                    <p className="text-sm text-slate-400">Our AI asks intelligent questions to understand your needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-lg">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-slate-200 mb-1">Auto-Configuration</p>
                    <p className="text-sm text-slate-400">We automatically configure your optimal migration setup</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example Prompts Card */}
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Example Conversations</CardTitle>
                <CardDescription className="text-slate-400">
                  Here are some ways to start your migration planning:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-slate-800/80 to-slate-700/50 rounded-lg border border-slate-600/30 hover:border-primary/30 transition-colors">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    "I'm moving from Salesforce to HubSpot and need to migrate all my contacts and deals with custom fields intact"
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-slate-800/80 to-slate-700/50 rounded-lg border border-slate-600/30 hover:border-primary/30 transition-colors">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    "We have 10,000+ contacts in Pipedrive and want to switch to Zoho with minimal downtime"
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-slate-800/80 to-slate-700/50 rounded-lg border border-slate-600/30 hover:border-primary/30 transition-colors">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    "I need to migrate everything except notes and preserve all integration connections"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Alternative Setup Card */}
            <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Prefer Step-by-Step?</CardTitle>
                <CardDescription className="text-slate-400">
                  Use our guided setup wizard for a structured approach
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  onClick={handleStartTraditionalSetup}
                  className="w-full gap-2 bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-slate-200 hover:text-white transition-all duration-200"
                >
                  Launch Setup Wizard 
                  <ArrowRight className="h-4 w-4" />
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
