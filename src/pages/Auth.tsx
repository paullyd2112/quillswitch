
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const Auth = () => {
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to QuillSwitch</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account or create a new one</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
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
