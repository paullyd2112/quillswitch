import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Target, Calendar, Filter, Database, AlertTriangle, CheckCircle2 } from "lucide-react";

interface RollbackSelection {
  snapshotVersion: string;
  objectTypes: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  customFilters: string[];
  rollbackMode: "selective" | "complete" | "preview";
}

const SelectiveRollback: React.FC = () => {
  const [selection, setSelection] = useState<RollbackSelection>({
    snapshotVersion: "",
    objectTypes: [],
    dateRange: { start: null, end: null },
    customFilters: [],
    rollbackMode: "selective"
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const availableObjects = [
    { id: "accounts", name: "Accounts", count: 15000, size: "2.1 GB" },
    { id: "contacts", name: "Contacts", count: 45000, size: "3.8 GB" },
    { id: "opportunities", name: "Opportunities", count: 8500, size: "1.2 GB" },
    { id: "leads", name: "Leads", count: 12000, size: "800 MB" },
    { id: "cases", name: "Cases", count: 3500, size: "450 MB" },
    { id: "activities", name: "Activities", count: 125000, size: "4.2 GB" }
  ];

  const availableSnapshots = [
    { version: "v2.1.0", name: "Pre-Migration Snapshot", date: "2024-01-16 10:30:00" },
    { version: "v2.0.8", name: "Weekly Backup", date: "2024-01-15 02:00:00" },
    { version: "v2.0.7", name: "Manual Checkpoint", date: "2024-01-14 16:45:00" }
  ];

  const handleObjectToggle = (objectId: string, checked: boolean) => {
    setSelection(prev => ({
      ...prev,
      objectTypes: checked 
        ? [...prev.objectTypes, objectId]
        : prev.objectTypes.filter(id => id !== objectId)
    }));
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const getSelectedObjectsCount = () => {
    return availableObjects
      .filter(obj => selection.objectTypes.includes(obj.id))
      .reduce((total, obj) => total + obj.count, 0);
  };

  const getSelectedDataSize = () => {
    const totalMB = availableObjects
      .filter(obj => selection.objectTypes.includes(obj.id))
      .reduce((total, obj) => {
        const sizeStr = obj.size;
        const size = parseFloat(sizeStr);
        const unit = sizeStr.includes('GB') ? 1024 : 1;
        return total + (size * unit);
      }, 0);
    
    return totalMB > 1024 ? `${(totalMB / 1024).toFixed(1)} GB` : `${totalMB.toFixed(0)} MB`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Selective Rollback Configuration
          </CardTitle>
          <CardDescription>
            Choose exactly which data to revert to a previous state with precision controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Select Snapshot Version
                </h4>
                <Select 
                  value={selection.snapshotVersion} 
                  onValueChange={(value) => setSelection(prev => ({ ...prev, snapshotVersion: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose snapshot to revert to" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSnapshots.map((snapshot) => (
                      <SelectItem key={snapshot.version} value={snapshot.version}>
                        {snapshot.name} ({snapshot.version}) - {snapshot.date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Range Filter (Optional)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Start Date</Label>
                    <DatePicker
                      date={selection.dateRange.start}
                      onDateChange={(date) => setSelection(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: date }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <DatePicker
                      date={selection.dateRange.end}
                      onDateChange={(date) => setSelection(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: date }
                      }))}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Only revert records created or modified within this date range
                </p>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Rollback Mode
                </h4>
                <Select 
                  value={selection.rollbackMode} 
                  onValueChange={(value: "selective" | "complete" | "preview") => 
                    setSelection(prev => ({ ...prev, rollbackMode: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preview">Preview Only (No Changes)</SelectItem>
                    <SelectItem value="selective">Selective Rollback</SelectItem>
                    <SelectItem value="complete">Complete Rollback</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm">
                    {selection.rollbackMode === "preview" && "Generate impact analysis without making changes"}
                    {selection.rollbackMode === "selective" && "Revert only selected objects and date ranges"}
                    {selection.rollbackMode === "complete" && "Revert all data to the selected snapshot state"}
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Select Objects to Rollback</h4>
                <div className="space-y-3">
                  {availableObjects.map((object) => (
                    <div key={object.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selection.objectTypes.includes(object.id)}
                          onCheckedChange={(checked) => handleObjectToggle(object.id, !!checked)}
                        />
                        <div>
                          <div className="font-medium">{object.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {object.count.toLocaleString()} records • {object.size}
                          </div>
                        </div>
                      </div>
                      <Badge variant={selection.objectTypes.includes(object.id) ? "default" : "outline"}>
                        {selection.objectTypes.includes(object.id) ? "Selected" : "Available"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-4">Selection Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Objects Selected:</span>
                    <span className="font-medium">{selection.objectTypes.length} of {availableObjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Records Affected:</span>
                    <span className="font-medium">{getSelectedObjectsCount().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Size:</span>
                    <span className="font-medium">{getSelectedDataSize()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Snapshot Version:</span>
                    <span className="font-medium">{selection.snapshotVersion || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mode:</span>
                    <Badge variant="secondary">
                      {selection.rollbackMode.charAt(0).toUpperCase() + selection.rollbackMode.slice(1)}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Safety Notice</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• All rollback operations are logged for audit compliance</li>
                  <li>• A pre-rollback snapshot will be automatically created</li>
                  <li>• Related records may be affected by referential integrity rules</li>
                  <li>• Preview mode is recommended before executing actual rollbacks</li>
                </ul>
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Save Configuration
        </Button>
        <Button onClick={handleAnalyze} disabled={isAnalyzing || !selection.snapshotVersion}>
          {isAnalyzing ? (
            <>
              <Target className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Impact...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Analyze Impact
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SelectiveRollback;