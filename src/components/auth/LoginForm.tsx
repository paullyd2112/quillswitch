
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface LoginFormProps {
  openForgotPassword: () => void;
}

const LoginForm = ({ openForgotPassword }: LoginFormProps) => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const result = await signIn(loginEmail, loginPassword);

      if (result?.error) {
        console.error('Sign in error:', result.error);
        toast.error(result.error.message || "Failed to sign in");
        return;
      }

      toast.success("Signed in successfully!");
      navigate("/");
    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      console.log('Attempting Google sign in...');
      
      // Check if we're in a development environment
      const isDevelopment = window.location.hostname === 'localhost';
      console.log('Environment:', isDevelopment ? 'development' : 'production');
      
      const result = await signInWithGoogle();
      
      if (result?.error) {
        console.error('Google sign in error:', result.error);
        
        // Provide more specific error messages for common Google OAuth issues
        let errorMessage = result.error.message;
        
        if (errorMessage.includes('provider is not enabled')) {
          errorMessage = "Google sign-in is not configured. Please contact support or use email/password login.";
        } else if (errorMessage.includes('redirect_uri_mismatch')) {
          errorMessage = "Google sign-in configuration error. Please verify the redirect URLs in your Google Cloud Console.";
        } else if (errorMessage.includes('invalid_client')) {
          errorMessage = "Google authentication service is temporarily unavailable.";
        } else if (errorMessage.includes('refused to connect')) {
          errorMessage = "Google sign-in blocked. This may be due to browser security settings or configuration issues.";
        }
        
        toast.error(errorMessage);
        return;
      }
      
      // Note: For OAuth flows, the actual redirect happens in the browser
      // The user will be redirected to Google, then back to our app
      console.log('Google OAuth redirect initiated successfully');
      
    } catch (error: any) {
      console.error('Unexpected Google sign in error:', error);
      toast.error("Failed to start Google sign-in. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
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
                onClick={openForgotPassword}
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
          
          <Button
            variant="outline"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            className="w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            {isGoogleLoading ? "Redirecting to Google..." : "Sign in with Google"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
