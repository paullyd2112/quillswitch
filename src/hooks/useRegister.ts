
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export type SignupStatus = "idle" | "success" | "error";

export interface UseRegisterReturn {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  acceptTerms: boolean;
  setAcceptTerms: (value: boolean) => void;
  isLoading: boolean;
  signupStatus: SignupStatus;
  errorMessage: string;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
}

export const useRegister = (): UseRegisterReturn => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [signupStatus, setSignupStatus] = useState<SignupStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast.error("Please accept the terms and privacy policy");
      return;
    }

    try {
      setIsLoading(true);
      setSignupStatus("idle");
      setErrorMessage("");
      
      const result = await signUp(email, password);

      if (result?.error) {
        console.error("Signup error:", result.error);
        setSignupStatus("error");
        setErrorMessage(result.error.message);
        return;
      }

      // Only update user metadata if signup was successful
      if (result?.emailConfirmationSent) {
        // Update user metadata with full name
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { full_name: fullName }
        });
        
        if (metadataError) {
          console.error("Error updating user metadata:", metadataError);
          // Non-critical error, continue with signup flow
        }
      }
      
      setSignupStatus("success");
      
      // After a delay, redirect to welcome page
      setTimeout(() => {
        navigate("/welcome");
      }, 1500);
      
    } catch (error: any) {
      console.error("Unexpected error during signup:", error);
      setSignupStatus("error");
      setErrorMessage(error.message || "Something went wrong");
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();

      if (result?.error) {
        console.error("Google signin error:", result.error);
        toast.error(result.error.message);
      }
    } catch (error: any) {
      console.error("Unexpected error during Google signin:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    acceptTerms,
    setAcceptTerms,
    isLoading,
    signupStatus,
    errorMessage,
    handleSignUp,
    handleGoogleSignIn
  };
};
