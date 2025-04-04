
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  AlertTriangle,
  Download,
  FileText,
  Lock,
  Trash2,
  ExternalLink,
  Check,
  X,
  Info,
  Search,
  ShieldAlert
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const DataPrivacySettings = () => {
  const [exportOptions, setExportOptions] = useState({
    includeProjects: true,
    includeMappings: true,
    includeActivityLogs: true,
    includeUserSettings: true,
    format: "json"
  });
  
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [dataRetentionConsent, setDataRetentionConsent] = useState(true);
  const [dataProcessingConsent, setDataProcessingConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const handleExportData = () => {
    toast.success("Data export prepared. Downloading file...");
    // In a real app, this would trigger an API call to generate and download the export file
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE MY ACCOUNT") {
      toast.error("Please type DELETE MY ACCOUNT to confirm");
      return;
    }
    
    // In a real app, this would make an API call to delete the user's account
    toast.success("Account deletion initiated. You will be logged out soon.");
    setShowDeleteDialog(false);
    
    // Simulate logout after account deletion
    setTimeout(() => {
      // window.location.href = "/";
    }, 3000);
  };

  const handleExportOptionChange = (option: string, value: any) => {
    setExportOptions({
      ...exportOptions,
      [option]: value
    });
  };

  const handleConsentChange = (consent: string, value: boolean) => {
    switch (consent) {
      case "retention":
        setDataRetentionConsent(value);
        break;
      case "processing":
        setDataProcessingConsent(value);
        break;
      case "marketing":
        setMarketingConsent(value);
        break;
    }
    
    toast.success(`Consent preferences updated`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>
            Export your account data in a machine-readable format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select what data you would like to include in your export:
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="includeProjects" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  Migration Projects
                </Label>
                <Switch
                  id="includeProjects"
                  checked={exportOptions.includeProjects}
                  onCheckedChange={(checked) => handleExportOptionChange("includeProjects", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeMappings" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  Field Mappings
                </Label>
                <Switch
                  id="includeMappings"
                  checked={exportOptions.includeMappings}
                  onCheckedChange={(checked) => handleExportOptionChange("includeMappings", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeActivityLogs" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  Activity Logs
                </Label>
                <Switch
                  id="includeActivityLogs"
                  checked={exportOptions.includeActivityLogs}
                  onCheckedChange={(checked) => handleExportOptionChange("includeActivityLogs", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeUserSettings" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  User Settings & Preferences
                </Label>
                <Switch
                  id="includeUserSettings"
                  checked={exportOptions.includeUserSettings}
                  onCheckedChange={(checked) => handleExportOptionChange("includeUserSettings", checked)}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Label htmlFor="exportFormat">Export Format</Label>
              <Select
                value={exportOptions.format}
                onValueChange={(value) => handleExportOptionChange("format", value)}
              >
                <SelectTrigger id="exportFormat">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the format for your exported data
              </p>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button onClick={handleExportData}>
                <Download className="h-4 w-4 mr-1" />
                Export Data
              </Button>
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>
                Exports are generated asynchronously and may take a few minutes to prepare, depending on the amount of data.
                You will receive an email when your export is ready for download.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Consent Management</CardTitle>
          <CardDescription>
            Manage your consent for how we handle your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                    Data Retention
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We store your data to provide our services and maintain your account.
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-xs mr-2">Required</span>
                  <Switch
                    checked={dataRetentionConsent}
                    onCheckedChange={(checked) => handleConsentChange("retention", checked)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This is required to provide core functionalities of our service. If disabled, you won't be able to use our product.
              </p>
            </div>
            
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-2 text-muted-foreground" />
                    Data Processing
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We process your data to improve our services and provide personalized features.
                  </p>
                </div>
                <Switch
                  checked={dataProcessingConsent}
                  onCheckedChange={(checked) => handleConsentChange("processing", checked)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This allows us to analyze your usage patterns to provide better recommendations and improve our service.
              </p>
            </div>
            
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    Marketing Communications
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We send you updates about new features, promotions, and related products.
                  </p>
                </div>
                <Switch
                  checked={marketingConsent}
                  onCheckedChange={(checked) => handleConsentChange("marketing", checked)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                You can opt out of marketing emails at any time through your account settings or by clicking "unsubscribe" in any marketing email.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy & Terms</CardTitle>
          <CardDescription>
            Review our legal documents and privacy practices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Privacy Policy</h3>
                    <p className="text-sm text-muted-foreground">Last updated: March 15, 2023</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Terms of Service</h3>
                    <p className="text-sm text-muted-foreground">Last updated: February 28, 2023</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Data Processing Agreement</h3>
                    <p className="text-sm text-muted-foreground">Last updated: January 10, 2023</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="text-red-600 dark:text-red-500">
          <CardTitle>Delete Account</CardTitle>
          <CardDescription className="text-red-600/70 dark:text-red-500/70">
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning: This action cannot be undone</AlertTitle>
            <AlertDescription>
              Deleting your account will permanently remove all your data, including migration projects, configurations, and settings.
            </AlertDescription>
          </Alert>
          
          <div className="mt-6">
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete My Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="deleteReason">Why are you deleting your account? (Optional)</Label>
                    <Textarea
                      id="deleteReason"
                      placeholder="Please share your feedback..."
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deleteConfirmation" className="text-red-500 font-medium">
                      Type "DELETE MY ACCOUNT" to confirm
                    </Label>
                    <Input
                      id="deleteConfirmation"
                      placeholder="DELETE MY ACCOUNT"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      className="border-red-200 focus-visible:ring-red-500"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== "DELETE MY ACCOUNT"}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <p className="text-sm text-muted-foreground mt-4">
              If you have active subscriptions, they will be canceled when you delete your account.
              Any pending invoices will still need to be paid.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPrivacySettings;
