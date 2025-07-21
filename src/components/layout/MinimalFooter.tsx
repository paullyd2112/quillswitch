
import React from "react";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const MinimalFooter = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">QuillSwitch</span>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
          
          {/* Security Indicator */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Shield className="h-4 w-4 text-blue-400" />
            <span>Bank-level Security</span>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-center text-sm text-slate-500">
          © 2024 QuillSwitch. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;
