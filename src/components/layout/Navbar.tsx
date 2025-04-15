
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// Import our components
import MobileMenu from "./MobileMenu";
import DesktopNav from "./DesktopNav";
import AuthButtons from "./AuthButtons";
import getNavLinks from "./navConfig";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

// Import performance utilities
import { throttle } from "@/utils/performance";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  // Create memoized navLinks to prevent unnecessary re-renders
  const navLinks = useMemo(() => getNavLinks(user), [user]);
  
  // Create throttled scroll handler for better performance
  const handleScroll = useMemo(() => 
    throttle(() => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }, 100), // Throttle to every 100ms
  []);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    
    // Also close any open dropdowns when route changes
    document.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));
  }, [location.pathname]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
    // If we're closing the menu, also close any open dropdowns
    if (isMenuOpen) {
      document.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    }
  };
  
  return (
    <header
      className={cn(
        "sticky top-0 w-full z-50 transition-all duration-200", 
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm dark:bg-slate-900/95 dark:border-b dark:border-slate-800" 
          : "bg-white dark:bg-slate-900"
      )}
    >
      <div className="container px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-semibold">Q</div>
              <span className="font-medium text-lg dark:text-white">QuillSwitch</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <DesktopNav navLinks={navLinks} />
          
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Auth Buttons Component */}
            <AuthButtons />
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:text-white"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu with improved accessibility */}
      <MobileMenu 
        isOpen={isMenuOpen}
        navLinks={navLinks}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
};

export default Navbar;
