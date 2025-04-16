
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";

export async function signIn(email: string, password: string) {
  try {
    console.log("Attempting sign in with email:", email);
    
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
  }
}

export async function signUp(email: string, password: string) {
  try {
    console.log("Attempting sign up with email:", email);
    
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
  }
}

export async function signOut(setIsLoading: (loading: boolean) => void) {
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
}

export async function resetPassword(email: string, setIsLoading: (loading: boolean) => void) {
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
}
