
import React from "react";
import {
  Home, Lightbulb, FileText, LogIn, Settings, 
  ExternalLink, Key, Plus, LifeBuoy
} from "lucide-react";
import { NavLink } from "./types";

export const mainNav: NavLink[] = [
  {
    href: "/",
    label: "Home",
    icon: <Home size={20} />,
    category: "Main",
  },
  {
    href: "/features",
    label: "Features",
    icon: <Lightbulb size={20} />,
    category: "Main",
  },
  {
    href: "/resources",
    label: "Resources",
    icon: <FileText size={20} />,
    category: "Main",
  },
  {
    href: "/demo",
    label: "Demo",
    icon: <ExternalLink size={20} />,
    category: "Main",
  },
];

export const userNav: NavLink[] = [
  {
    href: "/app/setup",
    label: "New Migration",
    icon: <Plus size={20} />,
    category: "Workspace",
  },
  {
    href: "/app/credentials-vault",
    label: "Credentials Vault",
    icon: <Key size={20} />,
    category: "Workspace",
  },
  {
    href: "/app/settings",
    label: "Settings",
    icon: <Settings size={20} />,
    category: "Account",
  },
  {
    href: "/app/support",
    label: "Support",
    icon: <LifeBuoy size={20} />,
    category: "Account",
  },
];

export const getNavLinksByCategory = (links: NavLink[]) => {
  return links.reduce(
    (acc: Record<string, NavLink[]>, link) => {
      if (!acc[link.category]) {
        acc[link.category] = [];
      }
      acc[link.category].push(link);
      return acc;
    },
    {}
  );
};
