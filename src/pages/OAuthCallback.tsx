
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { oauthStorage } from "@/utils/secureStorage";

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

        if (!code || !state) {
          setStatus('error');
          setMessage('Missing required OAuth parameters');
          toast({
            title: "Connection Failed",
            description: "Missing authorization code or state parameter",
            variant: "destructive"
          });
          return;
        }

        setMessage('Completing Salesforce OAuth flow...');
        
        console.log('Calling salesforce-oauth with callback action:', {
          action: 'callback',
          code: code.substring(0, 20) + '...',
          state: state,
          redirectUri: `${window.location.origin}/oauth/callback`,
          sandbox: false
        });

        // For Salesforce, call the salesforce-oauth edge function directly
        const { data: callbackData, error: callbackError } = await supabase.functions.invoke('salesforce-oauth', {
          body: {
            action: 'callback',
            code: code,
            state: state,
            redirectUri: `${window.location.origin}/oauth/callback`,
            sandbox: false
          }
        });

        console.log('Salesforce OAuth callback response:', { 
          callbackData, 
          callbackError,
          errorDetails: callbackError ? {
            message: callbackError.message,
            details: callbackError.details,
            hint: callbackError.hint,
            code: callbackError.code,
            context: callbackError.context
          } : null
        });

        if (callbackError || !callbackData?.success) {
          console.error('OAuth callback failed:', { 
            callbackError, 
            callbackData,
            fullError: callbackError
          });
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

        setStatus('success');
        setMessage('Successfully connected to Salesforce!');
        
        toast({
          title: "Connection Successful!",
          description: "Salesforce has been connected to your account.",
        });

        // Redirect to CRM connections page after a short delay
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
                Redirecting you back to the CRM connections page...
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
                Return to CRM Connections
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
