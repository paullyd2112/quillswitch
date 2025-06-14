
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import DesktopNav from "./DesktopNav";
import AuthButtons from "./AuthButtons";
import { mainNav } from "./navConfig";
import { useAuth } from "@/contexts/auth";
import { useProcessing } from "@/contexts/ProcessingContext";
import { throttle } from "@/utils/performance";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const { isProcessing } = useProcessing();
  const location = useLocation();
  
  // Create throttled scroll handler for better performance
  const handleScroll = React.useMemo(() => 
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
    if (!isProcessing) {
      setIsMenuOpen(!isMenuOpen);
    }
  };
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full transition-all duration-200", 
        isScrolled 
          ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-900 shadow-sm" 
          : "bg-transparent",
        isProcessing ? "z-[50] pointer-events-none" : "z-[100]"
      )}
    >
      <div className="container px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-2", 
                isProcessing && "pointer-events-none opacity-50"
              )}
              onClick={(e) => isProcessing && e.preventDefault()}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-white font-bold">Q</div>
              <span className="font-bold text-lg text-white">QuillSwitch</span>
            </Link>
            
            {/* Desktop Navigation */}
            <DesktopNav navLinks={mainNav} />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Auth Buttons Component */}
            <AuthButtons />
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
                className={cn(
                  "text-white", 
                  isProcessing && "pointer-events-none opacity-50"
                )}
                disabled={isProcessing}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu with improved accessibility */}
      <MobileMenu 
        isOpen={isMenuOpen && !isProcessing}
        navLinks={mainNav}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
};

export default Navbar;
