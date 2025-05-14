
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { 
  AlertCircle, 
  ArrowLeft, 
  ChevronLeft, 
  Database, 
  Files, 
  Home, 
  Info, 
  Key, 
  LifeBuoy,
  LogOut, 
  Mail, 
  Plug, 
  Settings, 
  UserCircle2 
} from "lucide-react";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const mainNavigation = [
    {
      title: "Overview",
      path: "/welcome",
      icon: <Home className="w-5 h-5" />,
    },
    {
      title: "Migrations",
      path: "/migrations",
      icon: <Database className="w-5 h-5" />,
    },
    {
      title: "Connection Hub",
      path: "/connect",
      icon: <Plug className="w-5 h-5" />,
    },
    {
      title: "Credentials Vault",
      path: "/credentials-vault",
      icon: <Key className="w-5 h-5" />,
    },
    {
      title: "Documentation",
      path: "/resources",
      icon: <Files className="w-5 h-5" />,
    },
    {
      title: "Support",
      path: "/support",
      icon: <LifeBuoy className="w-5 h-5" />,
    }
  ];
  
  const accountNavigation = [
    {
      title: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== "/" && location.pathname.startsWith(path));
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center p-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-tech-accent to-tech-highlight flex items-center justify-center text-white font-semibold">Q</div>
          <span className="font-sf font-medium text-lg tracking-tight">QuillSwitch</span>
        </div>
        <SidebarTrigger className="ml-auto">
          <ChevronLeft className="w-5 h-5" />
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        {/* Main Navigation */}
        <SidebarMenu>
          {!user ? (
            <a 
              href="/" 
              className="flex items-center gap-2 p-2 text-tech-text-secondary hover:text-tech-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </a>
          ) : (
            mainNavigation.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  className={cn(
                    "group flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                    isActive(item.path)
                      ? "bg-tech-subtle text-tech-text-primary font-medium"
                      : "text-tech-text-secondary hover:text-tech-text-primary hover:bg-tech-subtle/50"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <span className={cn(
                    "text-tech-text-secondary group-hover:text-tech-accent transition-colors",
                    isActive(item.path) && "text-tech-accent"
                  )}>
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>

        {/* User Account */}
        {user && (
          <>
            <div className="mt-8 mb-2 px-3">
              <p className="text-xs uppercase tracking-wider text-tech-text-secondary/70 font-medium">
                Account
              </p>
            </div>
            <SidebarMenu>
              {accountNavigation.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={cn(
                      "group flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                      isActive(item.path)
                        ? "bg-tech-subtle text-tech-text-primary font-medium"
                        : "text-tech-text-secondary hover:text-tech-text-primary hover:bg-tech-subtle/50"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <span className={cn(
                      "text-tech-text-secondary group-hover:text-tech-accent transition-colors",
                      isActive(item.path) && "text-tech-accent"
                    )}>
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        )}
      </SidebarContent>

      {user && (
        <SidebarFooter className="p-4 border-t border-tech-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-tech-subtle flex items-center justify-center">
                <UserCircle2 className="w-5 h-5 text-tech-text-secondary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                <span className="text-xs text-tech-text-secondary">{user.email}</span>
              </div>
            </div>
            <button 
              onClick={() => signOut && signOut()}
              className="text-tech-text-secondary hover:text-tech-text-primary p-1 rounded-md hover:bg-tech-subtle transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
