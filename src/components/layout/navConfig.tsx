
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
  DollarSign,
  BookOpen,
  HelpCircle,
  Zap,
  GitMerge,
  ListChecks,
  BellRing,
  Terminal,
  UploadCloud,
  Calendar,
  Shield,
  Database
} from "lucide-react";

export const getNavLinks = (user?: any) => [
  { text: "Dashboard", href: "/", icon: <LayoutDashboard size={16} /> },
  { 
    text: "Features & Tools", 
    href: "/features", 
    icon: <Puzzle size={16} />,
    children: [
      { text: "All Features", href: "/features", icon: <Puzzle size={16} /> },
      { text: "Automated Mapping", href: "/features#automated-mapping", icon: <Wand2 size={16} /> },
      { text: "Delta Synchronization", href: "/features#delta-sync", icon: <GitMerge size={16} /> },
      { text: "Data Validation", href: "/features#data-validation", icon: <ListChecks size={16} /> },
      { text: "Real-time Notifications", href: "/features#notifications", icon: <BellRing size={16} /> },
      { text: "Data Security", href: "/features#security", icon: <Shield size={16} /> },
      { text: "API Integration", href: "/features#api", icon: <Terminal size={16} /> },
      { text: "Scheduled Migrations", href: "/features#scheduling", icon: <Calendar size={16} /> },
      { text: "Bulk Import/Export", href: "/features#bulk-transfers", icon: <UploadCloud size={16} /> },
      ...(user ? [{ text: "API Docs", href: "/api-docs", icon: <FileText size={16} /> }] : []),
      { text: "Setup Wizard", href: "/migrations/setup", icon: <Wand2 size={16} /> },
      ...(user ? [{ text: "Analytics", href: "/analytics", icon: <BarChart3 size={16} /> }] : []),
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
  { 
    text: "Pricing", 
    href: "/pricing", 
    icon: <DollarSign size={16} />,
    highlight: true 
  },
  { 
    text: "Resources", 
    href: "/resources", 
    icon: <LifeBuoy size={16} />,
    children: [
      { text: "Knowledge Base", href: "/knowledge-base", icon: <BookOpen size={16} /> },
      { text: "FAQ", href: "/resources?tab=faq", icon: <HelpCircle size={16} /> },
    ]
  },
  { text: "Settings", href: "/settings", icon: <Settings size={16} /> },
];

export default getNavLinks;
