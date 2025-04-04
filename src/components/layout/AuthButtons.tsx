
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthButtonsProps {
  user: any;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <Link to="/profile">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5">
              <User size={16} />
              <span>{user.email?.split('@')[0] || 'Profile'}</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex items-center gap-1.5"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/auth/login">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5">
              <LogIn size={16} />
              <span>Login</span>
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button size="sm" className="hidden md:flex items-center gap-1.5">
              <User size={16} />
              <span>Sign Up</span>
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthButtons;
