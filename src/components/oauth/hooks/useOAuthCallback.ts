
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OAuthState, OAuthError } from "../types";
import { logger } from "@/utils/security/productionLogging";

export const useOAuthCallback = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [state, setState] = useState<OAuthState>({
    status: "loading",
    message: "Processing your authentication...",
    provider: ""
  });

  const createError = (type: OAuthError['type'], message: string, description?: string): OAuthError => ({
    type,
    message,
    description
  });

  const handleOAuthError = (error: OAuthError, errorType?: string) => {
    logger.error('OAuth callback error', { 
      error: error.message,
      type: error.type,
      errorType,
      provider: state.provider 
    });

    setState({
      status: "error",
      message: error.description || error.message,
      provider: state.provider
    });

    // Show appropriate toast based on error type
    let toastTitle = "Connection Failed";
    let toastDescription = error.description || error.message;

    switch (errorType) {
      case 'ssl_error':
        toastTitle = "SSL Connection Error";
        toastDescription = "There was an SSL connection issue. Please try again in a moment.";
        break;
      case 'timeout_error':
        toastTitle = "Connection Timeout";
        toastDescription = "The connection timed out. Please try again.";
        break;
      case 'network_error':
        toastTitle = "Network Error";
        toastDescription = "Please check your internet connection and try again.";
        break;
      case 'oauth_state_error':
        toastTitle = "Authentication Expired";
        toastDescription = "Please restart the connection process.";
        break;
    }

    toast({
      title: toastTitle,
      description: toastDescription,
      variant: "destructive"
    });
  };

  const handleOAuthSuccess = (provider: string, message: string) => {
    logger.info('OAuth callback success', { 
      provider,
      message 
    });

    setState({
      status: "success",
      message,
      provider
    });
    
    toast({
      title: "Connection Successful",
      description: `Your ${provider} account has been connected securely.`
    });
  };

  const processCallback = async () => {
    try {
      // Extract parameters from URL
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const stateParam = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      logger.debug('Processing OAuth callback', {
        hasCode: !!code,
        hasState: !!stateParam,
        hasError: !!error,
        errorDescription
      });
      
      // Handle OAuth errors
      if (error) {
        const oauthError = createError(
          'oauth_error',
          `Authentication failed: ${error}`,
          errorDescription || undefined
        );
        handleOAuthError(oauthError);
        return;
      }
      
      // Validate required parameters
      if (!code || !stateParam) {
        const missingParamsError = createError(
          'missing_params',
          "Missing required authentication parameters. Please try again."
        );
        handleOAuthError(missingParamsError);
        return;
      }
      
      // Parse and validate state
      let stateData;
      try {
        // Handle both JSON and simple string states
        if (stateParam.startsWith('{')) {
          stateData = JSON.parse(stateParam);
        } else {
          // Simple state format like "sf_userId_timestamp"
          stateData = { provider: 'Salesforce' };
        }
        setState(prev => ({ ...prev, provider: stateData.provider || "Salesforce" }));
      } catch {
        const invalidStateError = createError(
          'invalid_state',
          "Invalid authentication state. Please try again."
        );
        handleOAuthError(invalidStateError);
        return;
      }
      
      setState(prev => ({ 
        ...prev, 
        message: `Completing ${stateData.provider || 'Salesforce'} authentication...`,
        provider: stateData.provider || "Salesforce"
      }));
      
      logger.info('Calling Salesforce OAuth callback', {
        provider: stateData.provider,
        hasCode: !!code,
        hasState: !!stateParam
      });
      
      // Call the Salesforce OAuth callback function
      const { data, error: callbackError } = await supabase.functions.invoke('salesforce-oauth', {
        body: {
          action: 'callback',
          code: code,
          state: stateParam,
          redirectUri: `${window.location.origin}/oauth/callback`
        }
      });
      
      if (callbackError) {
        logger.error('Salesforce OAuth callback error', {
          error: callbackError.message,
          provider: stateData.provider
        });

        const callbackErrorObj = createError(
          'callback_error',
          `Failed to complete authentication: ${callbackError.message}`
        );
        handleOAuthError(callbackErrorObj);
        return;
      }
      
      if (data?.success) {
        handleOAuthSuccess(
          stateData.provider || 'Salesforce',
          data.message || `Successfully connected to ${stateData.provider || 'Salesforce'}!`
        );
      } else {
        // Handle enhanced error responses from the edge function
        const errorType = data?.errorType;
        const dataError = createError(
          'callback_error',
          data?.error || "Authentication failed. Please try again."
        );
        handleOAuthError(dataError, errorType);
      }
      
    } catch (error) {
      logger.error("OAuth callback processing error", { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });

      const unknownError = createError(
        'unknown_error',
        "An unexpected error occurred during authentication. Please try again."
      );
      handleOAuthError(unknownError);
    }
  };

  useEffect(() => {
    // Add a small delay to show the loading state
    const timer = setTimeout(processCallback, 1000);
    return () => clearTimeout(timer);
  }, [location]);

  return state;
};
