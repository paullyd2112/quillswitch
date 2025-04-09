
import React from "react";
import { Sparkles } from "lucide-react";

type MigrationFooterProps = {
  status: "idle" | "loading" | "success" | "error";
};

const MigrationFooter = ({ status }: MigrationFooterProps) => {
  const getMessage = () => {
    switch (status) {
      case "idle":
        return "Click to start a demo migration";
      case "loading":
        return "Migration in progress...";
      case "success":
        return "Migration completed successfully!";
      case "error":
        return "Click to try again";
      default:
        return "Click to start a demo migration";
    }
  };

  return (
    <div className="mt-6 flex justify-center items-center gap-2 text-sm text-center">
      <Sparkles className="h-4 w-4 text-brand-500" />
      <span>{getMessage()}</span>
      <Sparkles className="h-4 w-4 text-brand-500" />
    </div>
  );
};

export default MigrationFooter;
