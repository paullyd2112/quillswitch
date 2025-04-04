
import React from "react";
import { 
  FileText,
  Wand2,
  BarChart2,
  LayoutDashboard,
  Puzzle,
  BarChart3,
  FileBarChart,
  LifeBuoy,
  Settings,
  DollarSign
} from "lucide-react";

export const getNavLinks = (user?: any) => [
  { text: "Dashboard", href: "/", icon: <LayoutDashboard size={16} /> },
  { 
    text: "Features & Tools", 
    href: "#", 
    icon: <Puzzle size={16} />,
    children: [
      { text: "API Docs", href: "/api-docs", icon: <FileText size={16} /> },
      { text: "Setup Wizard", href: user ? "/migrations/setup" : "/auth/register", icon: <Wand2 size={16} /> },
      { text: "Analytics", href: "/analytics", icon: <BarChart3 size={16} /> },
    ] 
  },
  ...(user ? [
    { 
      text: "Reports", 
      href: "/reports", 
      icon: <FileBarChart size={16} />,
      children: [
        { text: "Overview", href: "/reports", icon: <FileBarChart size={16} /> },
        { text: "Migrations", href: "/migrations", icon: <BarChart2 size={16} /> },
      ]
    }
  ] : []),
  { text: "Pricing", href: "/pricing", icon: <DollarSign size={16} /> },
  { text: "Resources", href: "/resources", icon: <LifeBuoy size={16} /> },
  { text: "Settings", href: "/settings", icon: <Settings size={16} /> },
];

export default getNavLinks;
