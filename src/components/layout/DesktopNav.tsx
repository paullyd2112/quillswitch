import React from "react";
import { NavLink } from "react-router-dom";
import { NavLink as NavItem } from "./navConfig";
import { useAuth } from "@/contexts/auth";

interface DesktopNavProps {
  navLinks: NavItem[];
}

const DesktopNav = ({ navLinks }: DesktopNavProps) => {
  const { user } = useAuth();
  
  // Filter navigation links based on authentication status
  const filteredLinks = navLinks.filter(link => {
    // If the link requires auth and user is not logged in, don't show it
    if (link.isAuthRequired && !user) return false;
    // Otherwise show the link
    return true;
  });

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {filteredLinks.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) => 
            `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default DesktopNav;
