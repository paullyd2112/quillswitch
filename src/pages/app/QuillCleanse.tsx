import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useQuillCleanse } from '@/hooks/useQuillCleanse';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { CleansingJob, DuplicateMatch } from '@/types/quillCleanse';

const QuillCleanse: React.FC = () => {
  const navigate = useNavigate();
  const { session, isLoading: sessionLoading } = useSessionContext();
  const {
    cleansingJobs,
    currentJob,
    duplicateMatches,
    isLoading,
    isProcessing,
    loadCleansingJobs,
    loadDuplicateMatches,
    updateMatchAction,
    setCurrentJob
  } = useQuillCleanse();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (session && !sessionLoading) {
      loadCleansingJobs();
    }
  }, [session, sessionLoading, loadCleansingJobs]);

  useEffect(() => {
    if (selectedJobId) {
      loadDuplicateMatches(selectedJobId);
    }
  }, [selectedJobId, loadDuplicateMatches]);

  if (sessionLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access QuillCleanse
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/auth')} className="w-full">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 dark:text-green-400';
    if (score >= 0.75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            QuillCleanse Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered duplicate detection and data cleansing for your migrations
          </p>
        </div>
        <Button 
          onClick={() => navigate('/app/crm-connections')}
          variant="outline"
        >
          <Upload className="h-4 w-4 mr-2" />
          Start New Cleansing
        </Button>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs" className="gap-2">
            <FileText className="h-4 w-4" />
            Cleansing Jobs
          </TabsTrigger>
          <TabsTrigger value="matches" className="gap-2">
            <Users className="h-4 w-4" />
            Duplicate Matches
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Cleansing Jobs</CardTitle>
              <CardDescription>
                View and manage your data cleansing operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : cleansingJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No cleansing jobs yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first QuillCleanse operation to see results here
                  </p>
                  <Button onClick={() => navigate('/app/crm-connections')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Start Cleansing
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cleansingJobs.map((job) => (
                    <div 
                      key={job.id}
                      className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setCurrentJob(job);
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(job.status)}
                          <div>
                            <h4 className="font-medium">
                              Cleansing Job #{job.id.slice(-8)}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(job.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Records:</span>
                          <p className="font-medium">{job.total_records.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duplicates Found:</span>
                          <p className="font-medium">{job.duplicates_found.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Progress:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress 
                              value={(job.processed_records / job.total_records) * 100} 
                              className="flex-1 h-2"
                            />
                            <span className="text-xs text-muted-foreground">
                              {Math.round((job.processed_records / job.total_records) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          {selectedJobId ? (
            <Card>
              <CardHeader>
                <CardTitle>Duplicate Matches</CardTitle>
                <CardDescription>
                  Review and approve AI-identified duplicate records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {duplicateMatches.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No duplicate matches found for this job
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {duplicateMatches.map((match) => (
                      <div key={match.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">
                              {match.match_type}
                            </Badge>
                            <span className={`font-medium ${getConfidenceColor(match.confidence_score)}`}>
                              {(match.confidence_score * 100).toFixed(0)}% confidence
                            </span>
                          </div>
                          <Badge className={
                            match.suggested_action === 'merge' ? 'bg-blue-100 text-blue-800' :
                            match.suggested_action === 'overwrite' ? 'bg-orange-100 text-orange-800' :
                            match.suggested_action === 'keep_both' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {match.suggested_action}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Source Record</h4>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-3 text-sm">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(match.source_record_data, null, 2)}
                              </pre>
                            </div>
                          </div>
                          
                          {match.target_record_data && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Target Record</h4>
                              <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-3 text-sm">
                                <pre className="whitespace-pre-wrap">
                                  {JSON.stringify(match.target_record_data, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>

                        {match.conflict_fields && match.conflict_fields.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Conflicting Fields</h4>
                            <div className="flex flex-wrap gap-2">
                              {match.conflict_fields.map((field, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-3 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMatchAction(match.id, 'approved')}
                            disabled={match.user_action === 'approved'}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMatchAction(match.id, 'rejected')}
                            disabled={match.user_action === 'rejected'}
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          {match.user_action && (
                            <Badge variant="outline" className="ml-auto">
                              {match.user_action}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a cleansing job</h3>
                <p className="text-muted-foreground">
                  Choose a job from the "Cleansing Jobs" tab to view duplicate matches
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                    <p className="text-2xl font-bold">{cleansingJobs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">
                      {cleansingJobs.filter(job => job.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Duplicates</p>
                    <p className="text-2xl font-bold">
                      {cleansingJobs.reduce((sum, job) => sum + job.duplicates_found, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Confidence</p>
                    <p className="text-2xl font-bold">
                      {duplicateMatches.length > 0 
                        ? Math.round((duplicateMatches.reduce((sum, match) => sum + match.confidence_score, 0) / duplicateMatches.length) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>QuillCleanse Performance</CardTitle>
              <CardDescription>
                Overview of your data cleansing operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Detailed analytics coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuillCleanse;