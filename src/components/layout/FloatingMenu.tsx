
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { mainNav, userNav } from "./navConfig";
import { cn } from "@/lib/utils";

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Combine navigation links based on authentication
  const navLinks = user ? [...mainNav, ...userNav] : mainNav;
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menu items that appear when the FAB is clicked */}
      <div 
        className={cn(
          "absolute bottom-full mb-2 right-0 flex flex-col-reverse items-end space-y-reverse space-y-2",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {navLinks.map((item, index) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 bg-friendly-card px-4 py-2 rounded-lg shadow-lg transition-all transform",
              isOpen 
                ? "translate-y-0 opacity-100" 
                : "translate-y-4 opacity-0",
              "transition-all duration-200",
              // Staggered animation delay based on index
              index === 0 
                ? "delay-0" 
                : `delay-[${index * 50}ms]`
            )}
          >
            <span className="text-friendly-text-primary whitespace-nowrap">{item.label}</span>
            <span className="text-friendly-accent">{item.icon}</span>
          </Link>
        ))}
      </div>
      
      {/* Backdrop that closes the menu when clicked */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* The FAB button itself */}
      <Button
        onClick={toggleMenu}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-transform duration-200",
          isOpen ? "rotate-45" : ""
        )}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </Button>
    </div>
  );
};

export default FloatingMenu;
