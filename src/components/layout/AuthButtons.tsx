
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Settings, Shield, KeyRound } from "lucide-react";

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
    // Clear any sensitive data from localStorage before logout
    localStorage.removeItem("lastMigrationData");
    localStorage.removeItem("tempUserSettings");
    
    await signOut();
    navigate("/");
    setOpen(false);
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleRegister = () => {
    navigate("/auth");
  };

  const handleProfileSettings = () => {
    navigate("/profile");
    setOpen(false);
  };

  const handleAccountSettings = () => {
    navigate("/settings");
    setOpen(false);
  };

  const handleBillingSettings = () => {
    navigate("/settings?tab=billing");
    setOpen(false);
  };

  const handleSecuritySettings = () => {
    navigate("/settings?tab=security");
    setOpen(false);
  };

  const handleCredentialsVault = () => {
    navigate("/credentials-vault");
    setOpen(false);
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
          <DropdownMenuItem onClick={handleProfileSettings} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAccountSettings} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleBillingSettings} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Billing & Subscription</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSecuritySettings} className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>Security & Privacy</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCredentialsVault} className="cursor-pointer">
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Credentials Vault</span>
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
