import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Camera, MoreVertical, Download, Trash2, Eye, HardDrive, Clock, Database, RefreshCw } from "lucide-react";

interface Snapshot {
  id: string;
  version: string;
  name: string;
  type: "automatic" | "manual" | "scheduled";
  status: "completed" | "in_progress" | "failed";
  createdAt: string;
  size: string;
  recordCount: number;
  sourceSystem: string;
  triggerEvent: string;
  retentionDays: number;
}

const mockSnapshots: Snapshot[] = [];

const SnapshotManager: React.FC = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>(mockSnapshots);
  const [isCreating, setIsCreating] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      in_progress: "secondary",
      failed: "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      automatic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      manual: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      scheduled: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const handleCreateSnapshot = () => {
    setIsCreating(true);
    // Simulate snapshot creation
    setTimeout(() => {
      setIsCreating(false);
      // Add new snapshot to list
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Snapshot Management
              </CardTitle>
              <CardDescription>
                Create, manage, and restore from versioned snapshots of your CRM data
              </CardDescription>
            </div>
            <Button onClick={handleCreateSnapshot} disabled={isCreating}>
              <Camera className="h-4 w-4 mr-2" />
              {isCreating ? "Creating..." : "Create Snapshot"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{snapshots.length}</div>
                  <div className="text-sm text-muted-foreground">Total Snapshots</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">0 GB</div>
                  <div className="text-sm text-muted-foreground">Storage Used</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">—</div>
                  <div className="text-sm text-muted-foreground">Avg Creation Time</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Auto Scheduled</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex gap-4 mb-6">
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                <SelectItem value="salesforce">Salesforce</SelectItem>
                <SelectItem value="hubspot">HubSpot</SelectItem>
                <SelectItem value="pipedrive">Pipedrive</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search snapshots..."
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Snapshot</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Retention</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshots.map((snapshot) => (
                  <TableRow key={snapshot.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{snapshot.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {snapshot.version} • {snapshot.sourceSystem}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(snapshot.type)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(snapshot.status)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{snapshot.size}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{snapshot.recordCount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(snapshot.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {snapshot.retentionDays} days
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Create Rollback Point
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export Snapshot
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Snapshot
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automated Snapshot Configuration</CardTitle>
          <CardDescription>
            Configure automatic snapshot creation and retention policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="pre-migration">Pre-Migration Snapshots</Label>
                <Select defaultValue="enabled">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Always Create</SelectItem>
                    <SelectItem value="prompt">Prompt User</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="scheduled">Scheduled Snapshots</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="compression">Compression Level</Label>
                <Select defaultValue="balanced">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Fastest)</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="max">Maximum (Smallest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="retention">Default Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="storage-limit">Storage Limit</Label>
                <Select defaultValue="100">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 GB</SelectItem>
                    <SelectItem value="100">100 GB</SelectItem>
                    <SelectItem value="500">500 GB</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="verification">Snapshot Verification</Label>
                <Select defaultValue="checksum">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="checksum">Checksum Only</SelectItem>
                    <SelectItem value="full">Full Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SnapshotManager;