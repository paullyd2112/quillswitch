
import React from "react";
import { ServiceCredential } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Copy, Clock } from "lucide-react";

interface AccessLogViewerProps {
  credential: ServiceCredential;
}

const AccessLogViewer: React.FC<AccessLogViewerProps> = ({ credential }) => {
  if (!credential.metadata?.access_history || credential.metadata.access_history.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        No access logs available for this credential
      </div>
    );
  }

  const accessHistory = credential.metadata.access_history;

  const getActionIcon = (action: string) => {
    switch(action) {
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'copy':
        return <Copy className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accessHistory.map((log: any, index: number) => (
          <TableRow key={index}>
            <TableCell>{accessHistory.length - index}</TableCell>
            <TableCell>
              <div className="flex items-center">
                {getActionIcon(log.action)}
                <span className="ml-2 capitalize">{log.action}</span>
              </div>
            </TableCell>
            <TableCell>{formatDate(log.timestamp)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AccessLogViewer;
