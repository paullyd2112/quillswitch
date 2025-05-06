
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-modern-card py-12 px-4 md:px-8 border-t border-modern-border">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-modern-text-primary">QuillSwitch</h3>
            <p className="text-modern-text-secondary">
              Simplifying CRM migrations with intelligent, secure, and efficient tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-modern-text-primary">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-modern-text-secondary hover:text-modern-accent transition-colors">Features</Link></li>
              <li><Link to="/migrations/setup" className="text-modern-text-secondary hover:text-modern-accent transition-colors">Start Migration</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-modern-text-primary">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/api-docs" className="text-modern-text-secondary hover:text-modern-accent transition-colors">API Documentation</Link></li>
              <li><Link to="/about" className="text-modern-text-secondary hover:text-modern-accent transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-modern-text-primary">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-modern-text-secondary hover:text-modern-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-modern-text-secondary hover:text-modern-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-modern-border text-center">
          <p className="text-modern-text-secondary">
            © {new Date().getFullYear()} QuillSwitch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
