import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  FileSearch, 
  Users, 
  ArrowRight, 
  TrendingUp,
  Shield,
  Brain,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuillCleanseCardProps {
  onStartCleansing?: () => void;
}

const QuillCleanseCard: React.FC<QuillCleanseCardProps> = ({ onStartCleansing }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced fuzzy logic, phonetic matching, and semantic analysis"
    },
    {
      icon: TrendingUp,
      title: "Confidence Scoring",
      description: "Each suggestion comes with an AI-calculated confidence score"
    },
    {
      icon: Shield,
      title: "User-Definable Rules",
      description: "Set custom thresholds and preferred resolution strategies"
    },
    {
      icon: Zap,
      title: "Smart Reconciliation",
      description: "Automated suggestions for merge, overwrite, or keep both actions"
    }
  ];

  return (
    <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">
          QuillCleanse
          <Badge variant="outline" className="ml-2 text-xs">
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription className="text-lg">
          Intelligent duplicate detection and data cleansing before migration
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <feature.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <FileSearch className="h-4 w-4" />
            What QuillCleanse Does
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Proactively identifies potential duplicates beyond exact matches
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Suggests intelligent reconciliation strategies for conflicts
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Provides confidence scores for each recommendation
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Reduces post-migration cleanup and improves data quality
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onStartCleansing}
            className="flex-1 gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Start QuillCleanse
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/app/quill-cleanse')}
            className="gap-2"
          >
            View Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            💡 Pro tip: QuillCleanse works best with data that includes names, emails, or phone numbers
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuillCleanseCard;