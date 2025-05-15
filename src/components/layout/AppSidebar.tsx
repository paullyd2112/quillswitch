
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
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { mainNav, userNav, getNavLinksByCategory } from "./navConfig";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

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
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-white font-bold">Q</div>
            <span className="font-bold text-lg text-foreground">QuillSwitch</span>
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
        {!user && (
          <div className="px-2 py-2 space-y-2">
            <Link to="/auth?mode=login" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </Link>
            <Link to="/auth?mode=register" className="w-full">
              <Button className="w-full justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </Link>
          </div>
        )}
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
