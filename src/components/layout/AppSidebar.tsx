import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { mainNav, userNav, getNavLinksByCategory } from "./navConfig";
import { useAuth } from "@/contexts/auth";

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Combine navigation links based on authentication
  const navLinks = user ? [...mainNav, ...userNav] : mainNav;
  
  // Group links by category
  const categorizedLinks = getNavLinksByCategory(navLinks);
  const categories = Object.keys(categorizedLinks);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-friendly-accent to-friendly-accent/70 flex items-center justify-center text-white font-bold">Q</div>
            <span className="font-bold text-lg text-friendly-text-primary">QuillSwitch</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {categories.map((category) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel>{category}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categorizedLinks[category].map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.href}
                      tooltip={item.label}
                    >
                      <Link to={item.href}>
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="text-xs text-sidebar-foreground/70">
            &copy; {new Date().getFullYear()} QuillSwitch
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
