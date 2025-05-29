
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  icon?: ReactNode;
  category: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}
