
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavLink } from "./MobileMenu";

interface DesktopNavProps {
  navLinks: NavLink[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ navLinks }) => {
  const location = useLocation();
  
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navLinks.map((link) => (
        <div key={link.href} className="relative group">
          <Link
            to={link.href}
            className={cn(
              "px-3 py-2 text-sm rounded-md transition-colors flex items-center",
              (
                link.href === "/" && location.pathname === "/" ||
                link.href !== "/" && location.pathname.includes(link.href)
              )
                ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <span className="flex items-center">
              {link.icon && <span className="mr-1.5">{link.icon}</span>}
              {link.label}
            </span>
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default DesktopNav;
