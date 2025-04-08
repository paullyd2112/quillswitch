
import { LucideIcon } from "lucide-react";

export interface ResourceCardItem {
  icon: LucideIcon;
  title: string;
  description: string;
  linkHref?: string;
  linkText?: string;
}
