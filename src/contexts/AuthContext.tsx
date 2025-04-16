
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null; emailConfirmationSent?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null; emailSent?: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Store auth status in localStorage for quick access
        if (session) {
          localStorage.setItem("isAuthenticated", "true");
          
          // Show toast for successful sign-in or recovery
          if (event === 'SIGNED_IN') {
            toast.success("Successfully signed in!");
          } else if (event === 'PASSWORD_RECOVERY') {
            toast.success("Password reset successful!");
          }
        } else {
          localStorage.removeItem("isAuthenticated");
          
          // Show toast for sign-out
          if (event === 'SIGNED_OUT') {
            toast.success("Signed out successfully");
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session found" : "No session");
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch(error => {
      console.error("Error checking session:", error);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in with email:", email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        let errorMessage = "Failed to sign in";
        
        // Provide more user-friendly error messages
        if (error.message.includes("Invalid login")) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email to confirm your account before signing in.";
        }
        
        toast.error(errorMessage);
      }
      
      return { error };
    } catch (error) {
      console.error("Unexpected error signing in:", error);
      toast.error("An unexpected error occurred. Please try again later.");
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Attempting sign up with email:", email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`
        }
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        let errorMessage = "Failed to create account";
        
        // Provide more user-friendly error messages
        if (error.message.includes("already registered")) {
          errorMessage = "This email is already registered. Please sign in instead.";
        } else if (error.message.includes("password")) {
          errorMessage = "Password must be at least 6 characters long.";
        }
        
        toast.error(errorMessage);
        return { error };
      }
      
      // Check if user was created but email confirmation is required
      const isEmailConfirmationRequired = data.user && !data.user.confirmed_at;
      
      if (data.user) {
        console.log("Sign up successful, user created:", data.user.id);
        
        // Check if this is an existing user (identities length is 0)
        if (data.user.identities?.length === 0) {
          toast.error("This email is already registered. Please sign in instead.");
          return { error: new Error("User already exists") as unknown as AuthError };
        }
        
        if (isEmailConfirmationRequired) {
          toast.success("Account created! Please check your email to confirm your account.");
          return { error: null, emailConfirmationSent: true };
        } else {
          toast.success("Account created successfully!");
        }
      }
      
      return { error: null };
    } catch (error) {
      console.error("Unexpected error signing up:", error);
      toast.error("An unexpected error occurred. Please try again later.");
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user");
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Error signing out: " + error.message);
      }
    } catch (error) {
      console.error("Unexpected error signing out:", error);
      toast.error("An unexpected error occurred while signing out.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log("Requesting password reset for:", email);
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error.message);
        toast.error("Failed to send password reset email: " + error.message);
        return { error };
      }
      
      toast.success("Password reset email sent. Please check your inbox.");
      return { error: null, emailSent: true };
    } catch (error) {
      console.error("Unexpected error resetting password:", error);
      toast.error("An unexpected error occurred. Please try again later.");
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
