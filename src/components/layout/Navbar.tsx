
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
import { useAuth } from "@/contexts/auth";

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
        "fixed top-0 left-0 right-0 w-full z-[100] transition-colors duration-200", 
        isScrolled 
          ? "bg-slate-950/95 backdrop-blur-md border-b border-slate-800" 
          : "bg-transparent" // Explicitly set to transparent for initial state
      )}
    >
      <div className="container px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-semibold">Q</div>
              <span className="font-medium text-lg text-white">QuillSwitch</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <DesktopNav navLinks={navLinks} />
          
          <div className="flex items-center gap-2">
            {/* Auth Buttons Component */}
            <AuthButtons />
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 text-white"
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
