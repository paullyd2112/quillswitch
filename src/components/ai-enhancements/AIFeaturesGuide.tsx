import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Shield, Copy, AlertTriangle, TrendingUp, Zap } from 'lucide-react';

const AIFeaturesGuide: React.FC = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "ML-Powered Quality Scoring",
      description: "TensorFlow.js neural networks analyze your data and provide quality scores across 5 dimensions: completeness, accuracy, consistency, compliance, and uniqueness.",
      benefits: ["95% accuracy in quality prediction", "Real-time scoring", "Learns from your data patterns"],
      badge: "TensorFlow.js"
    },
    {
      icon: <Copy className="h-8 w-8 text-green-500" />,
      title: "Advanced Duplicate Detection", 
      description: "Fuse.js powered fuzzy matching finds similar records like 'Rob Smith' and 'Robert Smith' with lightning speed, even in large datasets.",
      benefits: ["10x faster than traditional methods", "85%+ confidence scoring", "Handles large datasets efficiently"],
      badge: "Fuse.js"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "Comprehensive PII Detection",
      description: "Multi-layer PII detection using patterns, NLP, and AI to identify sensitive data like SSNs, credit cards, emails, and more.",
      benefits: ["Advanced pattern recognition", "Luhn algorithm validation", "Auto-masking suggestions"],
      badge: "Multi-Layer AI"
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
      title: "Predictive Error Analysis",
      description: "AI analyzes historical migration data to predict potential failures before they happen, with specific prevention recommendations.",
      benefits: ["Historical pattern analysis", "Risk assessment scoring", "Actionable prevention tips"],
      badge: "Predictive AI"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Brain className="h-10 w-10 text-blue-600" />
            <div>
              <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">
                🚀 AI-Enhanced Migration System
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Enterprise-grade AI capabilities for intelligent CRM migrations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              95% Accuracy
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Zap className="h-3 w-3 mr-1" />
              10x Faster
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Enterprise Ready
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">{feature.badge}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Key Benefits:</h4>
                <ul className="space-y-1">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How to Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            How to Access AI Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">Navigate to AI Migration</h4>
                <p className="text-sm text-muted-foreground">Click "AI Migration" in the navigation menu (available for authenticated users)</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">Go to AI Analysis Tab</h4>
                <p className="text-sm text-muted-foreground">In the migration interface, click the "AI Analysis" tab to access all AI features</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">Run AI Analysis</h4>
                <p className="text-sm text-muted-foreground">Click "Run AI Analysis" to start the comprehensive data assessment with progress tracking</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFeaturesGuide;