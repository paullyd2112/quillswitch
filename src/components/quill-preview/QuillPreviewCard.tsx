import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  FileSearch, 
  Shield, 
  ArrowRight,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuillPreviewCardProps {
  onStartPreview?: () => void;
}

const QuillPreviewCard: React.FC<QuillPreviewCardProps> = ({ onStartPreview }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Eye,
      title: "Dry-Run Migration",
      description: "Simulate migration without writing to target CRM"
    },
    {
      icon: BarChart3,
      title: "Data Transformation Impact",
      description: "Visualize how data changes with transformation rules"
    },
    {
      icon: AlertTriangle,
      title: "Data Loss Prevention",
      description: "Identify truncation and compatibility issues early"
    },
    {
      icon: Shield,
      title: "Health Reports",
      description: "Pre-migration assessment with success estimates"
    }
  ];

  return (
    <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all duration-300">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
          <Eye className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">
          QuillPreview
          <Badge variant="outline" className="ml-2 text-xs">
            Risk-Free
          </Badge>
        </CardTitle>
        <CardDescription className="text-lg">
          Simulate and validate your migration before it happens
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <feature.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Why Use QuillPreview?
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Reduces migration anxiety with clear previews
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Prevents data loss through early detection
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Optimizes transformation rules before migration
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Provides confidence with success rate estimates
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onStartPreview}
            className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Eye className="h-4 w-4" />
            Start Preview
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/app/quill-preview')}
            className="gap-2"
          >
            View Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            🔍 Preview your migration risk-free before committing to changes
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuillPreviewCard;