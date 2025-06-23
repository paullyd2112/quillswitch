
import React from "react";
import { 
  Database, 
  Link, 
  Activity, 
  Shield, 
  BarChart3, 
  Settings,
  Home,
  ChevronRight
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "/app/dashboard",
      description: "Overview and metrics"
    },
    {
      title: "Connections",
      icon: Link,
      url: "/app/connections", 
      description: "Manage CRM connections"
    },
    {
      title: "Migrations",
      icon: Database,
      url: "/app/migrations",
      description: "Track migration progress"
    },
    {
      title: "Credentials Vault",
      icon: Shield,
      url: "/app/vault",
      description: "Secure credential storage"
    }
  ];

  const toolsItems = [
    {
      title: "Reports",
      icon: BarChart3,
      url: "/app/reports",
      description: "Migration analytics"
    },
    {
      title: "Activity Log",
      icon: Activity,
      url: "/app/activity",
      description: "System activity"
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/app/settings",
      description: "Account preferences"
    }
  ];

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + '/');
  };

  return (
    <Sidebar variant="inset" className="border-r border-border">
      <SidebarHeader className="border-b border-border p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Database className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">QuillSwitch</h2>
            <p className="text-xs text-muted-foreground">Migration Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    isActive={isActive(item.url)}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Tools & Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    isActive={isActive(item.url)}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => navigate("/")}
          >
            Back to Home
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-xs text-muted-foreground text-center">
            Version 1.0.0
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
