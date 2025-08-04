import React, { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, Zap, Settings, Lock, Eye, Filter } from "lucide-react";
import PiiMaskingConfig from "@/components/quill-sandbox/PiiMaskingConfig";
import SyntheticDataConfig from "@/components/quill-sandbox/SyntheticDataConfig";
import SubsetSelectionConfig from "@/components/quill-sandbox/SubsetSelectionConfig";
import SandboxJobsList from "@/components/quill-sandbox/SandboxJobsList";

const QuillSandbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <BaseLayout>
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">QuillSandbox</h1>
              <p className="text-muted-foreground">Secure Test Data Management</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Transform production data into secure, compliant test environments with PII masking, 
            synthetic data generation, and intelligent subset selection.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="pii-masking" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              PII Masking
            </TabsTrigger>
            <TabsTrigger value="synthetic-data" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Synthetic Data
            </TabsTrigger>
            <TabsTrigger value="subset-selection" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Subset Selection
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Jobs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Lock className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg">PII Masking</CardTitle>
                      <Badge variant="secondary" className="mt-1">Privacy Protection</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Automatically detect and mask sensitive data like names, emails, phone numbers, 
                    and credit card information with realistic but fake alternatives.
                  </CardDescription>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Smart PII detection</li>
                    <li>• Realistic data replacement</li>
                    <li>• Custom masking rules</li>
                    <li>• Format preservation</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab("pii-masking")}
                  >
                    Configure Masking
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-secondary" />
                    <div>
                      <CardTitle className="text-lg">Synthetic Data</CardTitle>
                      <Badge variant="secondary" className="mt-1">AI Generated</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Generate entirely new, realistic datasets that mimic your production data's 
                    structure and statistical properties without using real customer information.
                  </CardDescription>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• AI-powered generation</li>
                    <li>• Statistical similarity</li>
                    <li>• Zero real data exposure</li>
                    <li>• Scalable datasets</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab("synthetic-data")}
                  >
                    Generate Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Filter className="h-6 w-6 text-accent" />
                    <div>
                      <CardTitle className="text-lg">Subset Selection</CardTitle>
                      <Badge variant="secondary" className="mt-1">Optimized Testing</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Create manageable test environments by selecting specific subsets of your data 
                    based on criteria like geography, date ranges, or custom filters.
                  </CardDescription>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Percentage-based sampling</li>
                    <li>• Geographic filtering</li>
                    <li>• Date range selection</li>
                    <li>• Custom criteria</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab("subset-selection")}
                  >
                    Select Subset
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Security & Compliance Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Privacy Protection</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Zero real PII in test environments</li>
                      <li>• GDPR & CCPA compliance support</li>
                      <li>• Audit trail for all operations</li>
                      <li>• Data lineage tracking</li>
                      <li>• Automatic sensitive field detection</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-secondary">Enterprise Security</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• End-to-end encryption</li>
                      <li>• Role-based access controls</li>
                      <li>• Secure data isolation</li>
                      <li>• Industry standard protocols</li>
                      <li>• SOC 2 Type II ready</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pii-masking">
            <PiiMaskingConfig />
          </TabsContent>

          <TabsContent value="synthetic-data">
            <SyntheticDataConfig />
          </TabsContent>

          <TabsContent value="subset-selection">
            <SubsetSelectionConfig />
          </TabsContent>

          <TabsContent value="jobs">
            <SandboxJobsList />
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default QuillSandbox;