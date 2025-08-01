
import { useState, useMemo } from "react";
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
  passwordStrength: {
    score: number;
    isValid: boolean;
    requirements: Array<{ label: string; passed: boolean; }>;
  };
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

  // Password strength validation
  const passwordStrength = useMemo(() => {
    const requirements = [
      { label: 'At least 8 characters long', test: (p: string) => p.length >= 8 },
      { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
      { label: 'Contains lowercase letter', test: (p: string) => /[a-z]/.test(p) },
      { label: 'Contains number', test: (p: string) => /[0-9]/.test(p) },
      { label: 'Contains special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
    ];

    const results = requirements.map(req => ({
      label: req.label,
      passed: req.test(password)
    }));

    const score = results.filter(r => r.passed).length;
    const isValid = score === requirements.length;

    return { score, isValid, requirements: results };
  }, [password]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast.error("Please accept the terms and privacy policy");
      return;
    }

    if (!passwordStrength.isValid) {
      toast.error("Please ensure your password meets all security requirements");
      return;
    }

    try {
      setIsLoading(true);
      setSignupStatus("idle");
      setErrorMessage("");
      
      const metadata = { full_name: fullName };
      const result = await signUp(email, password, metadata);

      if (result?.error) {
        console.error("Signup error:", result.error);
        setSignupStatus("error");
        setErrorMessage(result.error.message);
        return;
      }

      // Check if email confirmation is required
      if (result?.emailConfirmationSent) {
        toast.success("Check your email to confirm your account");
      } else {
        toast.success("Account created successfully!");
      }
      
      setSignupStatus("success");
      
      // After a delay, redirect to demo page for new users
      setTimeout(() => {
        navigate("/demo");
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
    passwordStrength,
    handleSignUp,
    handleGoogleSignIn
  };
};
