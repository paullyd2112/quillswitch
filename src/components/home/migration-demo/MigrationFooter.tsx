
import React from "react";

type MigrationFooterProps = {
  status: "idle" | "loading" | "success";
};

const MigrationFooter = ({ status }: MigrationFooterProps) => {
  if (status === "idle") {
    return (
      <div className="text-center mt-6 text-sm text-muted-foreground animate-pulse">
        Click to see a demo migration
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center mt-6 text-sm font-medium text-green-500">
        Migration complete! Click to run again.
      </div>
    );
  }

  return null;
};

export default MigrationFooter;
