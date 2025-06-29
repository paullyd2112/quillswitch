
import React from "react";
import { Home, Zap, Calculator, Monitor, BookOpen, FileText, HelpCircle, Scale } from "lucide-react";

export interface NavItem {
  name: string;
  path: string;
  icon?: React.ComponentType<any>;
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const mainNavItems: NavItem[] = [
  { name: "Home", path: "/", icon: Home },
  { name: "Demo", path: "/demo", icon: Monitor },
  { name: "Comparison", path: "/comparison", icon: Scale },
  { name: "Pricing", path: "/pricing", icon: Calculator },
  { name: "Resources", path: "/resources", icon: BookOpen },
];

export const navSections: NavSection[] = [
  {
    title: "Product",
    items: [
      { name: "Home", path: "/", description: "Overview of QuillSwitch" },
      { name: "Demo", path: "/demo", description: "Interactive product demo" },
      { name: "Comparison", path: "/comparison", description: "How QuillSwitch compares" },
      { name: "Pricing", path: "/pricing", description: "Transparent pricing calculator" },
    ]
  },
  {
    title: "Resources",
    items: [
      { name: "Resources", path: "/resources", description: "Guides and tutorials" },
      { name: "API Docs", path: "/api-docs", description: "Developer documentation" },
      { name: "Support", path: "/support", description: "Get help and support" },
    ]
  }
];

export const footerNavSections = [
  {
    title: "Product",
    items: [
      { name: "Home", path: "/" },
      { name: "Demo", path: "/demo" },
      { name: "Comparison", path: "/comparison" },
      { name: "Pricing", path: "/pricing" },
    ]
  },
  {
    title: "Resources", 
    items: [
      { name: "Resources", path: "/resources" },
      { name: "API Documentation", path: "/api-docs" },
      { name: "Support", path: "/support" },
    ]
  },
  {
    title: "Legal",
    items: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ]
  }
];
