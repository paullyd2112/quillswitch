import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Database, MoreVertical, Play, Pause, Download, Trash2, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface SandboxJob {
  id: string;
  name: string;
  type: "pii_masking" | "synthetic_data" | "subset_selection";
  status: "pending" | "running" | "completed" | "failed" | "paused";
  progress: number;
  recordsProcessed: number;
  totalRecords: number;
  createdAt: string;
  completedAt?: string;
  duration?: string;
  sourceSystem: string;
  targetSystem: string;
}

const mockJobs: SandboxJob[] = [
  {
    id: "job-001",
    name: "Production Data Masking - Sales Team",
    type: "pii_masking",
    status: "completed",
    progress: 100,
    recordsProcessed: 25000,
    totalRecords: 25000,
    createdAt: "2024-01-15 10:30:00",
    completedAt: "2024-01-15 11:45:00",
    duration: "1h 15m",
    sourceSystem: "Salesforce Production",
    targetSystem: "Development Environment"
  },
  {
    id: "job-002",
    name: "Synthetic Dataset Generation - Q1 Testing",
    type: "synthetic_data",
    status: "running",
    progress: 67,
    recordsProcessed: 6700,
    totalRecords: 10000,
    createdAt: "2024-01-16 09:15:00",
    sourceSystem: "HubSpot Production",
    targetSystem: "QuillSandbox"
  },
  {
    id: "job-003",
    name: "EMEA Region Subset - UAT Environment",
    type: "subset_selection",
    status: "pending",
    progress: 0,
    recordsProcessed: 0,
    totalRecords: 15000,
    createdAt: "2024-01-16 14:20:00",
    sourceSystem: "Pipedrive Production",
    targetSystem: "UAT Environment"
  },
  {
    id: "job-004",
    name: "Customer Data Anonymization",
    type: "pii_masking",
    status: "failed",
    progress: 23,
    recordsProcessed: 2300,
    totalRecords: 10000,
    createdAt: "2024-01-15 16:45:00",
    sourceSystem: "Salesforce Production",
    targetSystem: "Staging Environment"
  }
];

const SandboxJobsList: React.FC = () => {
  const [jobs, setJobs] = useState<SandboxJob[]>(mockJobs);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "paused":
        return <Pause className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      running: "secondary",
      pending: "outline",
      failed: "destructive",
      paused: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      pii_masking: "PII Masking",
      synthetic_data: "Synthetic Data",
      subset_selection: "Subset Selection"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      pii_masking: "text-blue-600",
      synthetic_data: "text-purple-600",
      subset_selection: "text-green-600"
    };
    return colors[type as keyof typeof colors] || "text-gray-600";
  };

  const filteredJobs = jobs.filter(job => {
    const statusMatch = statusFilter === "all" || job.status === statusFilter;
    const typeMatch = typeFilter === "all" || job.type === typeFilter;
    return statusMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Sandbox Jobs
              </CardTitle>
              <CardDescription>
                Monitor and manage your data processing jobs
              </CardDescription>
            </div>
            <Button>
              <Play className="h-4 w-4 mr-2" />
              New Job
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pii_masking">PII Masking</SelectItem>
                <SelectItem value="synthetic_data">Synthetic Data</SelectItem>
                <SelectItem value="subset_selection">Subset Selection</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search jobs..."
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.sourceSystem} → {job.targetSystem}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getTypeColor(job.type)}`}>
                        {getTypeLabel(job.type)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={job.progress} className="w-24" />
                        <div className="text-xs text-muted-foreground">
                          {job.progress}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{job.recordsProcessed.toLocaleString()}</div>
                        <div className="text-muted-foreground">
                          / {job.totalRecords.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {job.duration || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {job.status === "running" && (
                            <DropdownMenuItem>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Job
                            </DropdownMenuItem>
                          )}
                          {job.status === "paused" && (
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Resume Job
                            </DropdownMenuItem>
                          )}
                          {job.status === "completed" && (
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Results
                            </DropdownMenuItem>
                          )}
                          {(job.status === "failed" || job.status === "paused") && (
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Retry Job
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Job
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No jobs found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SandboxJobsList;