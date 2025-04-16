
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  FormStatusAlert,
  NameInput,
  EmailInput,
  PasswordInput,
  TermsCheckbox,
  GoogleSignInButton,
  SubmitButton
} from "./RegisterFormComponents";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [signupStatus, setSignupStatus] = useState<"idle" | "success" | "error">("idle");
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
      
      const { error, emailConfirmationSent } = await signUp(email, password);

      if (error) {
        console.error("Signup error:", error);
        setSignupStatus("error");
        setErrorMessage(error.message);
        return;
      }

      // Only update user metadata if signup was successful
      if (!emailConfirmationSent) {
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/welcome`,
        }
      });

      if (error) {
        console.error("Google signin error:", error);
        toast.error(error.message);
      }
    } catch (error: any) {
      console.error("Unexpected error during Google signin:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">Create an account</CardTitle>
        <CardDescription>Enter your details to create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <FormStatusAlert status={signupStatus} errorMessage={errorMessage} />
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <NameInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
          <TermsCheckbox checked={acceptTerms} onCheckedChange={setAcceptTerms} />
          <SubmitButton isLoading={isLoading} />
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>
          
          <GoogleSignInButton onClick={handleGoogleSignIn} isLoading={isLoading} />
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
