
import { Home, FileText, HelpCircle, Settings, Database, Shield, Zap } from "lucide-react";
import type { NavItem } from "./types";

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
