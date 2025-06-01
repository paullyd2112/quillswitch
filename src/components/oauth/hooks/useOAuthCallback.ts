
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OAuthState, OAuthError } from "../types";

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

  const handleOAuthError = (error: OAuthError) => {
    console.error('OAuth callback error:', error);
    setState({
      status: "error",
      message: error.description || error.message,
      provider: state.provider
    });
  };

  const handleOAuthSuccess = (provider: string, message: string) => {
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
        stateData = JSON.parse(stateParam);
        setState(prev => ({ ...prev, provider: stateData.provider || "CRM" }));
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
        message: `Completing ${stateData.provider} authentication...`,
        provider: stateData.provider || "CRM"
      }));
      
      // Call the OAuth callback edge function
      const { data, error: callbackError } = await supabase.functions.invoke('oauth-callback', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: new URLSearchParams({ 
          code: code,
          state: stateParam
        })
      });
      
      if (callbackError) {
        const callbackErrorObj = createError(
          'callback_error',
          `Failed to complete authentication: ${callbackError.message}`
        );
        handleOAuthError(callbackErrorObj);
        return;
      }
      
      if (data?.success) {
        handleOAuthSuccess(
          stateData.provider,
          data.message || `Successfully connected to ${stateData.provider}!`
        );
      } else {
        const dataError = createError(
          'callback_error',
          data?.error || "Authentication failed. Please try again."
        );
        handleOAuthError(dataError);
      }
      
    } catch (error) {
      console.error("OAuth callback processing error:", error);
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
