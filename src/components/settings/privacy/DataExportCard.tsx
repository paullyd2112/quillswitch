
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, FileText } from "lucide-react";

const DataExportCard = () => {
  const [exportOptions, setExportOptions] = useState({
    includeProjects: true,
    includeMappings: true,
    includeActivityLogs: true,
    includeUserSettings: true,
    format: "json"
  });

  const handleExportData = () => {
    toast.success("Data export prepared. Downloading file...");
    // In a real app, this would trigger an API call to generate and download the export file
  };

  const handleExportOptionChange = (option: string, value: any) => {
    setExportOptions({
      ...exportOptions,
      [option]: value
    });
  };

  return (
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
  );
};

export default DataExportCard;
