import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Shield, UserPlus, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from '@supabase/auth-helpers-react';

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<'select' | 'signup' | 'signin'>('select');

  // Force logout first if there's a session but user is on auth page
  useEffect(() => {
    const checkAndClearSession = async () => {
      if (session) {
        console.log('Clearing existing session for fresh login');
        await supabase.auth.signOut();
      }
    };
    checkAndClearSession();
  }, []);

  // Only redirect after successful auth operations, not on page load

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setError("This email is already registered. Please try signing in instead.");
        } else {
          setError(error.message);
        }
      } else {
        setSuccess("Account created successfully! You can now sign in.");
        // Automatically switch to sign in mode after successful signup
        setTimeout(() => {
          setMode('signin');
          setSuccess(null);
        }, 2000);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else {
          setError(error.message);
        }
      }

      if (!error) {
        // Only navigate on successful login
        navigate("/app/setup");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app/setup`
        }
      });

      if (error) {
        setError(`Failed to sign in with Google: ${error.message}`);
      }
    } catch (error) {
      setError("An unexpected error occurred with Google sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to home button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

{mode === 'select' ? (
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">QuillSwitch</span>
              </div>
              <CardTitle className="text-2xl text-white">Get Started</CardTitle>
              <CardDescription className="text-slate-400">
                Create your account or sign in to begin your CRM migration
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Button
                  onClick={() => setMode('signup')}
                  className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg"
                  size="lg"
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Create Account</div>
                      <div className="text-xs text-blue-100">New to QuillSwitch</div>
                    </div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => setMode('signin')}
                  variant="outline"
                  className="w-full h-16 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                  size="lg"
                >
                  <div className="flex items-center gap-3">
                    <LogIn className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Sign In</div>
                      <div className="text-xs text-slate-400">Already have an account</div>
                    </div>
                  </div>
                </Button>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  By creating an account, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Button
                variant="ghost"
                onClick={() => setMode('select')}
                className="mb-2 text-slate-400 hover:text-white self-start"
                size="sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">QuillSwitch</span>
              </div>
              <CardTitle className="text-2xl text-white">
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {mode === 'signup' 
                  ? 'Enter your details to create a new account'
                  : 'Welcome back! Please sign in to your account'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert className="border-red-500/20 bg-red-500/10 mb-4">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500/20 bg-green-500/10 mb-4">
                  <AlertDescription className="text-green-400">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={mode === 'signup' ? handleSignUp : handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>
                 <div className="space-y-2">
                   <Label htmlFor="password" className="text-slate-300">Password</Label>
                   <Input
                     id="password"
                     type="password"
                     placeholder={mode === 'signup' ? "Create a password" : "Enter your password"}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     minLength={mode === 'signup' ? 6 : undefined}
                     className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                   />
                 </div>
                 {mode === 'signup' && (
                   <div className="space-y-2">
                     <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                     <Input
                       id="confirmPassword"
                       type="password"
                       placeholder="Confirm your password"
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       required
                       className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                     />
                   </div>
                 )}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    mode === 'signup' ? 'Create Account' : 'Sign In'
                  )}
                 </Button>
               </form>

               <div className="mt-6">
                 <div className="relative">
                   <div className="absolute inset-0 flex items-center">
                     <span className="w-full border-t border-slate-700" />
                   </div>
                   <div className="relative flex justify-center text-xs uppercase">
                     <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
                   </div>
                 </div>
                 
                 <Button
                   type="button"
                   variant="outline"
                   onClick={handleGoogleSignIn}
                   disabled={loading}
                   className="w-full mt-4 bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-white"
                 >
                   {loading ? (
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   ) : (
                     <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                       <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                       <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                       <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                       <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                     </svg>
                   )}
                   Continue with Google
                 </Button>
               </div>

               <div className="mt-6 text-center">
                 <Button
                   variant="link"
                   onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                   className="text-sm text-slate-400 hover:text-white"
                 >
                   {mode === 'signup' 
                     ? 'Already have an account? Sign in'
                     : "Don't have an account? Create one"
                   }
                 </Button>
               </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Auth;