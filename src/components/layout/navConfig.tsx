
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
  User 
} from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
  isAuthRequired?: boolean;
  children?: NavLink[];
}

// Public navigation (pre-login)
export const mainNav: NavLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    label: "Features",
    href: "/features",
    icon: <Kanban className="mr-2 h-4 w-4" />,
  },
  {
    label: "Resources",
    href: "/resources",
    icon: <FileText className="mr-2 h-4 w-4" />,
  },
];

// Authenticated user navigation (post-login)
export const userNav: NavLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    label: "Start Migration",
    href: "/migrations/setup",
    icon: <Database className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    label: "My Migrations",
    href: "/migrations",
    icon: <ListOrdered className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    label: "Connections",
    href: "/connect",
    icon: <Link className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    label: "Knowledge Base",
    href: "/resources",
    icon: <BookOpen className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    label: "Support",
    href: "/support",
    icon: <User className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
];
