
import { DemoSection } from "./types";
import { 
  Play, 
  Zap, 
  FileBarChart, 
  GitCompare, 
  HelpCircle, 
  BookOpen, 
  RefreshCw 
} from "lucide-react";

export const demoSections: DemoSection[] = [
  {
    id: "migration-visualizer",
    title: "Migration Visualizer",
    icon: Play,
    action: () => {
      document.getElementById("migration-visualizer")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "try-it",
    title: "Try It Yourself",
    icon: Zap,
    action: () => {
      document.getElementById("try-it-experience")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "reports",
    title: "Migration Reports",
    icon: FileBarChart,
    action: () => {
      document.getElementById("migration-reports")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "comparison",
    title: "Product Comparison",
    icon: GitCompare,
    action: () => {
      document.getElementById("product-comparison")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "challenges",
    title: "Common Challenges",
    icon: HelpCircle,
    action: () => {
      document.getElementById("common-challenges")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "knowledge",
    title: "Knowledge Base",
    icon: BookOpen,
    action: () => {
      document.getElementById("expert-knowledge")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  }
];

export const demoControls = [
  {
    title: "Reset Demo",
    icon: RefreshCw,
    action: () => {
      window.location.reload(); // This will be handled by the resetDemo function from useDemoState
    }
  }
];
