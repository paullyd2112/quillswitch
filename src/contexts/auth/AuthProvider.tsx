
import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthContextType, AuthResponse } from './types';

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
        console.log('Auth state change:', event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Authentication methods
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/welcome`
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
      console.log('Starting Google OAuth flow...');
      
      // Get the current URL origin to ensure we redirect to the right place
      const currentOrigin = window.location.origin;
      console.log('Current origin:', currentOrigin);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${currentOrigin}/oauth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: true // Get the URL but handle redirect manually
        }
      });
      
      console.log('Google OAuth response:', { data, error });
      
      if (error) {
        console.error('Google OAuth error:', error);
        return { error };
      }
      
      // Manually redirect to Google OAuth URL to avoid any frame issues
      if (data?.url) {
        console.log('Redirecting to Google OAuth URL:', data.url);
        window.location.href = data.url;
        return { data, error: null };
      }
      
      return { error: new Error('No OAuth URL received') };
    } catch (error: any) {
      console.error('Unexpected Google OAuth error:', error);
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
