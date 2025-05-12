
import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  FileText, 
  Kanban, 
  Database, 
  Link, 
  BookOpen, 
  ListOrdered, 
  User,
  Settings,
  HelpCircle,
  Code,
  Command,
  Bell,
  Play
} from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
  isAuthRequired?: boolean;
  children?: NavLink[];
  category?: string;
}

// Public navigation (pre-login)
export const mainNav: NavLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <Home className="mr-2 h-4 w-4" />,
    category: "Navigation"
  },
  {
    label: "Demo",
    href: "/demo",
    icon: <Play className="mr-2 h-4 w-4" />,
    category: "Navigation"
  },
  {
    label: "Features",
    href: "/features",
    icon: <Kanban className="mr-2 h-4 w-4" />,
    category: "Navigation"
  },
  {
    label: "Resources",
    href: "/resources",
    icon: <FileText className="mr-2 h-4 w-4" />,
    category: "Navigation"
  },
];

// Authenticated user navigation (post-login)
export const userNav: NavLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
    category: "Dashboard"
  },
  {
    label: "Start Migration",
    href: "/migrations/setup",
    icon: <Database className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
    category: "Migration"
  },
  {
    label: "My Migrations",
    href: "/migrations",
    icon: <ListOrdered className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
    category: "Migration"
  },
  {
    label: "Connections",
    href: "/connect",
    icon: <Link className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
    category: "Integration"
  },
  {
    label: "Knowledge Base",
    href: "/resources",
    icon: <BookOpen className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
    category: "Resources"
  },
  {
    label: "Support",
    href: "/support",
    icon: <User className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
    category: "Resources"
  },
  {
    label: "API Docs",
    href: "/api-docs",
    icon: <Code className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
    category: "Developer"
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
    category: "User"
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: <Bell className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
    category: "User"
  },
  {
    label: "Help",
    href: "/help",
    icon: <HelpCircle className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
    category: "Resources"
  },
  {
    label: "Command Center",
    href: "/command-center",
    icon: <Command className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
    category: "Developer"
  }
];

// Group navlinks by category
export const getNavLinksByCategory = (links: NavLink[]) => {
  const categorizedLinks: Record<string, NavLink[]> = {};
  
  links.forEach(link => {
    const category = link.category || 'Other';
    if (!categorizedLinks[category]) {
      categorizedLinks[category] = [];
    }
    categorizedLinks[category].push(link);
  });
  
  return categorizedLinks;
};

