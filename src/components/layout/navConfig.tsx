
import React from 'react';
import { Home, LayoutDashboard, Settings, FileText, Kanban, Zap, Database, Link } from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
  isAuthRequired?: boolean;
  children?: NavLink[];
}

export const mainNav: NavLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    label: "Features",
    href: "/features",
    icon: <Zap className="mr-2 h-4 w-4" />,
  },
  {
    label: "Resources",
    href: "/resources",
    icon: <FileText className="mr-2 h-4 w-4" />,
  },
];

export const userNav: NavLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    label: "Integrations",
    href: "/integrations",
    icon: <Kanban className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    label: "Connect",
    href: "/connect",
    icon: <Link className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    label: "Data Migration",
    href: "/migrations",
    icon: <Database className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    isAuthRequired: true,
  },
];
