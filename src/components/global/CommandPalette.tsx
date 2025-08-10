import React from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/app/dashboard" },
  { label: "Setup Wizard", path: "/app/setup" },
  { label: "Connections", path: "/app/connections" },
  { label: "Comparison", path: "/comparison" },
  { label: "Knowledge Base", path: "/knowledge-base" },
  { label: "Support", path: "/support" },
  { label: "API Docs", path: "/api-docs" },
];

const CommandPalette: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages and actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Go to">
          {navItems.map((item) => (
            <CommandItem key={item.path} value={item.label} onSelect={() => onSelect(item.path)}>
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
