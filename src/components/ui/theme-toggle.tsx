
import * as React from "react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  return (
    <Button variant="outline" size="icon" className="border-slate-200 dark:border-slate-700">
      <Moon className="h-[1.2rem] w-[1.2rem] dark:text-white" />
      <span className="sr-only">Dark mode</span>
    </Button>
  );
}
