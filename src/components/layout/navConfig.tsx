
import React from "react";
import { Home, Bolt, Layers, FileBarChart2, FileText, HelpCircle, Settings, Users, BarChart3 } from "lucide-react";

const getNavLinks = (user: any) => {
  // Links that are always shown
  const publicLinks = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-4 w-4" />,
    },
    {
      label: "Features",
      href: "/features",
      icon: <Bolt className="h-4 w-4" />,
    },
    {
      label: "Resources",
      href: "/resources",
      icon: <HelpCircle className="h-4 w-4" />,
    },
    {
      label: "About",
      href: "/about",
      icon: <Users className="h-4 w-4" />,
    }
  ];
  
  // Links shown only to authenticated users
  const authenticatedLinks = user ? [
    {
      label: "Migrations",
      href: "/migrations",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: <FileBarChart2 className="h-4 w-4" />,
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: "API Docs",
      href: "/api-docs",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
    }
  ] : [];
  
  return [...publicLinks, ...authenticatedLinks];
};

export default getNavLinks;
