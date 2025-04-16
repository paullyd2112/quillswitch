
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAuthState() {
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

  return { session, user, isLoading, setIsLoading };
}
