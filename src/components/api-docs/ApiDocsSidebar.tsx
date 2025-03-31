
import React from "react";
import { Button } from "@/components/ui/button";
import GlassPanel from "@/components/ui-elements/GlassPanel";

interface ApiDocsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ApiDocsSidebar = ({ activeTab, onTabChange }: ApiDocsSidebarProps) => {
  const navigationItems = [
    { id: "overview", label: "Overview" },
    { id: "authentication", label: "Authentication" },
    { id: "contacts", label: "Contacts API" },
    { id: "accounts", label: "Accounts API" },
    { id: "opportunities", label: "Opportunities API" },
    { id: "migration", label: "Migration API" },
    { id: "webhooks", label: "Webhooks" },
    { id: "api-test", label: "Test API" },
  ];

  return (
    <GlassPanel className="sticky top-24">
      <div className="p-4">
        <h3 className="font-medium mb-4">API Navigation</h3>
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(item.id)}
              >
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </GlassPanel>
  );
};

export default ApiDocsSidebar;
