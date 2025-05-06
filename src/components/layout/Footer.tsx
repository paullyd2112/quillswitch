
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-friendly-card py-12 px-4 md:px-8 border-t border-friendly-border">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-friendly-text-primary">QuillSwitch</h3>
            <p className="text-friendly-text-secondary">
              Simplifying CRM migrations with intelligent, secure, and efficient tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-friendly-text-primary">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-friendly-text-secondary hover:text-friendly-accent transition-colors">Features</Link></li>
              <li><Link to="/migrations/setup" className="text-friendly-text-secondary hover:text-friendly-accent transition-colors">Start Migration</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-friendly-text-primary">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/api-docs" className="text-friendly-text-secondary hover:text-friendly-accent transition-colors">API Documentation</Link></li>
              <li><Link to="/about" className="text-friendly-text-secondary hover:text-friendly-accent transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-friendly-text-primary">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-friendly-text-secondary hover:text-friendly-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-friendly-text-secondary hover:text-friendly-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-friendly-border text-center">
          <p className="text-friendly-text-secondary">
            © {new Date().getFullYear()} QuillSwitch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
