
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthButtons = ({ user }: { user: any }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleRegister = () => {
    navigate("/auth/register");
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button onClick={handleLogout} variant="outline" size="sm">
          Log out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={handleLogin}>
        Log in
      </Button>
      <Button onClick={handleRegister}>
        Sign up
      </Button>
    </div>
  );
};

export default AuthButtons;
