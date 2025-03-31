import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Mail, Globe, Lock } from "lucide-react";
import { Provider } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast.error("Please accept the terms and privacy policy");
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data) {
        toast.success("Check your email for the confirmation link!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data) {
        toast.success("Signed in successfully!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Check your email for the password reset link!");
      setForgotPasswordOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the function to use proper Provider type from Supabase
  const handleSSOSignIn = async (provider: Provider) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

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
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold">Login</CardTitle>
                <CardDescription>Enter your email and password to login</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="example@email.com" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <button 
                        type="button" 
                        className="text-sm text-muted-foreground hover:text-primary"
                        onClick={() => setForgotPasswordOpen(true)}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSSOSignIn("google")}
                      disabled={isLoading}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Google</span>
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSSOSignIn("azure")}
                      disabled={isLoading}
                    >
                      <Globe className="h-4 w-4" />
                      <span className="sr-only">Microsoft</span>
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSSOSignIn("yahoo_oidc")}
                      disabled={isLoading}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.5,2.3c0.7,0.9,2.6,3.9,4.6,8.6c2.3,5.4,4,11.4,4.1,11.6l0.1,0.2h-3.7L18.3,22c-0.2-1-1.2-4.2-3-8.8C13,8.1,11.3,5,11.3,5h0c0,0-2,4.5-3.4,8C6,17,4.6,22,4.6,22H1l0.1-0.2C1.1,21.7,3,15.4,5.7,9.1c2-4.8,3.5-6.8,4.2-7.6c-1,0.1-2.3,0.1-3.5,0.1c-1.8,0-2.7-0.1-5.1-0.3l0-2.9C4.9,0,7,1.2,9,1.2c0.8,0,1.8-0.1,2.7-0.4c0.2-0.1,0.5-0.2,0.7-0.3C12.7,0.4,13,0.3,13.1,0.2C13.3,0.1,13.7,0,14,0h0c0.2,0,0.3,0.1,0.5,0.1l0,0c0.4,0.2,0.5,0.3,0.5,0.3l0,0.5c0,0.1,0,0.2-0.1,0.3c-0.3,0.5-0.7,0.8-1.5,1.1L13.5,2.3z" />
                      </svg>
                      <span className="sr-only">Yahoo</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold">Create an account</CardTitle>
                <CardDescription>Enter your details to create a new account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="example@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                      id="terms" 
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </Label>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSSOSignIn("google")}
                      disabled={isLoading}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Google</span>
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSSOSignIn("azure")}
                      disabled={isLoading}
                    >
                      <Globe className="h-4 w-4" />
                      <span className="sr-only">Microsoft</span>
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSSOSignIn("yahoo_oidc")}
                      disabled={isLoading}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.5,2.3c0.7,0.9,2.6,3.9,4.6,8.6c2.3,5.4,4,11.4,4.1,11.6l0.1,0.2h-3.7L18.3,22c-0.2-1-1.2-4.2-3-8.8C13,8.1,11.3,5,11.3,5h0c0,0-2,4.5-3.4,8C6,17,4.6,22,4.6,22H1l0.1-0.2C1.1,21.7,3,15.4,5.7,9.1c2-4.8,3.5-6.8,4.2-7.6c-1,0.1-2.3,0.1-3.5,0.1c-1.8,0-2.7-0.1-5.1-0.3l0-2.9C4.9,0,7,1.2,9,1.2c0.8,0,1.8-0.1,2.7-0.4c0.2-0.1,0.5-0.2,0.7-0.3C12.7,0.4,13,0.3,13.1,0.2C13.3,0.1,13.7,0,14,0h0c0.2,0,0.3,0.1,0.5,0.1l0,0c0.4,0.2,0.5,0.3,0.5,0.3l0,0.5c0,0.1,0,0.2-0.1,0.3c-0.3,0.5-0.7,0.8-1.5,1.1L13.5,2.3z" />
                      </svg>
                      <span className="sr-only">Yahoo</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Enter your email address and we will send you a link to reset your password.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input 
                  id="forgot-email" 
                  type="email" 
                  placeholder="example@email.com" 
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setForgotPasswordOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Auth;
