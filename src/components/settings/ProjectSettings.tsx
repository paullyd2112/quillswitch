
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Clock, Save, Database, RotateCcw, Archive } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProjectSettings = () => {
  const [defaultSettings, setDefaultSettings] = useState({
    autoMapping: true,
    dataValidation: true,
    errorRetry: 3,
    batchSize: 500,
    retentionPeriod: 90,
    deltaSync: false,
    notifyOnCompletion: true,
    compression: true,
    defaultSource: "salesforce",
    defaultDestination: "hubspot"
  });

  const [retentionPolicies, setRetentionPolicies] = useState([
    { id: 1, type: "Completed Projects", period: 90, autoArchive: true },
    { id: 2, type: "Failed Projects", period: 180, autoArchive: false },
    { id: 3, type: "Log Files", period: 30, autoArchive: true },
    { id: 4, type: "Temporary Files", period: 7, autoArchive: true }
  ]);

  const handleDefaultSettingChange = (name: string, value: any) => {
    setDefaultSettings({
      ...defaultSettings,
      [name]: value
    });
  };

  const handleRetentionPolicyChange = (id: number, field: string, value: any) => {
    const updatedPolicies = retentionPolicies.map(policy => {
      if (policy.id === id) {
        return { ...policy, [field]: value };
      }
      return policy;
    });
    
    setRetentionPolicies(updatedPolicies);
  };

  const handleSaveDefaultSettings = () => {
    toast.success("Default project settings saved");
  };

  const handleSaveRetentionPolicies = () => {
    toast.success("Data retention policies saved");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Default Project Settings</CardTitle>
          <CardDescription>
            Configure default settings for new migration projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultSource">Default Source CRM</Label>
                  <Select
                    value={defaultSettings.defaultSource}
                    onValueChange={(value) => handleDefaultSettingChange("defaultSource", value)}
                  >
                    <SelectTrigger id="defaultSource">
                      <SelectValue placeholder="Select source CRM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="zoho">Zoho</SelectItem>
                      <SelectItem value="dynamics">Microsoft Dynamics</SelectItem>
                      <SelectItem value="pipedrive">Pipedrive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultDestination">Default Destination CRM</Label>
                  <Select
                    value={defaultSettings.defaultDestination}
                    onValueChange={(value) => handleDefaultSettingChange("defaultDestination", value)}
                  >
                    <SelectTrigger id="defaultDestination">
                      <SelectValue placeholder="Select destination CRM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="zoho">Zoho</SelectItem>
                      <SelectItem value="dynamics">Microsoft Dynamics</SelectItem>
                      <SelectItem value="pipedrive">Pipedrive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="autoMapping" className="font-medium">Automated Field Mapping</Label>
                    <p className="text-sm text-muted-foreground">Automatically map fields between systems</p>
                  </div>
                  <Switch
                    id="autoMapping"
                    checked={defaultSettings.autoMapping}
                    onCheckedChange={(checked) => handleDefaultSettingChange("autoMapping", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="dataValidation" className="font-medium">Data Validation</Label>
                    <p className="text-sm text-muted-foreground">Validate data before migration</p>
                  </div>
                  <Switch
                    id="dataValidation"
                    checked={defaultSettings.dataValidation}
                    onCheckedChange={(checked) => handleDefaultSettingChange("dataValidation", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="notifyOnCompletion" className="font-medium">Notification on Completion</Label>
                    <p className="text-sm text-muted-foreground">Notify when projects are completed</p>
                  </div>
                  <Switch
                    id="notifyOnCompletion"
                    checked={defaultSettings.notifyOnCompletion}
                    onCheckedChange={(checked) => handleDefaultSettingChange("notifyOnCompletion", checked)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="batchSize">Batch Size</Label>
                    <span className="text-sm text-muted-foreground">{defaultSettings.batchSize} records</span>
                  </div>
                  <Slider
                    id="batchSize"
                    min={100}
                    max={2000}
                    step={100}
                    value={[defaultSettings.batchSize]}
                    onValueChange={(value) => handleDefaultSettingChange("batchSize", value[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Number of records to process in a single batch
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="errorRetry">Error Retry Attempts</Label>
                    <span className="text-sm text-muted-foreground">{defaultSettings.errorRetry} attempts</span>
                  </div>
                  <Slider
                    id="errorRetry"
                    min={0}
                    max={10}
                    step={1}
                    value={[defaultSettings.errorRetry]}
                    onValueChange={(value) => handleDefaultSettingChange("errorRetry", value[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Number of times to retry failed operations
                  </p>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="compression" className="font-medium">Data Compression</Label>
                    <p className="text-sm text-muted-foreground">Compress data during transfer</p>
                  </div>
                  <Switch
                    id="compression"
                    checked={defaultSettings.compression}
                    onCheckedChange={(checked) => handleDefaultSettingChange("compression", checked)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="integration" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="deltaSync" className="font-medium">Delta Synchronization</Label>
                    <p className="text-sm text-muted-foreground">Only migrate changed records</p>
                  </div>
                  <Switch
                    id="deltaSync"
                    checked={defaultSettings.deltaSync}
                    onCheckedChange={(checked) => handleDefaultSettingChange("deltaSync", checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveDefaultSettings}>
              <Save className="h-4 w-4 mr-1" />
              Save Default Settings
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
          <CardDescription>
            Configure how long project data is retained.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {retentionPolicies.map((policy) => (
              <div key={policy.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{policy.type}</h3>
                    <p className="text-sm text-muted-foreground">Configure retention period</p>
                  </div>
                  <div className="flex items-center">
                    <Label htmlFor={`autoArchive-${policy.id}`} className="mr-2 text-sm">Auto-Archive</Label>
                    <Switch
                      id={`autoArchive-${policy.id}`}
                      checked={policy.autoArchive}
                      onCheckedChange={(checked) => handleRetentionPolicyChange(policy.id, "autoArchive", checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`retention-${policy.id}`}>Retention Period</Label>
                    <span className="text-sm text-muted-foreground">{policy.period} days</span>
                  </div>
                  <Slider
                    id={`retention-${policy.id}`}
                    min={7}
                    max={365}
                    step={1}
                    value={[policy.period]}
                    onValueChange={(value) => handleRetentionPolicyChange(policy.id, "period", value[0])}
                  />
                </div>
              </div>
            ))}
            
            <div className="flex justify-end mt-4">
              <Button onClick={handleSaveRetentionPolicies}>
                <Clock className="h-4 w-4 mr-1" />
                Save Retention Policies
              </Button>
            </div>
            
            <div className="mt-6 flex gap-4">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Data Archiving</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Archive old projects to save storage space while keeping the data accessible.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Archive className="h-4 w-4 mr-1" />
                    Manage Archives
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Data Purging</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete old project data that is no longer needed.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Manage Purging
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSettings;
