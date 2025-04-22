
import React from "react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
    onClose();
  };
  
  return (
    <div 
      className={cn(
        "fixed inset-x-0 top-16 bottom-0 z-[99] flex flex-col bg-slate-950 border-t border-slate-800 shadow-lg transition-transform duration-300 ease-in-out",
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
              className="flex items-center py-3 px-4 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              {link.icon && (
                <span className="mr-3 text-slate-400">{link.icon}</span>
              )}
              <span>{link.label}</span>
            </Link>
          ))}
          
          {user && (
            <>
              <div className="my-2 border-t border-slate-800"></div>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start py-3 px-4 rounded-md text-red-400 hover:bg-slate-800 hover:text-red-300"
                onClick={handleLogout}
              >
                <LogOut className="mr-3" size={18} />
                <span>Log out</span>
              </Button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
