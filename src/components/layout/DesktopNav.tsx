
import React from "react";
import { NavLink } from "react-router-dom";
import { NavLink as NavItem } from "./navConfig";

interface DesktopNavProps {
  navLinks: NavItem[];
}

const DesktopNav = ({ navLinks }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center ml-8 space-x-1">
      {navLinks.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) => 
            `px-4 py-2 rounded-sm text-sm transition-colors duration-200 ${
              isActive
                ? "text-friendly-accent bg-friendly-accent/10 font-medium"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
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
