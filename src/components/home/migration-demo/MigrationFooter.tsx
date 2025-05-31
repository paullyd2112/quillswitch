
import React from "react";
import { Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type MigrationFooterProps = {
  status: "idle" | "loading" | "success" | "error";
  onViewReport?: () => void;
};

const MigrationFooter = ({ status, onViewReport }: MigrationFooterProps) => {
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
    <div className="mt-6 space-y-3">
      <div className="flex justify-center items-center gap-2 text-sm text-center">
        <Sparkles className="h-4 w-4 text-brand-500" />
        <span>{getMessage()}</span>
        <Sparkles className="h-4 w-4 text-brand-500" />
      </div>
      
      {status === "success" && onViewReport && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onViewReport}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            View Migration Report
          </Button>
        </div>
      )}
    </div>
  );
};

export default MigrationFooter;
