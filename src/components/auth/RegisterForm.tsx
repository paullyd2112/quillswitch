
import React from "react";
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
import { useRegister } from "@/hooks/useRegister";

const RegisterForm: React.FC = () => {
  const {
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
  } = useRegister();

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
