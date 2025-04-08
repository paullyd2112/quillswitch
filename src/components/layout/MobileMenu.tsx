
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
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
  const { user } = useAuth();
  
  return (
    <div 
      className={cn(
        "fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out",
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
              className="flex items-center py-3 px-4 rounded-md hover:bg-gray-100"
            >
              {link.icon && (
                <span className="mr-3 text-gray-500">{link.icon}</span>
              )}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
