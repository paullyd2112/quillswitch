import { LucideProps } from "lucide-react";

// Keep typeof Play as it is, or be more generic if other icons can be used.
// For Lucide icons, React.FC<LucideProps> or a similar specific type is appropriate.
// Using `any` for simplicity here if different icon types are possible, but prefer specific types.
export type IconType = React.FC<LucideProps & React.RefAttributes<SVGSVGElement>>;


export interface DemoSection {
  id: string;
  title: string;
  icon: IconType;
  action: () => void;
}

export interface DemoState {
  visitedSections: Set<string>;
  completedSections: Set<string>;
  currentSection: string | null;
  totalProgress: number;
  sessionStartTime: number;
}
