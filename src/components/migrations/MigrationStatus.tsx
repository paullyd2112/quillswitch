
import React from "react";
import { BadgeCheck, Play, PauseCircle, AlertTriangle, Calendar } from "lucide-react";

interface MigrationStatusProps {
  status: string;
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <BadgeCheck className="h-5 w-5 text-green-500" />;
    case "in_progress":
      return <Play className="h-5 w-5 text-blue-500" />;
    case "paused":
      return <PauseCircle className="h-5 w-5 text-amber-500" />;
    case "failed":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return <Calendar className="h-5 w-5 text-muted-foreground" />;
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In Progress";
    case "paused":
      return "Paused";
    case "failed":
      return "Failed";
    default:
      return "Pending";
  }
};

export const getStatusClass = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "paused":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const MigrationStatus = ({ status }: MigrationStatusProps) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusClass(status)}`}>
      {getStatusIcon(status)}
      {getStatusText(status)}
    </span>
  );
};

export default MigrationStatus;
