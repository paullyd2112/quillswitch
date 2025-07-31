
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { sessionManager } from "@/utils/secureStorage";
import { logger } from "@/utils/logging/productionLogger";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logger.debug('Auth', 'Auth state changed', { event });
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle secure session management
        if (session) {
          // Start secure session (defer async operations to avoid blocking)
          setTimeout(() => {
            sessionManager.startSession(session.user.id, {
              email: session.user.email,
              role: session.user.role
            }).catch(error => {
              console.error('Failed to start secure session:', error);
            });
          }, 0);
          
          // Show toast for successful sign-in or recovery
          if (event === 'SIGNED_IN') {
            toast.success("Successfully signed in!");
          } else if (event === 'PASSWORD_RECOVERY') {
            toast.success("Password reset successful!");
          }
        } else {
          // End secure session and clear all sensitive data
          sessionManager.endSession();
          
          // Show toast for sign-out
          if (event === 'SIGNED_OUT') {
            toast.success("Signed out successfully");
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      logger.debug('Auth', 'Initial session check', { hasSession: !!session });
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

  return { session, user, isLoading, setIsLoading };
}
