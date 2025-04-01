
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Activity, Key, Lock, LogOut, Shield, UserCog } from "lucide-react";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const SecuritySettings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isAPIKeyDialogOpen, setIsAPIKeyDialogOpen] = useState(false);

  const sessions = [
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, USA",
      lastActive: "Just now",
      isCurrent: true,
    },
    {
      id: "2",
      device: "Safari on Mac",
      location: "San Francisco, USA",
      lastActive: "2 days ago",
      isCurrent: false,
    },
    {
      id: "3",
      device: "Mobile App on iPhone",
      location: "Chicago, USA",
      lastActive: "5 days ago",
      isCurrent: false,
    },
  ];

  const apiKeys = [
    {
      id: "key_1",
      name: "Production API Key",
      created: "May 5, 2023",
      lastUsed: "Today",
      status: "active",
    },
    {
      id: "key_2",
      name: "Development API Key",
      created: "June 12, 2023",
      lastUsed: "Yesterday",
      status: "active",
    },
  ];

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  function onPasswordSubmit(data: PasswordFormValues) {
    console.log(data);
    // In a real app, you would update the user's password here
    passwordForm.reset();
  }

  const generateApiKey = () => {
    // In a real app, you would generate and store an API key
    console.log("Generating API key");
    setIsAPIKeyDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="2fa" className="text-base font-medium">
                Enable Two-Factor Authentication
              </Label>
              <p className="text-sm text-muted-foreground">
                Protect your account with an additional security layer.
              </p>
            </div>
            <Switch
              id="2fa"
              checked={is2FAEnabled}
              onCheckedChange={(checked) => setIs2FAEnabled(checked)}
            />
          </div>

          {is2FAEnabled && (
            <div className="mt-6 border rounded-lg p-4">
              <h4 className="font-medium mb-2">Setup Instructions</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>Scan the QR code or enter the setup key</li>
                <li>Enter the verification code from your authenticator app</li>
              </ol>
              <div className="mt-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-200 w-40 h-40 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-muted-foreground" />
                    <span className="sr-only">QR Code Placeholder</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Input placeholder="Enter verification code" />
                  <Button>Verify</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>
            Manage your active sessions and devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    {session.device}
                    {session.isCurrent && (
                      <Badge variant="outline" className="ml-2">
                        Current
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell>{session.lastActive}</TableCell>
                  <TableCell className="text-right">
                    {!session.isCurrent && (
                      <Button variant="ghost" size="sm">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="gap-1">
            <LogOut className="h-4 w-4" />
            Sign Out All Devices
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>
            Manage API keys for programmatic access to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>{key.created}</TableCell>
                  <TableCell>{key.lastUsed}</TableCell>
                  <TableCell>
                    <Badge
                      variant={key.status === "active" ? "success" : "destructive"}
                    >
                      {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Dialog open={isAPIKeyDialogOpen} onOpenChange={setIsAPIKeyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Key className="h-4 w-4" />
                Generate New API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Generate API Key</DialogTitle>
                <DialogDescription>
                  Create a new API key for programmatic access to your account.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key-name">API Key Name</Label>
                  <Input id="api-key-name" placeholder="e.g., Production API Key" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={generateApiKey}>Generate Key</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Management</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Update Password</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
