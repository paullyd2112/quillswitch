
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthButtons = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleRegister = () => {
    navigate("/auth/register");
  };

  if (user) {
    return null; // Don't render anything when user is logged in
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
