
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { securityAuditor } from '@/utils/securityAudit';
import { useNavigate } from 'react-router-dom';

const SecurityAuditSummary = () => {
  const [auditScore, setAuditScore] = useState<number>(0);
  const [issueCount, setIssueCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const performQuickAudit = async () => {
      try {
        const result = await securityAuditor.performComprehensiveAudit();
        setAuditScore(result.score);
        setIssueCount(result.issues.length);
      } catch (error) {
        console.error('Quick audit failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    performQuickAudit();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Status
        </CardTitle>
        <CardDescription>
          Current security posture overview
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${getScoreColor(auditScore)}`}>
                  {auditScore}/100
                </div>
                <div className="text-sm text-muted-foreground">
                  {getScoreStatus(auditScore)} Security
                </div>
              </div>
              <div className="text-right">
                {issueCount > 0 ? (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {issueCount} Issues
                  </Badge>
                ) : (
                  <Badge variant="default" className="gap-1 bg-green-500">
                    <CheckCircle className="h-3 w-3" />
                    No Issues
                  </Badge>
                )}
              </div>
            </div>

            <Progress value={auditScore} className="h-2" />

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigate('/app/security')}
                className="flex-1"
              >
                <FileText className="h-3 w-3 mr-1" />
                View Details
              </Button>
              <Button 
                size="sm" 
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Run Full Audit
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAuditSummary;
