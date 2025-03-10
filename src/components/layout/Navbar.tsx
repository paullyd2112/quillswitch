
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Menu,
  X,
  Search,
  Bell,
  User,
  Sliders,
} from "lucide-react";

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent",
        className
      )}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-semibold">O</div>
              <span className="font-medium text-lg">Onboardify</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-sm font-medium transition-colors hover:text-brand-500"
            >
              Features
            </a>
            <a
              href="#templates"
              className="text-sm font-medium transition-colors hover:text-brand-500"
            >
              Templates
            </a>
            <a
              href="#workflows"
              className="text-sm font-medium transition-colors hover:text-brand-500"
            >
              Workflows
            </a>
            <a
              href="#analytics"
              className="text-sm font-medium transition-colors hover:text-brand-500"
            >
              Analytics
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
            >
              <Search size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
            >
              <Sliders size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex overflow-hidden rounded-full"
            >
              <User size={20} />
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 p-4 glass-panel border-t animate-fade-in md:hidden">
          <nav className="flex flex-col space-y-4 py-4">
            <a
              href="#features"
              className="text-sm font-medium px-4 py-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#templates"
              className="text-sm font-medium px-4 py-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </a>
            <a
              href="#workflows"
              className="text-sm font-medium px-4 py-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Workflows
            </a>
            <a
              href="#analytics"
              className="text-sm font-medium px-4 py-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Analytics
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
