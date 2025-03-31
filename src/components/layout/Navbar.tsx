
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  FileText,
  Wand2,
  BarChart2,
  UserPlus,
  User,
  Info,
  LayoutDashboard,
  Puzzle,
  BarChart3,
  FileBarChart,
  LifeBuoy,
  Settings as SettingsIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  
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
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (session?.user && event === 'SIGNED_IN') {
          setUser(session.user);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Updated navigation structure based on the new tabs
  const navLinks = [
    { text: "Dashboard", href: "/", icon: <LayoutDashboard size={16} /> },
    { 
      text: "Features & Tools", 
      href: "#", 
      icon: <Puzzle size={16} />,
      children: [
        { text: "API Docs", href: "/api-docs", icon: <FileText size={16} /> },
        { text: "Setup Wizard", href: "/setup", icon: <Wand2 size={16} /> },
        { text: "Analytics", href: "/analytics", icon: <BarChart3 size={16} /> },
        { text: "Migrations", href: "/migrations", icon: <BarChart2 size={16} /> },
      ] 
    },
    { text: "Reports", href: "/reports", icon: <FileBarChart size={16} /> },
    { text: "Resources", href: "/resources", icon: <LifeBuoy size={16} /> },
    { text: "Settings", href: "/settings", icon: <SettingsIcon size={16} /> },
  ];
  
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
          
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/profile">
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5">
                  <User size={16} />
                  <span>Profile</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5">
                  <UserPlus size={16} />
                  <span>Create Account</span>
                </Button>
              </Link>
            )}
            
            <div className="md:hidden">
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
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t dark:border-gray-800">
          <div className="container px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <React.Fragment key={link.href}>
                <Link
                  to={link.href === "#" ? (link.children && link.children.length > 0 ? link.children[0].href : "#") : link.href}
                  className={cn(
                    "block px-4 py-2 text-sm rounded-md transition-colors",
                    (
                      link.href === "/" && location.pathname === "/" ||
                      link.href !== "/" && location.pathname.includes(link.href)
                    )
                      ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 font-medium"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                  onClick={() => link.children ? null : setIsMenuOpen(false)}
                >
                  <span className="flex items-center">
                    {link.icon && <span className="mr-1.5">{link.icon}</span>}
                    {link.text}
                  </span>
                </Link>
                
                {link.children && (
                  <div className="pl-4 mt-1 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className={cn(
                          "block px-4 py-2 text-sm rounded-md transition-colors",
                          location.pathname === child.href
                            ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 font-medium"
                            : "text-muted-foreground hover:bg-accent"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="flex items-center">
                          {child.icon && <span className="mr-1.5">{child.icon}</span>}
                          {child.text}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
            
            {user ? (
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm rounded-md transition-colors text-brand-600 dark:text-brand-400 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className="mr-1.5"><User size={16} /></span>
                  Profile
                </span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="block px-4 py-2 text-sm rounded-md transition-colors text-brand-600 dark:text-brand-400 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className="mr-1.5"><UserPlus size={16} /></span>
                  Create Account
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
