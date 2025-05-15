
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthContextType, User, AuthError } from "./types";
import { toast } from "sonner";
import { signIn, signUp, signInWithGoogle, resetPassword, signOut } from "./authMethods";

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
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        
        // Subscribe to auth changes
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (session?.user) {
              const userData: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name,
                avatar_url: session.user.user_metadata?.avatar_url,
                created_at: session.user.created_at,
              };
              setUser(userData);
            } else {
              setUser(null);
            }
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
  
  // Sign in with email and password wrapper function
  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      return await signIn(email, password);
    } finally {
      setLoading(false);
    }
  };
  
  // Sign up with email and password wrapper function
  const handleSignUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      setError(null);
      return await signUp(email, password);
    } finally {
      setLoading(false);
    }
  };
  
  // Sign in with Google wrapper function
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      return await signInWithGoogle(setLoading);
    } catch (error) {
      return { error: error as AuthError };
    }
  };
  
  // Sign out wrapper function
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(setLoading);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password wrapper function
  const handleResetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      return await resetPassword(email, setLoading);
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
  
  const value: AuthContextType = {
    user,
    loading,
    isLoading: loading, // Alias for isLoading
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updateProfile,
    sendVerificationEmail,
    isAuthenticated: !!user,
    signInWithGoogle: handleGoogleSignIn,
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
