
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState('Processing OAuth callback...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get OAuth parameters from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setStatus('error');
          setMessage(`OAuth error: ${errorDescription || error}`);
          toast({
            title: "Connection Failed",
            description: errorDescription || error,
            variant: "destructive"
          });
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('Missing authorization code');
          toast({
            title: "Connection Failed",
            description: "No authorization code received",
            variant: "destructive"
          });
          return;
        }

        // Get stored OAuth state from localStorage
        const storedStateData = localStorage.getItem('oauth_state');
        if (!storedStateData) {
          setStatus('error');
          setMessage('Missing OAuth state data');
          toast({
            title: "Connection Failed",
            description: "OAuth state data not found. Please try connecting again.",
            variant: "destructive"
          });
          return;
        }

        const stateData = JSON.parse(storedStateData);
        
        // Verify state parameter matches (basic CSRF protection)
        if (state && state !== stateData.state) {
          setStatus('error');
          setMessage('Invalid OAuth state');
          toast({
            title: "Connection Failed",
            description: "OAuth state mismatch. Please try connecting again.",
            variant: "destructive"
          });
          return;
        }

        setMessage('Completing OAuth flow...');

        // Complete the OAuth flow
        const { data: callbackData, error: callbackError } = await supabase.functions.invoke('unified-oauth-callback', {
          body: {
            code: code,
            state: state,
            connection_id: stateData.connection_id,
            workspace_id: stateData.workspace_id
          }
        });

        if (callbackError || !callbackData?.success) {
          console.error('OAuth callback error:', callbackError, callbackData);
          setStatus('error');
          setMessage(callbackData?.error || callbackError?.message || 'Failed to complete OAuth flow');
          toast({
            title: "Connection Failed",
            description: callbackData?.error || callbackError?.message || 'Failed to complete OAuth flow',
            variant: "destructive"
          });
          return;
        }

        console.log('OAuth flow completed successfully:', callbackData);

        // Clean up localStorage
        localStorage.removeItem('oauth_state');

        setStatus('success');
        setMessage(`Successfully connected to ${stateData.integration_type}!`);
        
        toast({
          title: "Connection Successful!",
          description: `${stateData.integration_type} has been connected to your account.`,
        });

        // Redirect to connection hub after a short delay
        setTimeout(() => {
          navigate('/app/connections');
        }, 2000);

      } catch (error) {
        console.error('Unexpected OAuth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
        toast({
          title: "Connection Failed",
          description: "An unexpected error occurred during OAuth callback",
          variant: "destructive"
        });
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, toast]);

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
              {message}
            </p>
          )}
          {status === 'success' && (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">
                {message}
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
                {message}
              </p>
              <button 
                onClick={() => navigate('/app/connections')}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Return to Connection Hub
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
