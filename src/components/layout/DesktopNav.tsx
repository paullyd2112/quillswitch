
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
            to={link.href === "#" ? (link.children && link.children.length > 0 ? link.children[0].href : "#") : link.href}
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
              {link.text}
            </span>
          </Link>
          {link.children && (
            <div className="absolute left-0 mt-1 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className={cn(
                      "block px-4 py-2 text-sm transition-colors",
                      location.pathname === child.href
                        ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 font-medium"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <span className="flex items-center">
                      {child.icon && <span className="mr-1.5">{child.icon}</span>}
                      {child.text}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default DesktopNav;
