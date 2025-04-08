
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Settings } from "lucide-react";

const AuthButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);

  // Close dropdown when location changes
  React.useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setOpen(false);
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleRegister = () => {
    navigate("/auth/register");
  };

  if (user) {
    // Show user avatar with dropdown when signed in
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-brand-100 text-brand-700">
                {user.email ? user.email.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => { navigate("/profile"); setOpen(false); }} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { navigate("/settings"); setOpen(false); }} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Show login/register buttons when not signed in
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
