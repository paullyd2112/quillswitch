
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useAuth } from "@/contexts/auth";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const tier = searchParams.get("tier"); // Preserve tier for RegisterForm if needed
  const { user, isLoading } = useAuth();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Check if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      // User is logged in, redirect to dashboard or specified redirect
      const redirectPath = searchParams.get("redirect") || "/app/dashboard"; // Default to dashboard
      navigate(redirectPath, { replace: true });
    }
  }, [user, isLoading, navigate, searchParams]);
  
  // Set active tab based on route param
  useEffect(() => {
    if (mode === "register") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [mode]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't show auth page if user is already logged in (should be caught by useEffect above)
  if (user) {
    return null;
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to QuillSwitch</h1>
          <p className="mt-2 text-muted-foreground">
            {activeTab === "login" ? "Sign in to your account" : "Create a new account"}
            {tier && activeTab === "register" && ` for the ${tier} plan`}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm openForgotPassword={() => setForgotPasswordOpen(true)} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
        
        <ForgotPasswordForm 
          isOpen={forgotPasswordOpen} 
          onOpenChange={setForgotPasswordOpen}
        />
      </div>
    </div>
  );
};

export default Auth;
