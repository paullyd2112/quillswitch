
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Users, UserMinus, Mail, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UserManagementSettings = () => {
  const [users, setUsers] = React.useState([
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin", status: "Active", lastActive: "Today" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Editor", status: "Active", lastActive: "Yesterday" },
    { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", role: "Viewer", status: "Invited", lastActive: "Never" }
  ]);

  const handleInviteUser = () => {
    // Implementation for inviting a new user
  };

  const handleChangeRole = (userId: number, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleRemoveUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleResendInvite = (userId: number) => {
    // Implementation for resending an invitation
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage users who have access to your organization.
              </CardDescription>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-1" />
              Invite User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={user.role}
                      onValueChange={(value) => handleChangeRole(user.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {user.status === 'Invited' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleResendInvite(user.id)}
                          title="Resend Invite"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10"
                        title="Remove User"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-6 border rounded-lg p-4 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-400">Access Control</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  User roles determine what actions team members can perform:
                </p>
                <ul className="text-xs text-amber-700 dark:text-amber-300 mt-2 space-y-1 list-disc list-inside">
                  <li><strong>Admin:</strong> Full access to all settings and features</li>
                  <li><strong>Editor:</strong> Can create and modify migrations, but cannot manage users or billing</li>
                  <li><strong>Viewer:</strong> Read-only access to view migrations and reports</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Invite New User</CardTitle>
          <CardDescription>
            Send an invitation email to add a new team member.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="editor">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                You can change the user's role later if needed.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Optional Message</Label>
              <Input id="message" placeholder="Optional message to include in the invitation email" />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button>
                <Mail className="h-4 w-4 mr-1" />
                Send Invitation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementSettings;
