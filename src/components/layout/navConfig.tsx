
import React from "react";
import { Home, Zap, Calculator, Monitor, BookOpen, FileText, HelpCircle, Scale, Settings, BarChart3, Database, Activity, Brain, Cloud } from "lucide-react";

export interface NavItem {
  name: string;
  path: string;
  icon?: React.ComponentType<any>;
  description?: string;
}

export interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  category: string;
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

// Main navigation for public pages
export const mainNav: NavLink[] = [
  { href: "/", label: "Home", icon: <Home className="h-4 w-4" />, category: "Product" },
  { href: "/demo", label: "Demo", icon: <Monitor className="h-4 w-4" />, category: "Product" },
  { href: "/pricing", label: "Pricing", icon: <Calculator className="h-4 w-4" />, category: "Product" },
  { href: "/comparison", label: "Comparison", icon: <Scale className="h-4 w-4" />, category: "Resources" },
  { href: "/resources", label: "Resources", icon: <BookOpen className="h-4 w-4" />, category: "Resources" },
];

// User navigation for authenticated users
export const userNav: NavLink[] = [
  { href: "/app/dashboard", label: "Dashboard", icon: <BarChart3 className="h-4 w-4" />, category: "App" },
  { href: "/app/connections", label: "Connections", icon: <Zap className="h-4 w-4" />, category: "App" },
  { href: "/app/migrations", label: "Migrations", icon: <Database className="h-4 w-4" />, category: "App" },
  { href: "/app/setup", label: "New Migration", icon: <Brain className="h-4 w-4" />, category: "App" },
  { href: "/app/cloud-migration", label: "Cloud Migration", icon: <Cloud className="h-4 w-4" />, category: "App" },
  { href: "/app/activity", label: "Activity", icon: <Activity className="h-4 w-4" />, category: "App" },
  { href: "/app/settings", label: "Settings", icon: <Settings className="h-4 w-4" />, category: "App" },
];

// Utility function to group nav links by category
export const getNavLinksByCategory = (navLinks: NavLink[]): Record<string, NavLink[]> => {
  return navLinks.reduce((acc, link) => {
    const category = link.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(link);
    return acc;
  }, {} as Record<string, NavLink[]>);
};

export const navSections: NavSection[] = [
  {
    title: "Product",
    items: [
      { name: "Home", path: "/", description: "Overview of QuillSwitch" },
      { name: "Demo", path: "/demo", description: "Interactive product demo" },
      { name: "Pricing", path: "/pricing", description: "Transparent pricing calculator" },
    ]
  },
  {
    title: "Resources",
    items: [
      { name: "Comparison", path: "/comparison", description: "How QuillSwitch compares" },
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
      { name: "Pricing", path: "/pricing" },
    ]
  },
  {
    title: "Resources", 
    items: [
      { name: "Comparison", path: "/comparison" },
      { name: "Resources", path: "/resources" },
      { name: "API Documentation", path: "/api-docs" },
      { name: "Support Center", path: "/support" },
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
