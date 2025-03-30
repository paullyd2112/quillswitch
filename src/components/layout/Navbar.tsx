
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  FileText,
  Wand2,
  BarChart2,
  LogOut,
  User
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Only show these links when logged in
  const authenticatedLinks = [
    { text: "Dashboard", href: "/migrations" },
    { text: "Setup Wizard", href: "/setup", icon: <Wand2 size={16} /> },
    { text: "Analytics", href: "/analytics", icon: <BarChart2 size={16} /> },
  ];
  
  // Always show these links
  const publicLinks = [
    { text: "API Docs", href: "/api-docs", icon: <FileText size={16} /> },
  ];
  
  // Determine which links to show based on authentication status
  const navLinks = user ? [...authenticatedLinks, ...publicLinks] : publicLinks;

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-200",
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-semibold">Q</div>
              <span className="font-medium text-lg">QuillSwitch</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3 py-2 text-sm rounded-md transition-colors",
                  location.pathname === link.href
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <span className="flex items-center">
                  {link.icon && <span className="mr-1.5">{link.icon}</span>}
                  {link.text}
                </span>
              </Link>
            ))}

            {!user ? (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center">
                    <User className="mr-2 h-4 w-4" /> 
                    {user.user_metadata?.full_name || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="flex items-center text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
          
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t dark:border-gray-800">
          <div className="container px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "block px-4 py-2 text-sm rounded-md transition-colors",
                  location.pathname === link.href
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 font-medium"
                    : "text-muted-foreground hover:bg-accent"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  {link.icon && <span className="mr-1.5">{link.icon}</span>}
                  {link.text}
                </span>
              </Link>
            ))}

            {!user ? (
              <Link 
                to="/auth" 
                className="block px-4 py-2 mt-2 text-sm bg-primary text-primary-foreground rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            ) : (
              <button 
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 mt-2 text-sm text-red-600 rounded-md hover:bg-accent"
              >
                <LogOut className="mr-1.5 h-4 w-4" /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
