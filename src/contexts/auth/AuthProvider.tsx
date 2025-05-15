
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthContextType, User, AuthError } from "./types";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError>(null);
  
  // Check for existing session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth session error:", error);
          return;
        }
        
        setUser(session?.user || null);
        
        // Subscribe to auth changes
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user || null);
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError({ message: error.message, code: error.code });
        toast.error("Sign in failed: " + error.message);
        return;
      }
      
      if (data && data.user) {
        setUser(data.user);
        toast.success("Successfully signed in!");
      }
    } catch (err: any) {
      setError({ message: err.message });
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      
      if (error) {
        setError({ message: error.message, code: error.code });
        toast.error("Sign up failed: " + error.message);
        return;
      }
      
      if (data) {
        toast.success("Check your email to confirm your account!");
      }
    } catch (err: any) {
      setError({ message: err.message });
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError({ message: error.message, code: error.code });
        toast.error("Sign out failed: " + error.message);
        return;
      }
      
      setUser(null);
      toast.success("Successfully signed out");
    } catch (err: any) {
      setError({ message: err.message });
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        setError({ message: error.message, code: error.code });
        toast.error("Password reset failed: " + error.message);
        return;
      }
      
      toast.success("Password reset email sent");
    } catch (err: any) {
      setError({ message: err.message });
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  // Update profile
  const updateProfile = async (data: { name?: string; email?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        data: { name: data.name },
      });
      
      if (error) {
        setError({ message: error.message, code: error.code });
        toast.error("Profile update failed: " + error.message);
        return;
      }
      
      // Update local user state if successful
      if (user) {
        setUser({
          ...user,
          email: data.email || user.email,
          name: data.name || user.name,
        });
      }
      
      toast.success("Profile updated successfully");
    } catch (err: any) {
      setError({ message: err.message });
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  // Send verification email
  const sendVerificationEmail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user?.email,
      });
      
      if (error) {
        setError({ message: error.message, code: error.code });
        toast.error("Failed to send verification email: " + error.message);
        return;
      }
      
      toast.success("Verification email sent");
    } catch (err: any) {
      setError({ message: err.message });
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    sendVerificationEmail,
    isAuthenticated: !!user,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
