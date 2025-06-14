
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
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Play, 
  FileBarChart, 
  GitCompare, 
  HelpCircle, 
  BookOpen, 
  RefreshCw,
  Zap,
  ArrowLeft
} from "lucide-react";

const demoSections = [
  {
    id: "visualizer",
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

const demoControls = [
  {
    title: "Reset Demo",
    icon: RefreshCw,
    action: () => {
      // Reset any demo state
      window.location.reload();
    }
  }
];

export function DemoSidebar() {
  const location = useLocation();

  const handleSectionClick = (action: () => void) => {
    action();
  };

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-white font-bold">Q</div>
            <span className="font-bold text-lg text-foreground">Demo</span>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to Home">
                  <Link to="/">
                    <ArrowLeft />
                    <span>Back to Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Demo Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {demoSections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton 
                    onClick={() => handleSectionClick(section.action)}
                    tooltip={section.title}
                    className="cursor-pointer"
                  >
                    <section.icon />
                    <span>{section.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Demo Controls</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {demoControls.map((control) => (
                <SidebarMenuItem key={control.title}>
                  <SidebarMenuButton 
                    onClick={control.action}
                    tooltip={control.title}
                    className="cursor-pointer"
                  >
                    <control.icon />
                    <span>{control.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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

export default DemoSidebar;
