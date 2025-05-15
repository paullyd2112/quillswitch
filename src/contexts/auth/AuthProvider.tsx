
import React, { createContext, useState, useEffect, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "./types";
import { signIn, signInWithGoogle, signOut, signUp, resetPassword } from "./authMethods";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isLoading: true,
  signIn: async () => ({ error: new Error("Not implemented") }),
  signUp: async () => ({ error: new Error("Not implemented") }),
  signOut: async () => ({ error: new Error("Not implemented") }),
  resetPassword: async () => ({ error: new Error("Not implemented") }),
  signInWithGoogle: async () => ({ error: new Error("Not implemented") }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const initSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Implement auth methods using our authMethods utility functions
  const handleSignIn = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  const handleSignUp = async (email: string, password: string, metadata = {}) => {
    return await signUp(email, password);
  };

  const handleSignOut = async () => {
    return await signOut(setLoading);
  };

  const handleResetPassword = async (email: string) => {
    return await resetPassword(email, setLoading);
  };

  const handleSignInWithGoogle = async () => {
    return await signInWithGoogle(setLoading);
  };

  const value = {
    user,
    session,
    loading,
    isLoading: loading, // Added for backwards compatibility
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    signInWithGoogle: handleSignInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
