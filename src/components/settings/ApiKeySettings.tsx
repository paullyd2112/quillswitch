
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Copy, Plus, Key, AlertTriangle, Activity, Shield, Eye, EyeOff, RefreshCw, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ApiKeySettings = () => {
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: "Production Key", prefix: "pk_", created: "March 15, 2023", lastUsed: "Today", status: "active", usageLimit: 10000, currentUsage: 4567 },
    { id: 2, name: "Development Key", prefix: "dk_", created: "April 2, 2023", lastUsed: "2 days ago", status: "active", usageLimit: 5000, currentUsage: 1230 },
    { id: 3, name: "Test Key", prefix: "tk_", created: "January 10, 2023", lastUsed: "1 month ago", status: "inactive", usageLimit: 2000, currentUsage: 542 }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKey, setNewKey] = useState({
    name: "",
    type: "read",
    expiresIn: "never",
    usageLimit: 5000
  });
  
  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
    setGeneratedKey(null);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setNewKey({
      name: "",
      type: "read",
      expiresIn: "never",
      usageLimit: 5000
    });
  };

  const handleCreateKey = () => {
    // In a real app, this would make an API call to generate an API key
    const mockGeneratedKey = "sk_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setGeneratedKey(mockGeneratedKey);
    
    // Add the new key to the list
    const newId = apiKeys.length > 0 ? Math.max(...apiKeys.map(k => k.id)) + 1 : 1;
    const newApiKey = {
      id: newId,
      name: newKey.name,
      prefix: newKey.type === "read" ? "pk_" : "sk_",
      created: "Today",
      lastUsed: "Never",
      status: "active",
      usageLimit: newKey.usageLimit,
      currentUsage: 0
    };
    
    setApiKeys([...apiKeys, newApiKey]);
    toast.success("API key created successfully");
  };

  const handleCopyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      toast.success("API key copied to clipboard");
    }
  };

  const handleRevokeKey = (id: number) => {
    const updatedKeys = apiKeys.map(key => {
      if (key.id === id) {
        return { ...key, status: "inactive" };
      }
      return key;
    });
    
    setApiKeys(updatedKeys);
    toast.success("API key revoked");
  };

  const handleDeleteKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success("API key deleted");
  };

  const handleToggleKeyStatus = (id: number) => {
    const updatedKeys = apiKeys.map(key => {
      if (key.id === id) {
        const newStatus = key.status === "active" ? "inactive" : "active";
        return { ...key, status: newStatus };
      }
      return key;
    });
    
    setApiKeys(updatedKeys);
    toast.success(`API key ${updatedKeys.find(k => k.id === id)?.status === "active" ? "activated" : "deactivated"}`);
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min(100, Math.round((current / limit) * 100));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for programmatic access to your account.
              </CardDescription>
            </div>
            <Button onClick={handleShowCreateForm}>
              <Plus className="h-4 w-4 mr-1" />
              Create API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && !generatedKey && (
            <div className="border rounded-lg p-4 mb-6 space-y-4">
              <h3 className="font-medium text-lg">Create New API Key</h3>
              
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production Key"
                  value={newKey.name}
                  onChange={(e) => setNewKey({...newKey, name: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  A descriptive name to identify this API key
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keyType">Key Type</Label>
                <Select
                  value={newKey.type}
                  onValueChange={(value) => setNewKey({...newKey, type: value})}
                >
                  <SelectTrigger id="keyType">
                    <SelectValue placeholder="Select key type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read-only</SelectItem>
                    <SelectItem value="write">Read & Write</SelectItem>
                    <SelectItem value="admin">Admin (Full Access)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Determines what actions this key can perform
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiresIn">Expiration</Label>
                <Select
                  value={newKey.expiresIn}
                  onValueChange={(value) => setNewKey({...newKey, expiresIn: value})}
                >
                  <SelectTrigger id="expiresIn">
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="180d">180 Days</SelectItem>
                    <SelectItem value="365d">1 Year</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  When this API key will expire
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <span className="text-sm text-muted-foreground">{newKey.usageLimit.toLocaleString()} API calls</span>
                </div>
                <Slider
                  id="usageLimit"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={[newKey.usageLimit]}
                  onValueChange={(value) => setNewKey({...newKey, usageLimit: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of API calls per month
                </p>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleCancelCreate}>Cancel</Button>
                <Button 
                  onClick={handleCreateKey}
                  disabled={!newKey.name}
                >
                  Create Key
                </Button>
              </div>
            </div>
          )}
          
          {generatedKey && (
            <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/50">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              <AlertTitle>Save your API key</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-2">This is the only time your API key will be displayed. Save it somewhere secure.</p>
                <div className="flex items-center mt-2 mb-4">
                  <Input 
                    value={generatedKey} 
                    readOnly 
                    type={showSecretKey ? "text" : "password"}
                    className="font-mono"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="ml-2"
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyKey}
                    className="ml-2"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setGeneratedKey(null)}>
                  Done
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {apiKeys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Key className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No API keys yet. Create your first API key to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{key.name}</p>
                          <p className="text-xs text-muted-foreground">{key.prefix}•••••••••••</p>
                        </div>
                      </TableCell>
                      <TableCell>{key.created}</TableCell>
                      <TableCell>{key.lastUsed}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs">{key.currentUsage.toLocaleString()} / {key.usageLimit.toLocaleString()} calls</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div 
                              className={`h-1.5 rounded-full ${getUsagePercentage(key.currentUsage, key.usageLimit) > 80 ? 'bg-red-500' : 'bg-green-500'}`} 
                              style={{ width: `${getUsagePercentage(key.currentUsage, key.usageLimit)}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          key.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                          {key.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleKeyStatus(key.id)}
                            title={key.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {key.status === 'active' ? (
                              <Shield className="h-4 w-4 text-red-500" />
                            ) : (
                              <Shield className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRevokeKey(key.id)}
                            title="Revoke"
                            className="text-amber-500"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteKey(key.id)}
                            title="Delete"
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Usage Analytics</CardTitle>
          <CardDescription>
            Monitor your API usage and set up alerts for usage limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Current Monthly Usage</h3>
              <div className="flex items-center mb-3">
                <Activity className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-semibold">
                  {apiKeys.reduce((sum, key) => sum + key.currentUsage, 0).toLocaleString()} 
                  <span className="text-base font-normal text-muted-foreground">
                    / {apiKeys.reduce((sum, key) => sum + key.usageLimit, 0).toLocaleString()} API calls
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="h-2.5 rounded-full bg-blue-500" 
                  style={{ 
                    width: `${Math.min(100, Math.round(
                      (apiKeys.reduce((sum, key) => sum + key.currentUsage, 0) / 
                      apiKeys.reduce((sum, key) => sum + key.usageLimit, 0)) * 100
                    ))}%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Billing period resets in 12 days
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Usage Alerts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">80% of limit reached</p>
                      <p className="text-xs text-muted-foreground">Email notification</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">90% of limit reached</p>
                      <p className="text-xs text-muted-foreground">Email & SMS notification</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">100% of limit reached</p>
                      <p className="text-xs text-muted-foreground">Email & SMS notification</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Rate Limiting</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Requests per minute</Label>
                      <span className="text-sm">100</span>
                    </div>
                    <Slider
                      min={10}
                      max={1000}
                      step={10}
                      value={[100]}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Requests per hour</Label>
                      <span className="text-sm">1,000</span>
                    </div>
                    <Slider
                      min={100}
                      max={10000}
                      step={100}
                      value={[1000]}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Label htmlFor="throttling">Auto-throttling</Label>
                    <Switch id="throttling" checked={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySettings;
