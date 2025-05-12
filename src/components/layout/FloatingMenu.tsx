
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { mainNav, userNav, getNavLinksByCategory } from "./navConfig";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Combine navigation links based on authentication
  const navLinks = user ? [...mainNav, ...userNav] : mainNav;
  
  // Group links by category
  const categorizedLinks = getNavLinksByCategory(navLinks);
  const categories = Object.keys(categorizedLinks);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Simple FAB that shows all links
  const renderSimpleFAB = () => {
    return (
      <>
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
                location.pathname === item.href ? "bg-friendly-accent/20 border-l-2 border-friendly-accent" : "",
                // Staggered animation delay based on index
                index === 0 
                  ? "delay-0" 
                  : `delay-[${index * 50}ms]`
              )}
            >
              <span className="text-friendly-text-primary whitespace-nowrap">{item.label}</span>
              <span className={cn(
                "text-friendly-accent",
                location.pathname === item.href ? "text-friendly-accent" : "text-friendly-text-secondary"
              )}>{item.icon}</span>
            </Link>
          ))}
        </div>
      </>
    );
  };

  // Advanced FAB with dropdown categories
  const renderAdvancedFAB = () => {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className={cn(
              "h-14 w-14 rounded-full shadow-lg transition-transform duration-200",
              isOpen ? "rotate-45" : ""
            )}
          >
            {isOpen ? <X size={24} /> : <Plus size={24} />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 max-h-[70vh] overflow-y-auto"
          sideOffset={16}
        >
          {categories.map((category, index) => (
            <React.Fragment key={category}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel>{category}</DropdownMenuLabel>
              <DropdownMenuGroup>
                {categorizedLinks[category].map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link 
                      to={item.href} 
                      className={cn(
                        "flex items-center cursor-pointer",
                        location.pathname === item.href ? "bg-friendly-accent/20" : ""
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Backdrop that closes the menu when clicked */}
      {isOpen && !document.querySelector('[role="dialog"]') && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Toggle between simple and dropdown FAB formats */}
      {renderAdvancedFAB()}
    </div>
  );
};

export default FloatingMenu;
