import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Scan, 
  Eye, 
  FileText, 
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuillShieldCardProps {
  onStartScan?: () => void;
}

const QuillShieldCard: React.FC<QuillShieldCardProps> = ({ onStartScan }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Scan,
      title: "AI PII Detection",
      description: "Identifies names, emails, SSNs, and sensitive data patterns"
    },
    {
      icon: Eye,
      title: "Masking & Anonymization", 
      description: "Redact, tokenize, or encrypt PII for compliance"
    },
    {
      icon: FileText,
      title: "Compliance Reports",
      description: "Generate audit trails and PII handling documentation"
    },
    {
      icon: Lock,
      title: "Retention Policies",
      description: "Automatic data purging based on governance rules"
    }
  ];

  return (
    <Card className="border-2 border-dashed border-green-200 hover:border-green-400 transition-all duration-300">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">
          QuillShield
          <Badge variant="outline" className="ml-2 text-xs">
            Enterprise
          </Badge>
        </CardTitle>
        <CardDescription className="text-lg">
          PII detection, masking, and compliance for secure migrations
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <feature.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance Standards
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>CCPA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>HIPAA Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>SOX Aligned</span>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Enterprise Security
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Essential for organizations handling sensitive customer data or operating in regulated industries
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onStartScan}
            className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
          >
            <Scan className="h-4 w-4" />
            Start PII Scan
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/app/quill-shield')}
            className="gap-2"
          >
            View Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            🛡️ Secure your sensitive data with enterprise-grade PII protection
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuillShieldCard;