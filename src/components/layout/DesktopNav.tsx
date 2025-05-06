
import React from "react";
import { NavLink } from "react-router-dom";
import { NavItem } from "./types";

interface DesktopNavProps {
  navLinks: NavItem[];
}

const DesktopNav = ({ navLinks }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) => 
            `px-4 py-2 rounded-md text-sm transition-colors duration-200 ${
              isActive
                ? "text-modern-accent bg-modern-card"
                : "text-modern-text-secondary hover:text-modern-text-primary hover:bg-modern-card/60"
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
