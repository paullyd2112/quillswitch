
import { LucideIcon } from "lucide-react";

export interface PricingSection {
  id: string;
  title: string;
  icon: LucideIcon;
  completed?: boolean;
  action: () => void;
}

export interface PricingState {
  visitedSections: Set<string>;
  completedSections: Set<string>;
  currentSection: string | null;
  totalProgress: number;
  sessionStartTime: number;
}
