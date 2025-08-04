import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Filter, MapPin, Calendar, Users, Target, BarChart3 } from "lucide-react";

interface FilterCriteria {
  id: string;
  type: "percentage" | "geographic" | "date" | "custom";
  label: string;
  enabled: boolean;
  config: any;
}

const SubsetSelectionConfig: React.FC = () => {
  const [samplePercentage, setSamplePercentage] = useState([25]);
  const [filters, setFilters] = useState<FilterCriteria[]>([
    {
      id: "percentage",
      type: "percentage",
      label: "Random Sampling",
      enabled: true,
      config: { percentage: 25 }
    },
    {
      id: "geographic",
      type: "geographic",
      label: "Geographic Filter",
      enabled: false,
      config: { regions: [], countries: [] }
    },
    {
      id: "date",
      type: "date",
      label: "Date Range",
      enabled: false,
      config: { startDate: "", endDate: "" }
    },
    {
      id: "custom",
      type: "custom",
      label: "Custom Criteria",
      enabled: false,
      config: { conditions: [] }
    }
  ]);

  const toggleFilter = (id: string, enabled: boolean) => {
    setFilters(filters.map(filter => 
      filter.id === id ? { ...filter, enabled } : filter
    ));
  };

  const getEstimatedRecords = () => {
    const baseRecords = 50000; // Example total
    let multiplier = samplePercentage[0] / 100;
    
    if (filters.find(f => f.id === "geographic" && f.enabled)) {
      multiplier *= 0.3; // Geographic filter reduces by ~70%
    }
    if (filters.find(f => f.id === "date" && f.enabled)) {
      multiplier *= 0.5; // Date range reduces by ~50%
    }
    
    return Math.round(baseRecords * multiplier);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Intelligent Subset Selection
          </CardTitle>
          <CardDescription>
            Create manageable test datasets by selecting specific subsets of your production data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Random Sampling</h4>
                  <Badge variant={filters[0].enabled ? "default" : "secondary"}>
                    {filters[0].enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters[0].enabled}
                      onCheckedChange={(checked) => toggleFilter("percentage", !!checked)}
                    />
                    <Label>Enable random sampling</Label>
                  </div>
                  {filters[0].enabled && (
                    <>
                      <Slider
                        value={samplePercentage}
                        onValueChange={setSamplePercentage}
                        max={100}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1%</span>
                        <span className="font-medium">{samplePercentage[0]}% of data</span>
                        <span>100%</span>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-secondary" />
                  <h4 className="font-semibold">Geographic Filter</h4>
                  <Badge variant={filters[1].enabled ? "default" : "secondary"}>
                    {filters[1].enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters[1].enabled}
                      onCheckedChange={(checked) => toggleFilter("geographic", !!checked)}
                    />
                    <Label>Filter by location</Label>
                  </div>
                  {filters[1].enabled && (
                    <div className="space-y-3">
                      <div>
                        <Label>Regions</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select regions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="north-america">North America</SelectItem>
                            <SelectItem value="europe">Europe</SelectItem>
                            <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                            <SelectItem value="latin-america">Latin America</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Specific Countries</Label>
                        <Input placeholder="e.g., United States, Canada" />
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-accent" />
                  <h4 className="font-semibold">Date Range</h4>
                  <Badge variant={filters[2].enabled ? "default" : "secondary"}>
                    {filters[2].enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters[2].enabled}
                      onCheckedChange={(checked) => toggleFilter("date", !!checked)}
                    />
                    <Label>Filter by date range</Label>
                  </div>
                  {filters[2].enabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Start Date</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Selection Summary</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Records Available</span>
                    <Badge variant="outline">50,000</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated Selected</span>
                    <Badge variant="default">{getEstimatedRecords().toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reduction Ratio</span>
                    <Badge variant="secondary">
                      {((1 - getEstimatedRecords() / 50000) * 100).toFixed(1)}% smaller
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3">Advanced Options</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox defaultChecked />
                    <Label>Maintain referential integrity</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox defaultChecked />
                    <Label>Include related records</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox />
                    <Label>Stratified sampling</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox />
                    <Label>Preserve data distribution</Label>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3">Export Options</h4>
                <div className="space-y-3">
                  <Select defaultValue="sandbox">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">QuillSandbox Environment</SelectItem>
                      <SelectItem value="development">Development CRM</SelectItem>
                      <SelectItem value="staging">Staging Environment</SelectItem>
                      <SelectItem value="download">Download as Files</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Save Selection Criteria
        </Button>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Create Subset
        </Button>
      </div>
    </div>
  );
};

export default SubsetSelectionConfig;