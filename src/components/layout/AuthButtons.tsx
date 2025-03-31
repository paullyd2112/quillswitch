
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";

interface AuthButtonsProps {
  user: any;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ user }) => {
  return (
    <>
      {user ? (
        <Link to="/profile">
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5">
            <User size={16} />
            <span>Profile</span>
          </Button>
        </Link>
      ) : (
        <Link to="/auth">
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5">
            <LogIn size={16} />
            <span>Login / Signup</span>
          </Button>
        </Link>
      )}
    </>
  );
};

export default AuthButtons;
