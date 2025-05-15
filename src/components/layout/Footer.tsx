
import React from "react";
import { Link } from "react-router-dom";
import { isConnectionSecure } from "@/utils/encryptionUtils";
import { AlertTriangle, Lock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "../ui/button";

const Footer = () => {
  const isSecure = isConnectionSecure();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-white font-bold">Q</div>
              <span className="font-bold text-xl text-white">QuillSwitch</span>
            </div>
            
            <p className="text-slate-400 mb-6">
              Simplifying CRM migrations with intelligent mapping and security-first design.
            </p>
            
            <div className="space-y-2">
              <div className="flex gap-3 items-start">
                <MapPin size={18} className="text-primary mt-1" />
                <span className="text-slate-300">123 Innovation Way, San Francisco, CA 94103</span>
              </div>
              <div className="flex gap-3 items-start">
                <Mail size={18} className="text-primary mt-1" />
                <span className="text-slate-300">contact@quillswitch.com</span>
              </div>
              <div className="flex gap-3 items-start">
                <Phone size={18} className="text-primary mt-1" />
                <span className="text-slate-300">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/features" className="text-slate-400 hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/migrations/setup" className="text-slate-400 hover:text-primary transition-colors">Start Migration</Link></li>
              <li><Link to="/demo" className="text-slate-400 hover:text-primary transition-colors">Demo</Link></li>
              <li><Link to="/pricing" className="text-slate-400 hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/resources" className="text-slate-400 hover:text-primary transition-colors">Knowledge Base</Link></li>
              <li><Link to="/api-docs" className="text-slate-400 hover:text-primary transition-colors">API Documentation</Link></li>
              <li><Link to="/support" className="text-slate-400 hover:text-primary transition-colors">Support Center</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Subscribe</h3>
            <p className="text-slate-400 mb-4">Get the latest updates and news</p>
            <div className="flex gap-2 mb-6">
              <input 
                type="email" 
                placeholder="Email address"
                className="flex-1 px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
            
            <div className="flex gap-4 mt-4">
              {['twitter', 'linkedin', 'github', 'youtube'].map((social) => (
                <a 
                  key={social}
                  href={`https://${social}.com/quillswitch`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-slate-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 mb-4 md:mb-0">
              © {currentYear} QuillSwitch. All rights reserved.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/privacy" className="text-slate-400 hover:text-white text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-slate-400 hover:text-white text-sm">Terms of Service</Link>
              <Link to="/cookies" className="text-slate-400 hover:text-white text-sm">Cookie Policy</Link>
              
              {isSecure ? (
                <div className="text-sm text-green-400 flex items-center">
                  <Lock className="h-3 w-3 mr-1" />
                  Secure Connection
                </div>
              ) : (
                <div className="text-sm text-red-400 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Insecure Connection
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
