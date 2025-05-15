
import { ReactNode } from "react";

export interface NavLink {
  label: string;
  href: string;
  icon?: ReactNode;
  category: string;
}
