
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useProcessing } from '@/contexts/ProcessingContext';
import { toast } from 'sonner';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setProcessing } = useProcessing();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      setProcessing(true, 'Processing OAuth callback...');
      
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Here you would typically call your backend to exchange the code for tokens
        // For now, we'll simulate the process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setStatus('success');
        toast.success('Successfully connected via OAuth!');
        
        // Redirect back to the connection hub after a short delay
        setTimeout(() => {
          navigate('/app/connections');
        }, 2000);
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        toast.error('Failed to complete OAuth connection');
        
        // Redirect back to connections with error after delay
        setTimeout(() => {
          navigate('/app/connections');
        }, 3000);
      } finally {
        setProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setProcessing]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
            OAuth Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <p className="text-muted-foreground">
              Processing your OAuth connection...
            </p>
          )}
          {status === 'success' && (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">
                Connection successful!
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting you back to the connection hub...
              </p>
            </div>
          )}
          {status === 'error' && (
            <div className="space-y-2">
              <p className="text-red-600 font-medium">
                Connection failed
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting you back to try again...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
