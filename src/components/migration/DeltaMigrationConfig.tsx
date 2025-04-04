
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, RefreshCw, HistoryIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DeltaMigrationConfigProps {
  projectId: string;
  onSave: (config: DeltaMigrationConfig) => void;
}

interface DeltaMigrationConfig {
  enabled: boolean;
  syncFrequency: string;
  syncTime?: string;
  syncDays?: string[];
  recordCriteria: string;
  lastSyncDate?: Date;
  customDuration?: number;
  customDurationUnit?: string;
}

const DeltaMigrationConfig: React.FC<DeltaMigrationConfigProps> = ({ projectId, onSave }) => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [config, setConfig] = useState<DeltaMigrationConfig>({
    enabled: false,
    syncFrequency: "daily",
    syncTime: "00:00",
    syncDays: ["monday", "wednesday", "friday"],
    recordCriteria: "modified",
    customDuration: 7,
    customDurationUnit: "days"
  });
  const [date, setDate] = useState<Date>();

  const handleToggleEnable = (checked: boolean) => {
    setConfig(prev => ({ ...prev, enabled: checked }));
  };

  const handleSyncFrequencyChange = (value: string) => {
    setConfig(prev => ({ ...prev, syncFrequency: value }));
  };

  const handleRecordCriteriaChange = (value: string) => {
    setConfig(prev => ({ ...prev, recordCriteria: value }));
  };

  const handleCustomDurationChange = (value: string) => {
    setConfig(prev => ({ ...prev, customDuration: parseInt(value) || 0 }));
  };

  const handleCustomDurationUnitChange = (value: string) => {
    setConfig(prev => ({ ...prev, customDurationUnit: value }));
  };

  const handleSaveConfig = () => {
    onSave(config);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Delta Migration Configuration</CardTitle>
            <CardDescription>
              Configure incremental data synchronization settings
            </CardDescription>
          </div>
          <Switch 
            checked={config.enabled} 
            onCheckedChange={handleToggleEnable} 
            id="delta-enabled"
          />
        </div>
      </CardHeader>
      <CardContent className={cn(config.enabled ? "" : "opacity-50 pointer-events-none")}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="criteria">Record Criteria</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sync-frequency">Sync Frequency</Label>
                <Select value={config.syncFrequency} onValueChange={handleSyncFrequencyChange}>
                  <SelectTrigger id="sync-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {config.syncFrequency === 'daily' && (
                <div className="space-y-2">
                  <Label htmlFor="sync-time">Sync Time</Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="sync-time" 
                      type="time" 
                      value={config.syncTime} 
                      onChange={(e) => setConfig(prev => ({ ...prev, syncTime: e.target.value }))}
                    />
                  </div>
                </div>
              )}
              
              {config.syncFrequency === 'weekly' && (
                <div className="space-y-2">
                  <Label>Sync Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                      <Button
                        key={day}
                        type="button"
                        variant={config.syncDays?.includes(day) ? "default" : "outline"}
                        className="text-xs"
                        onClick={() => {
                          const newDays = config.syncDays?.includes(day)
                            ? config.syncDays.filter(d => d !== day)
                            : [...(config.syncDays || []), day];
                          setConfig(prev => ({ ...prev, syncDays: newDays }));
                        }}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {config.syncFrequency === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-duration">Every</Label>
                    <Input 
                      id="custom-duration" 
                      type="number" 
                      min="1" 
                      value={config.customDuration} 
                      onChange={(e) => handleCustomDurationChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-duration-unit">Unit</Label>
                    <Select value={config.customDurationUnit} onValueChange={handleCustomDurationUnitChange}>
                      <SelectTrigger id="custom-duration-unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div>
                <div className="mb-2">
                  <Label>Starting Point</Label>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="latest-sync" 
                      checked={!date} 
                      onCheckedChange={(checked) => {
                        if (checked) setDate(undefined);
                      }}
                    />
                    <Label htmlFor="latest-sync" className="cursor-pointer">Use last successful sync</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="custom-date" 
                      checked={!!date} 
                      onCheckedChange={(checked) => {
                        if (checked && !date) setDate(new Date());
                      }}
                    />
                    <Label htmlFor="custom-date" className="cursor-pointer">Use custom date</Label>
                    
                    {date && (
                      <div className="ml-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(date) => {
                                setDate(date);
                                setConfig(prev => ({ ...prev, lastSyncDate: date || undefined }));
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="criteria" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="record-criteria">Record Selection Criteria</Label>
                <Select value={config.recordCriteria} onValueChange={handleRecordCriteriaChange}>
                  <SelectTrigger id="record-criteria">
                    <SelectValue placeholder="Select criteria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modified">Modified Since Last Sync</SelectItem>
                    <SelectItem value="created">Created Since Last Sync</SelectItem>
                    <SelectItem value="both">Created or Modified Since Last Sync</SelectItem>
                  </SelectContent>
                </Select>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {config.recordCriteria === 'modified' && 
                    "Only records that have been updated since the last sync will be processed."}
                  {config.recordCriteria === 'created' && 
                    "Only new records created since the last sync will be processed."}
                  {config.recordCriteria === 'both' && 
                    "Both new and updated records since the last sync will be processed."}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveConfig} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Save Delta Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeltaMigrationConfig;
