import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, MoreVertical, Download, Eye, Filter, Clock, User, RotateCcw, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  operation: "rollback" | "snapshot" | "analysis" | "preview";
  status: "completed" | "failed" | "in_progress" | "cancelled";
  objectsAffected: string[];
  recordsAffected: number;
  snapshotVersion: string;
  riskLevel: "low" | "medium" | "high";
  duration: string;
  ipAddress: string;
  userAgent: string;
  notes?: string;
}

const mockAuditLogs: AuditLogEntry[] = [];

const RollbackAuditTrail: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [operationFilter, setOperationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      cancelled: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case "rollback":
        return <RotateCcw className="h-4 w-4 text-orange-500" />;
      case "snapshot":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "analysis":
        return <Eye className="h-4 w-4 text-purple-500" />;
      case "preview":
        return <Filter className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };
    
    return (
      <Badge className={variants[risk as keyof typeof variants]}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)}
      </Badge>
    );
  };

  const filteredLogs = logs.filter(log => {
    const operationMatch = operationFilter === "all" || log.operation === operationFilter;
    const statusMatch = statusFilter === "all" || log.status === statusFilter;
    const userMatch = userFilter === "all" || log.userName.toLowerCase().includes(userFilter.toLowerCase());
    return operationMatch && statusMatch && userMatch;
  });

  const uniqueUsers = Array.from(new Set(logs.map(log => log.userName)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Rollback Audit Trail
              </CardTitle>
              <CardDescription>
                Complete audit log of all rollback operations for compliance and accountability
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Audit Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">{logs.filter(l => l.operation === "rollback").length}</div>
                  <div className="text-sm text-muted-foreground">Total Rollbacks</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{logs.filter(l => l.status === "completed").length}</div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">12.5 min</div>
                  <div className="text-sm text-muted-foreground">Avg Duration</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex gap-4 mb-6">
            <Select value={operationFilter} onValueChange={setOperationFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Operations</SelectItem>
                <SelectItem value="rollback">Rollbacks</SelectItem>
                <SelectItem value="snapshot">Snapshots</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="preview">Previews</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search by user..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(log.timestamp).toLocaleDateString()}
                        <br />
                        <span className="text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.userName}</div>
                        <div className="text-sm text-muted-foreground">{log.ipAddress}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getOperationIcon(log.operation)}
                        <div>
                          <div className="font-medium">{log.action}</div>
                          <div className="text-sm text-muted-foreground">
                            {log.objectsAffected.join(", ")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        {getStatusBadge(log.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.recordsAffected.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{log.duration}</div>
                    </TableCell>
                    <TableCell>
                      {getRiskBadge(log.riskLevel)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export Entry
                          </DropdownMenuItem>
                          {log.status === "completed" && log.operation === "rollback" && (
                            <DropdownMenuItem>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Revert This Rollback
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No audit entries found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance & Security</CardTitle>
          <CardDescription>
            Audit trail features for regulatory compliance and security monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Audit Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Complete operation tracking with timestamps</li>
                <li>• User attribution and IP address logging</li>
                <li>• Risk level assessment for each operation</li>
                <li>• Detailed before/after state capture</li>
                <li>• Tamper-proof audit log storage</li>
                <li>• Automated compliance report generation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Export Options</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• CSV export for spreadsheet analysis</li>
                <li>• JSON format for system integration</li>
                <li>• PDF reports for compliance documentation</li>
                <li>• Real-time API access for monitoring tools</li>
                <li>• Scheduled automated reports</li>
                <li>• Custom date range filtering</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RollbackAuditTrail;