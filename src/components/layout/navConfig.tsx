
import React from "react";
import { Home, Bolt, Layers, FileBarChart2, FileText, HelpCircle, Settings, Users, BarChart3, Download } from "lucide-react";

const getNavLinks = (user: any) => {
  // Links that are always shown
  const publicLinks = [
    {
      text: "Home",
      href: "/",
      icon: <Home className="h-4 w-4" />,
      items: []
    },
    {
      text: "Features",
      href: "/features",
      icon: <Bolt className="h-4 w-4" />,
      items: []
    },
    {
      text: "Resources",
      href: "/resources",
      icon: <HelpCircle className="h-4 w-4" />,
      items: []
    },
    {
      text: "About",
      href: "/about",
      icon: <Users className="h-4 w-4" />,
      items: []
    },
    {
      text: "Export as PDF",
      href: "#",
      icon: <Download className="h-4 w-4" />,
      onClick: () => window.exportSiteAsPdf?.(),
      items: []
    }
  ];
  
  // Links shown only to authenticated users
  const authenticatedLinks = user ? [
    {
      text: "Migrations",
      href: "/migrations",
      icon: <Layers className="h-4 w-4" />,
      items: []
    },
    {
      text: "Reports",
      href: "/reports",
      icon: <FileBarChart2 className="h-4 w-4" />,
      items: []
    },
    {
      text: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      items: []
    },
    {
      text: "API Docs",
      href: "/api-docs",
      icon: <FileText className="h-4 w-4" />,
      items: []
    },
    {
      text: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
      items: []
    }
  ] : [];
  
  return [...publicLinks, ...authenticatedLinks];
};

export default getNavLinks;
