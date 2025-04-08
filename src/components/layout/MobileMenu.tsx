
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, navLinks, onClose }) => {
  const { user, signOut } = useAuth();
  
  return (
    <div 
      className={cn(
        "fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out",
        isOpen ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={onClose}
              className="flex items-center py-3 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {link.icon && (
                <span className="mr-3 text-gray-500 dark:text-gray-400">{link.icon}</span>
              )}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.user_metadata?.full_name || 'Account'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              asChild
            >
              <Link to="/settings">
                <User className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => {
                signOut();
                onClose();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
