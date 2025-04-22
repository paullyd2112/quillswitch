
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 py-12 px-4 md:px-8">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">QuillSwitch</h3>
            <p className="text-slate-400">
              Simplifying CRM migrations with intelligent, secure, and efficient tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-slate-400 hover:text-white">Features</Link></li>
              <li><Link to="/pricing" className="text-slate-400 hover:text-white">Pricing</Link></li>
              <li><Link to="/migrations/setup" className="text-slate-400 hover:text-white">Start Migration</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/knowledge-base" className="text-slate-400 hover:text-white">Knowledge Base</Link></li>
              <li><Link to="/api-docs" className="text-slate-400 hover:text-white">API Documentation</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-slate-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500">
            © {new Date().getFullYear()} QuillSwitch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
