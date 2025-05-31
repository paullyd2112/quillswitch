
import { Home, FileText, HelpCircle, Settings, Database, Shield, Zap, Plus, LifeBuoy } from "lucide-react";
import type { NavItem, NavLink } from "./types";

export const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Resources", 
    href: "/resources",
    icon: FileText,
  },
  {
    title: "Demo",
    href: "/demo", 
    icon: Zap,
  },
  {
    title: "Support",
    href: "/support",
    icon: HelpCircle,
  }
];

export const appNavItems: NavItem[] = [
  {
    title: "Migration Setup",
    href: "/app/setup",
    icon: Database,
  },
  {
    title: "CRM Connections", 
    href: "/app/crm-connections",
    icon: Shield,
  },
  {
    title: "Credentials Vault",
    href: "/app/credentials-vault", 
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/app/settings",
    icon: Settings,
  }
];

// Convert NavItem to NavLink format for compatibility
const convertToNavLink = (items: NavItem[], category: string): NavLink[] => {
  return items.map(item => ({
    label: item.title,
    href: item.href,
    icon: <item.icon size={20} />,
    category
  }));
};

// Legacy exports for backward compatibility
export const mainNav: NavLink[] = convertToNavLink(mainNavItems, "Main");

export const userNav: NavLink[] = [
  ...convertToNavLink(appNavItems, "Workspace"),
  {
    label: "Support",
    href: "/support",
    icon: <LifeBuoy size={20} />,
    category: "Account",
  }
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
