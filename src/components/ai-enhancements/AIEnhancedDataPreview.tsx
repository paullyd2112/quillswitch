import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Shield, Copy, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAIEnhancements } from '@/hooks/useAIEnhancements';
import { ExtractedData } from '@/services/migration/extractionService';
import { MigrationContext } from '@/services/ai-enhancements/predictiveErrorService';

interface AIEnhancedDataPreviewProps {
  data: ExtractedData[];
  migrationContext: MigrationContext;
  onAnalysisComplete?: (results: any) => void;
}

const AIEnhancedDataPreview: React.FC<AIEnhancedDataPreviewProps> = ({
  data,
  migrationContext,
  onAnalysisComplete
}) => {
  const { isProcessing, runFullAnalysis } = useAIEnhancements();
  const [analysis, setAnalysis] = useState<any>(null);
  const [progress, setProgress] = useState({ step: '', progress: 0 });

  const handleRunAnalysis = async () => {
    try {
      const results = await runFullAnalysis(
        data,
        migrationContext,
        (step, progress) => setProgress({ step, progress })
      );
      
      setAnalysis(results);
      onAnalysisComplete?.(results);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header with Analysis Trigger */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Enhanced Data Analysis
          </CardTitle>
          <CardDescription>
            Advanced data quality assessment with ML-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Ready to analyze {data.length} records
            </div>
            <Button 
              onClick={handleRunAnalysis} 
              disabled={isProcessing}
              className="gap-2"
            >
              <Brain className="h-4 w-4" />
              {isProcessing ? 'Analyzing...' : 'Run AI Analysis'}
            </Button>
          </div>
          
          {isProcessing && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{progress.step}</span>
                <span>{progress.progress}%</span>
              </div>
              <Progress value={progress.progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quality">Data Quality</TabsTrigger>
            <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
            <TabsTrigger value="pii">PII Detection</TabsTrigger>
            <TabsTrigger value="predictions">Risk Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Overall Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.summary.qualityScore)}`}>
                    {analysis.summary.qualityScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Average across all records
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Issues Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Duplicates</span>
                      <Badge variant="outline">{analysis.summary.duplicatesFound}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">PII Issues</span>
                      <Badge variant="outline">{analysis.summary.piiIssues}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Predicted Errors</span>
                      <Badge variant="outline">{analysis.summary.predictedErrors}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Risk Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge 
                    className={`text-lg px-3 py-1 ${
                      analysis.riskAssessment.overallRisk === 'critical' ? 'bg-red-500' :
                      analysis.riskAssessment.overallRisk === 'high' ? 'bg-orange-500' :
                      analysis.riskAssessment.overallRisk === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                  >
                    {analysis.riskAssessment.overallRisk.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {analysis.riskAssessment.estimatedFailureRate}% failure probability
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Key Recommendations */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Key Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.riskAssessment.recommendations.slice(0, 5).map((rec: string, index: number) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{rec}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Quality Tab */}
          <TabsContent value="quality">
            <div className="space-y-4">
              {analysis.validation.slice(0, 10).map((result: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Record {result.recordId}</CardTitle>
                      <div className={`text-2xl font-bold ${getScoreColor(result.overallScore)}`}>
                        {result.overallScore}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Completeness</div>
                        <div className="font-semibold">{result.qualityMetrics.completeness}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                        <div className="font-semibold">{result.qualityMetrics.accuracy}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Consistency</div>
                        <div className="font-semibold">{result.qualityMetrics.consistency}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Compliance</div>
                        <div className="font-semibold">{result.qualityMetrics.compliance}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Uniqueness</div>
                        <div className="font-semibold">{result.qualityMetrics.uniqueness}%</div>
                      </div>
                    </div>

                    {result.issues.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Issues Found:</h4>
                        {result.issues.map((issue: any, issueIndex: number) => (
                          <div key={issueIndex} className="flex items-center gap-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${getSeverityColor(issue.severity)}`} />
                            <span className="font-medium">{issue.field}:</span>
                            <span>{issue.message}</span>
                            {issue.aiGenerated && <Badge variant="secondary" className="text-xs">AI</Badge>}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Duplicates Tab */}
          <TabsContent value="duplicates">
            <div className="space-y-4">
              {analysis.validation
                .filter((result: any) => result.duplicates.length > 0)
                .map((result: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        Potential Duplicate: Record {result.recordId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.duplicates.map((duplicate: any, dupIndex: number) => (
                        <div key={dupIndex} className="border rounded p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">
                              Matches Record {duplicate.matchedRecord?.recordId}
                            </span>
                            <Badge variant="outline">{duplicate.confidence}% confidence</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{duplicate.reason}</p>
                          <div className="flex flex-wrap gap-1">
                            {duplicate.matchingFields.map((field: string, fieldIndex: number) => (
                              <Badge key={fieldIndex} variant="secondary" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              
              {analysis.validation.filter((result: any) => result.duplicates.length > 0).length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No Duplicates Detected</h3>
                    <p className="text-muted-foreground">All records appear to be unique</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* PII Detection Tab */}
          <TabsContent value="pii">
            <div className="space-y-4">
              {analysis.validation
                .filter((result: any) => result.piiResults.length > 0)
                .map((result: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        PII Detected: Record {result.recordId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.piiResults.map((pii: any, piiIndex: number) => (
                          <div key={piiIndex} className="border rounded p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">{pii.fieldName}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{pii.confidence}% confidence</Badge>
                                {pii.shouldMask && <Badge variant="destructive">Requires Masking</Badge>}
                              </div>
                            </div>
                            <div className="text-sm space-y-1">
                              <div>
                                <span className="text-muted-foreground">Types: </span>
                                {pii.piiTypes.map((type: any) => type.type).join(', ')}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Original: </span>
                                <code className="bg-muted px-1 rounded">{String(pii.value)}</code>
                              </div>
                              {pii.maskedValue && (
                                <div>
                                  <span className="text-muted-foreground">Masked: </span>
                                  <code className="bg-muted px-1 rounded">{pii.maskedValue}</code>
                                </div>
                              )}
                              <div className="text-muted-foreground">{pii.suggestion}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {analysis.validation.filter((result: any) => result.piiResults.length > 0).length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No PII Detected</h3>
                    <p className="text-muted-foreground">Data appears to be free of personally identifiable information</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Risk Predictions Tab */}
          <TabsContent value="predictions">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Migration Risk Assessment</CardTitle>
                  <CardDescription>
                    AI-powered predictions based on historical migration data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Risk Level</h4>
                      <Badge 
                        className={`text-lg px-3 py-1 ${
                          analysis.riskAssessment.overallRisk === 'critical' ? 'bg-red-500' :
                          analysis.riskAssessment.overallRisk === 'high' ? 'bg-orange-500' :
                          analysis.riskAssessment.overallRisk === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                      >
                        {analysis.riskAssessment.overallRisk.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Estimated Failure Rate</h4>
                      <div className="text-2xl font-bold text-red-600">
                        {analysis.riskAssessment.estimatedFailureRate}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {analysis.riskAssessment.predictions.map((prediction: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{prediction.errorType.replace(/_/g, ' ').toUpperCase()}</h4>
                        <Badge variant="outline">{Math.round(prediction.probability * 100)}% probability</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{prediction.reasoning}</p>
                      
                      {prediction.affectedFields.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium">Affected Fields: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prediction.affectedFields.map((field: string, fieldIndex: number) => (
                              <Badge key={fieldIndex} variant="secondary" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="text-sm font-medium">Prevention Suggestions:</span>
                        <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                          {prediction.preventionSuggestions.map((suggestion: string, sugIndex: number) => (
                            <li key={sugIndex}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AIEnhancedDataPreview;