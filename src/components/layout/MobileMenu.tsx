
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  user: any;
  onClose: () => void;
}

export interface NavLink {
  text: string;
  href: string;
  icon: React.ReactNode;
  children?: {
    text: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, navLinks, user, onClose }) => {
  const location = useLocation();
  
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t dark:border-gray-800">
      <div className="container px-4 py-4 space-y-1">
        {navLinks.map((link) => (
          <React.Fragment key={link.href}>
            <Link
              to={link.href === "#" ? (link.children && link.children.length > 0 ? link.children[0].href : "#") : link.href}
              className={cn(
                "block px-4 py-2 text-sm rounded-md transition-colors",
                (
                  link.href === "/" && location.pathname === "/" ||
                  link.href !== "/" && location.pathname.includes(link.href)
                )
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 font-medium"
                  : "text-muted-foreground hover:bg-accent"
              )}
              onClick={() => link.children ? null : onClose()}
            >
              <span className="flex items-center">
                {link.icon && <span className="mr-1.5">{link.icon}</span>}
                {link.text}
              </span>
            </Link>
            
            {link.children && (
              <div className="pl-4 mt-1 space-y-1">
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className={cn(
                      "block px-4 py-2 text-sm rounded-md transition-colors",
                      location.pathname === child.href
                        ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 font-medium"
                        : "text-muted-foreground hover:bg-accent"
                    )}
                    onClick={() => onClose()}
                  >
                    <span className="flex items-center">
                      {child.icon && <span className="mr-1.5">{child.icon}</span>}
                      {child.text}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
        
        {user ? (
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm rounded-md transition-colors text-brand-600 dark:text-brand-400 hover:bg-accent"
            onClick={() => onClose()}
          >
            <span className="flex items-center">
              <span className="mr-1.5"><User size={16} /></span>
              Profile
            </span>
          </Link>
        ) : (
          <Link
            to="/auth"
            className="block px-4 py-2 text-sm rounded-md transition-colors text-brand-600 dark:text-brand-400 hover:bg-accent"
            onClick={() => onClose()}
          >
            <span className="flex items-center">
              <span className="mr-1.5"><LogIn size={16} /></span>
              Login / Signup
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
