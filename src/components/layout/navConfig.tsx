
import React from 'react';
import { Home, LayoutDashboard, Settings, FileText, Kanban, Zap, Database, Link } from 'lucide-react';

export interface NavLink {
  title: string;
  href: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
  isAuthRequired?: boolean;
  children?: NavLink[];
}

export const mainNav: NavLink[] = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    title: "Features",
    href: "/features",
    icon: <Zap className="mr-2 h-4 w-4" />,
  },
  {
    title: "Resources",
    href: "/resources",
    icon: <FileText className="mr-2 h-4 w-4" />,
  },
];

export const userNav: NavLink[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: <Kanban className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    title: "Connect",
    href: "/connect",
    icon: <Link className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    title: "Data Migration",
    href: "/migration",
    icon: <Database className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
];
