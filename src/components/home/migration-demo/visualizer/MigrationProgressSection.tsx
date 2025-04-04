
import React from "react";
import MigrationProgressBar from "../MigrationProgressBar";

type MigrationProgressSectionProps = {
  migrationStatus: "idle" | "loading" | "success";
  overallProgress: number;
}

const MigrationProgressSection = ({ 
  migrationStatus, 
  overallProgress 
}: MigrationProgressSectionProps) => {
  return (
    <>
      {migrationStatus !== "idle" && (
        <MigrationProgressBar progress={overallProgress} />
      )}
    </>
  );
};

export default MigrationProgressSection;
