
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
      navigate("/app/dashboard");
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
      
      const result = await signInWithGoogle();
      
      if (result?.error) {
        console.error('Google sign in error:', result.error);
        
        // Provide more specific error messages for common Google OAuth issues
        let errorMessage = result.error.message;
        
        if (errorMessage.includes('provider is not enabled')) {
          errorMessage = "Google sign-in is not configured. Please contact support or use email/password login.";
        } else if (errorMessage.includes('redirect_uri_mismatch')) {
          errorMessage = "Google sign-in configuration error. Please check Authentication settings in Supabase.";
        } else if (errorMessage.includes('invalid_client')) {
          errorMessage = "Google authentication service is temporarily unavailable.";
        } else if (errorMessage.includes('refused to connect')) {
          errorMessage = "Google sign-in blocked. This may be due to browser security settings.";
        }
        
        toast.error(errorMessage);
        return;
      }
      
      // Google OAuth redirect will handle the rest
      toast.success("Redirecting to Google...");
      
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
          <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
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
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
