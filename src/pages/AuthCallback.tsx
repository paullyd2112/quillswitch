
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          toast.success("Signed in successfully");
          navigate("/migrations");
        } else {
          // If there's no error but also no session, something went wrong
          throw new Error("Authentication failed");
        }
      } catch (error: any) {
        toast.error(error.message || "Authentication failed");
        navigate("/auth");
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-medium">Completing authentication...</h2>
        <p className="text-muted-foreground mt-2">You will be redirected shortly</p>
      </div>
    </div>
  );
};

export default AuthCallback;
