
import React, { useState } from "react";
import { PlusCircle, Edit, Trash2, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending" | "inactive";
};

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Project Manager",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "Viewer",
    status: "active",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "Analyst",
    status: "pending",
  },
];

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

const roles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full access to all features and settings",
    permissions: ["create_projects", "edit_projects", "invite_users", "manage_billing"],
  },
  {
    id: "2",
    name: "Project Manager",
    description: "Can create and manage migration projects",
    permissions: ["create_projects", "edit_projects"],
  },
  {
    id: "3",
    name: "Viewer",
    description: "Read-only access to projects and data",
    permissions: [],
  },
  {
    id: "4",
    name: "Analyst",
    description: "Can view and analyze migration data",
    permissions: ["view_reports"],
  },
];

const memberFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string().min(1, {
    message: "Please select a role.",
  }),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

const editMemberFormSchema = z.object({
  role: z.string().min(1, {
    message: "Please select a role.",
  }),
});

type EditMemberFormValues = z.infer<typeof editMemberFormSchema>;

const UserManagementSettings = () => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      email: "",
      role: "",
    },
  });

  const editForm = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberFormSchema),
    defaultValues: {
      role: "",
    },
  });

  function onSubmit(data: MemberFormValues) {
    console.log(data);
    setIsAddMemberOpen(false);
    form.reset();
    // In a real app, you would send an invitation to the user
  }

  function onEditSubmit(data: EditMemberFormValues) {
    console.log("Editing member:", selectedMember?.id, "with new role:", data.role);
    setIsEditMemberOpen(false);
    editForm.reset();
    // In a real app, you would update the user's role in the database
  }

  function handleEditMember(member: TeamMember) {
    setSelectedMember(member);
    editForm.setValue("role", roles.find(r => r.name === member.role)?.id || "");
    setIsEditMemberOpen(true);
  }

  function getRoleBadgeVariant(role: string) {
    switch (role) {
      case "Admin":
        return "default";
      case "Project Manager":
        return "outline";
      default:
        return "secondary";
    }
  }

  function getStatusBadgeVariant(status: string) {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "destructive";
      default:
        return "secondary";
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team and their access rights.</CardDescription>
          </div>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new team member by email.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-4 py-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="user@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Send Invitation</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Edit Member Dialog */}
          <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Team Member</DialogTitle>
                <DialogDescription>
                  Change role for {selectedMember?.name}
                </DialogDescription>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-1">
                      <p className="font-medium">{selectedMember?.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedMember?.email}</p>
                    </div>
                    <FormField
                      control={editForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditMemberOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role) as any}>{member.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(member.status) as any}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditMember(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>
            Define the roles and permissions for your team members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`border rounded-lg p-4 cursor-pointer ${
                  selectedRole === role.id ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-lg">{role.name}</div>
                  {selectedRole === role.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <Badge key={permission} variant="outline">
                      {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementSettings;
