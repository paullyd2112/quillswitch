
import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthContextType, AuthResponse } from './types';
import { logger } from '@/utils/logging/productionLogger';
import { toast } from '@/hooks/use-toast';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: new Error("Not implemented") }),
  signUp: async () => ({ error: new Error("Not implemented") }),
  signOut: async () => ({ error: new Error("Not implemented") }),
  signInWithGoogle: async () => ({ error: new Error("Not implemented") }),
  requestPasswordReset: async () => ({ error: new Error("Not implemented") }),
  resetPassword: async () => ({ error: new Error("Not implemented") }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set up auth state listener FIRST to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        logger.debug('Auth', 'Auth state change', { event, userEmail: currentSession?.user?.email });
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      logger.debug('Auth', 'Initial session check', { userEmail: currentSession?.user?.email });
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to get client IP (best effort)
  const getClientIP = (): string | null => {
    // In a real application, you'd get this from your server
    // For now, we'll use a placeholder or try to get it from headers
    return null; // Will be handled by the database function
  };

  // Helper function to get user agent
  const getUserAgent = (): string => {
    return navigator.userAgent || '';
  };

  // Authentication methods
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    const clientIP = getClientIP();
    const userAgent = getUserAgent();

    try {
      // First check if account is locked
      const { data: lockoutData, error: lockoutError } = await supabase.rpc('check_account_lockout', {
        user_email: email,
        client_ip: clientIP
      });

      if (lockoutError) {
        logger.error('Auth', 'Failed to check account lockout', lockoutError);
      } else if (lockoutData && lockoutData.length > 0) {
        const lockoutInfo = lockoutData[0];
        if (lockoutInfo.is_locked) {
          const lockoutUntil = new Date(lockoutInfo.lockout_until);
          const minutesLeft = Math.ceil((lockoutUntil.getTime() - Date.now()) / (1000 * 60));
          
          toast({
            title: "Account Temporarily Locked",
            description: `Too many failed login attempts. Please try again in ${minutesLeft} minutes.`,
            variant: "destructive"
          });
          
          return { 
            error: new Error(`Account locked. Please try again in ${minutesLeft} minutes.`) 
          };
        }
      }

      // Attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      // Log the attempt (success or failure)
      try {
        await supabase.rpc('log_login_attempt', {
          user_email: email,
          client_ip: clientIP,
          is_success: !error,
          client_user_agent: userAgent
        });
      } catch (logError) {
        logger.error('Auth', 'Failed to log login attempt', logError);
      }

      if (error) {
        // Show user-friendly error message for failed attempts
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive"
          });
        }
      } else {
        logger.info('Auth', 'Successful login', { email });
      }

      return { data, error };
    } catch (error: any) {
      logger.error('Auth', 'Unexpected sign in error', error);
      // Log failed attempt even on unexpected errors
      try {
        await supabase.rpc('log_login_attempt', {
          user_email: email,
          client_ip: clientIP,
          is_success: false,
          client_user_agent: userAgent
        });
      } catch (logError) {
        logger.error('Auth', 'Failed to log failed login attempt', logError);
      }
      
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }): Promise<AuthResponse> => {
    try {
      // Validate password strength before attempting signup
      const { data: isStrongPassword, error: validationError } = await supabase.rpc('validate_password_strength', {
        password: password
      });

      if (validationError) {
        logger.error('Auth', 'Password validation failed', validationError);
        return { error: validationError };
      }

      if (!isStrongPassword) {
        const passwordError = new Error('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character');
        toast({
          title: "Weak Password",
          description: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character (!@#$%^&*(),.?\":{}|<>)",
          variant: "destructive"
        });
        return { error: passwordError };
      }

      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        return { error };
      }
      
      // Check if email confirmation is required
      const emailConfirmationSent = data.user && !data.user.confirmed_at;
      
      return { data, error: null, emailConfirmationSent };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async (): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error: any) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };
  
  const signInWithGoogle = async (): Promise<AuthResponse> => {
    try {
      logger.info('Auth', 'Starting Google OAuth flow');
      
      // Get the current URL origin to ensure we redirect to the right place
      const currentOrigin = window.location.origin;
      logger.debug('Auth', 'OAuth redirect origin configured', { origin: currentOrigin });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${currentOrigin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      logger.debug('Auth', 'Google OAuth response received', { 
        hasData: !!data, 
        hasError: !!error,
        errorMessage: error?.message 
      });
      
      if (error) {
        logger.error('Auth', 'Google OAuth error', error);
        return { error };
      }
      
      return { data, error: null };
    } catch (error: any) {
      logger.error('Auth', 'Unexpected Google OAuth error', error);
      return { error };
    }
  };

  const requestPasswordReset = async (email: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (error: any) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (newPassword: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { data, error };
    } catch (error: any) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      requestPasswordReset,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
