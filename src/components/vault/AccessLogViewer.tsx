
import React, { useState, useEffect } from "react";
import { ServiceCredential } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Copy, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AccessLogViewerProps {
  credential: ServiceCredential;
}

interface AccessLog {
  id: number;
  credential_id: string;
  user_id: string;
  action: string;
  accessed_at: string;
}

const AccessLogViewer: React.FC<AccessLogViewerProps> = ({ credential }) => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!credential.id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('credential_access_log')
          .select('*')
          .eq('credential_id', credential.id)
          .order('accessed_at', { ascending: false })
          .limit(20);
        
        if (error) throw error;
        
        setLogs(data || []);
      } catch (error) {
        console.error("Error fetching access logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();
  }, [credential.id]);

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

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading access logs...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        No access logs available for this credential
      </div>
    );
  }

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
        {logs.map((log, index) => (
          <TableRow key={log.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center">
                {getActionIcon(log.action)}
                <span className="ml-2 capitalize">{log.action}</span>
              </div>
            </TableCell>
            <TableCell>{formatDate(log.accessed_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AccessLogViewer;
