
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { NavLink } from "./navConfig";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, navLinks, onClose }) => {
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
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
