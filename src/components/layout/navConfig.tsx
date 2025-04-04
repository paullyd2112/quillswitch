
import React from "react";
import { Home, Bolt, Layers, FileBarChart2, FileText, HelpCircle, Settings, Users, BarChart3 } from "lucide-react";

const getNavLinks = (user: any) => {
  // Links that are always shown
  const publicLinks = [
    {
      title: "Home",
      href: "/",
      icon: <Home className="h-4 w-4" />,
      items: []
    },
    {
      title: "Features",
      href: "/features",
      icon: <Bolt className="h-4 w-4" />,
      items: []
    },
    {
      title: "Resources",
      href: "/resources",
      icon: <HelpCircle className="h-4 w-4" />,
      items: []
    },
    {
      title: "About",
      href: "/about",
      icon: <Users className="h-4 w-4" />,
      items: []
    }
  ];
  
  // Links shown only to authenticated users
  const authenticatedLinks = user ? [
    {
      title: "Migrations",
      href: "/migrations",
      icon: <Layers className="h-4 w-4" />,
      items: []
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <FileBarChart2 className="h-4 w-4" />,
      items: []
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      items: []
    },
    {
      title: "API Docs",
      href: "/api-docs",
      icon: <FileText className="h-4 w-4" />,
      items: []
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
      items: []
    }
  ] : [];
  
  return [...publicLinks, ...authenticatedLinks];
};

export default getNavLinks;
