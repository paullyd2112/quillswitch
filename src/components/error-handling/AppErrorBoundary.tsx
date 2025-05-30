
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Home, AlertTriangle, Bug } from 'lucide-react';
import { errorHandler, QuillSwitchError, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  isolate?: boolean; // If true, only affects this component tree
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

class AppErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    // Create a QuillSwitch error for better handling
    const quillError = new QuillSwitchError(
      ERROR_CODES.UNEXPECTED_ERROR,
      `Component error: ${error.message}`,
      "Something went wrong. Our team has been notified.",
      'high',
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name,
        errorId: this.state.errorId,
        retryCount: this.retryCount
      }
    );

    // Handle through global error handler
    errorHandler.handleError(quillError);
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount += 1;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null
      });
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const bugReport = {
      errorId: this.state.errorId,
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // In a real app, this would send to a bug tracking system
    console.log('Bug report:', bugReport);
    
    // For now, copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(bugReport, null, 2)).then(() => {
      alert('Bug report copied to clipboard. Please paste it in your support request.');
    });
  };

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Determine error severity and customize the UI accordingly
      const isRecoverable = this.retryCount < this.maxRetries;
      const showDetailedError = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-red-500/20 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Something Went Wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {this.props.isolate 
                    ? "This section encountered an error, but the rest of the app should work normally."
                    : "We encountered an unexpected error. Don't worry, your data is safe."
                  }
                </AlertDescription>
              </Alert>

              {this.state.errorId && (
                <div className="text-sm text-muted-foreground">
                  <strong>Error ID:</strong> {this.state.errorId}
                </div>
              )}

              {showDetailedError && this.state.error && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-yellow-400">Development Info:</h4>
                  <div className="bg-slate-800 p-3 rounded text-xs font-mono text-slate-300 overflow-auto max-h-40">
                    <div><strong>Error:</strong> {this.state.error.message}</div>
                    {this.state.error.stack && (
                      <div className="mt-2">
                        <strong>Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap">{this.state.error.stack}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {isRecoverable && (
                  <Button 
                    onClick={this.handleRetry}
                    className="gap-2"
                    variant="default"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again ({this.maxRetries - this.retryCount} attempts left)
                  </Button>
                )}

                {!this.props.isolate && (
                  <Button 
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                )}

                <Button 
                  onClick={this.handleReportBug}
                  variant="outline"
                  className="gap-2"
                >
                  <Bug className="h-4 w-4" />
                  Report Bug
                </Button>
              </div>

              {!isRecoverable && (
                <Alert className="border-amber-500/20 bg-amber-500/10">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-amber-300">
                    Maximum retry attempts reached. Please refresh the page or contact support.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
