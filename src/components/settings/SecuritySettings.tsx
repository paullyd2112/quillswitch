
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Smartphone, KeyRound, LogOut, CheckCircle } from "lucide-react";

const SecuritySettings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState("authenticator");
  const [isLoading, setIsLoading] = useState(false);

  // Mocked active sessions data - in a real app, this would come from your backend
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: "Chrome on Windows", location: "New York, USA", ipAddress: "192.168.1.1", lastActive: "Just now" },
    { id: 2, device: "Safari on iPhone", location: "Los Angeles, USA", ipAddress: "192.168.1.2", lastActive: "2 hours ago" },
    { id: 3, device: "Firefox on MacOS", location: "London, UK", ipAddress: "192.168.1.3", lastActive: "Yesterday" }
  ]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(passwordData.newPassword);

  const getPasswordStrengthText = (strength: number): string => {
    const labels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];
    return labels[strength] || "Very Weak";
  };

  const getPasswordStrengthColor = (strength: number): string => {
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600"];
    return colors[strength] || "bg-red-500";
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast.error(`Error updating password: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAToggle = (checked: boolean) => {
    setIsTwoFactorEnabled(checked);
    toast.success(checked ? "2FA enabled" : "2FA disabled");
    // In a real app, you would make an API call to enable/disable 2FA
  };

  const handleLogoutAllDevices = async () => {
    try {
      // In a real application, this would make an API call to log out all sessions
      await supabase.auth.signOut({ scope: 'global' });
      setActiveSessions([]);
      toast.success("Logged out from all devices");
    } catch (error: any) {
      toast.error(`Error logging out: ${error.message}`);
    }
  };

  const handleRemoveSession = (id: number) => {
    setActiveSessions(activeSessions.filter(session => session.id !== id));
    toast.success("Session ended");
    // In a real app, you would make an API call to terminate the specific session
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password Management</CardTitle>
          <CardDescription>
            Update your password and manage its security settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
              />
              
              {passwordData.newPassword && (
                <div className="mt-2">
                  <div className="text-sm flex justify-between mb-1">
                    <span>Password Strength:</span>
                    <span className="font-medium">{getPasswordStrengthText(passwordStrength)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className={`h-2.5 rounded-full ${getPasswordStrengthColor(passwordStrength)}`} 
                      style={{ width: `${(passwordStrength + 1) * 20}%` }}
                    ></div>
                  </div>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li className={`flex items-center ${passwordData.newPassword.length >= 8 ? 'text-green-500' : ''}`}>
                      <CheckCircle className={`h-3 w-3 mr-1 ${passwordData.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-500' : ''}`}>
                      <CheckCircle className={`h-3 w-3 mr-1 ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                      At least one uppercase letter
                    </li>
                    <li className={`flex items-center ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-500' : ''}`}>
                      <CheckCircle className={`h-3 w-3 mr-1 ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                      At least one number
                    </li>
                    <li className={`flex items-center ${/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 'text-green-500' : ''}`}>
                      <CheckCircle className={`h-3 w-3 mr-1 ${/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
              />
              {passwordData.newPassword && passwordData.confirmPassword && 
                passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">Passwords don't match</p>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={
                  isLoading || 
                  !passwordData.currentPassword || 
                  !passwordData.newPassword || 
                  !passwordData.confirmPassword ||
                  passwordData.newPassword !== passwordData.confirmPassword
                }
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Protect your account with an additional security layer</p>
              </div>
            </div>
            <Switch
              checked={isTwoFactorEnabled}
              onCheckedChange={handle2FAToggle}
            />
          </div>
          
          {isTwoFactorEnabled && (
            <div className="mt-4">
              <Tabs defaultValue="authenticator" value={twoFactorMethod} onValueChange={setTwoFactorMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="authenticator">Authenticator App</TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                  <TabsTrigger value="backup">Backup Codes</TabsTrigger>
                </TabsList>
                <TabsContent value="authenticator" className="py-4">
                  <div className="text-center space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 mx-auto w-40 h-40 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">QR Code Placeholder</p>
                    </div>
                    <p className="text-sm">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="pt-2">
                      <Label htmlFor="verificationCode">Enter verification code</Label>
                      <div className="flex mt-1">
                        <Input
                          id="verificationCode"
                          placeholder="000000"
                          className="w-32 mx-auto text-center"
                          maxLength={6}
                        />
                      </div>
                      <Button className="mt-4" size="sm">Verify</Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="sms" className="py-4">
                  <div className="space-y-4">
                    <p className="text-sm">
                      We'll send a verification code to your phone each time you log in.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input id="phoneNumber" placeholder="+1 (555) 123-4567" />
                    </div>
                    <Button size="sm">Send Code</Button>
                  </div>
                </TabsContent>
                <TabsContent value="backup" className="py-4">
                  <div className="space-y-4">
                    <p className="text-sm">
                      Save these backup codes in a secure place. You can use each one once if you can't access your authenticator app or phone.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-center">
                          <code>XXXX-XXXX</code>
                        </div>
                      ))}
                    </div>
                    <Button size="sm">Download Codes</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>
            View and manage your active sessions across devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">All devices where you're currently logged in</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10"
                onClick={handleLogoutAllDevices}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Log Out All Devices
              </Button>
            </div>
            
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <div className="text-sm text-muted-foreground space-y-1 mt-1">
                        <p>Location: {session.location}</p>
                        <p>IP Address: {session.ipAddress}</p>
                        <p>Last active: {session.lastActive}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveSession(session.id)}
                    >
                      End Session
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
