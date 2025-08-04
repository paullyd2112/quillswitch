import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Zap, Brain, Database, TrendingUp, Play, Settings } from "lucide-react";

const SyntheticDataConfig: React.FC = () => {
  const [recordCount, setRecordCount] = useState([10000]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Synthetic Data Generation
          </CardTitle>
          <CardDescription>
            Generate realistic test datasets that mirror your production data's patterns without exposing real information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="data-source">Source Data Analysis</Label>
                <Select defaultValue="salesforce-prod">
                  <SelectTrigger>
                    <SelectValue placeholder="Select source to analyze" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salesforce-prod">Salesforce Production</SelectItem>
                    <SelectItem value="hubspot-prod">HubSpot Production</SelectItem>
                    <SelectItem value="pipedrive-prod">Pipedrive Production</SelectItem>
                    <SelectItem value="custom-upload">Upload Custom Dataset</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  AI will analyze patterns, distributions, and relationships
                </p>
              </div>

              <div>
                <Label htmlFor="record-count">Number of Records</Label>
                <div className="space-y-3">
                  <Slider
                    value={recordCount}
                    onValueChange={setRecordCount}
                    max={100000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1K</span>
                    <span className="font-medium">{recordCount[0].toLocaleString()} records</span>
                    <span>100K</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="generation-mode">Generation Mode</Label>
                <Select defaultValue="statistical">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="statistical">Statistical Mirroring</SelectItem>
                    <SelectItem value="deep-learning">Deep Learning Model</SelectItem>
                    <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="data-quality">Data Quality Level</Label>
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic - Fast generation</SelectItem>
                    <SelectItem value="standard">Standard - Balanced quality</SelectItem>
                    <SelectItem value="high">High - Maximum realism</SelectItem>
                    <SelectItem value="enterprise">Enterprise - Production-ready</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="variance-level">Statistical Variance</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Close to original</SelectItem>
                    <SelectItem value="medium">Medium - Balanced variation</SelectItem>
                    <SelectItem value="high">High - More diverse patterns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="seed">Reproducibility Seed (Optional)</Label>
                <Input placeholder="Enter seed for consistent results" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Data Relationships</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Preserve relationships between entities like contacts, accounts, and opportunities
              </p>
              <Badge variant="secondary">Auto-detected</Badge>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-secondary" />
                <h4 className="font-semibold">Temporal Patterns</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Maintain time-based patterns like seasonal trends and growth curves
              </p>
              <Badge variant="secondary">Enabled</Badge>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-accent" />
                <h4 className="font-semibold">Custom Fields</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Generate realistic values for custom fields based on your specific business logic
              </p>
              <Badge variant="secondary">AI-powered</Badge>
            </Card>
          </div>
        </CardContent>
      </Card>

      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 animate-pulse" />
              Generating Synthetic Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={generationProgress} className="w-full" />
              <div className="text-sm text-muted-foreground">
                {generationProgress < 30 && "Analyzing source data patterns..."}
                {generationProgress >= 30 && generationProgress < 60 && "Training generation model..."}
                {generationProgress >= 60 && generationProgress < 90 && "Generating synthetic records..."}
                {generationProgress >= 90 && "Finalizing and validating data..."}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Save as Template
        </Button>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          <Play className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Data"}
        </Button>
      </div>
    </div>
  );
};

export default SyntheticDataConfig;