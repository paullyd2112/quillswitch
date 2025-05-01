
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DpiaRegister: React.FC = () => {
  const dpiaList = [
    {
      id: 1,
      name: "Customer Data Migration System",
      date: "March 15, 2025",
      status: "Completed",
      risk: "Medium",
      reviewer: "Jane Smith",
    },
    {
      id: 2,
      name: "Automated Data Analysis Feature",
      date: "April 20, 2025",
      status: "In Progress",
      risk: "High",
      reviewer: "John Davis",
    },
    {
      id: 3,
      name: "User Behavior Tracking Implementation",
      date: "May 5, 2025",
      status: "Planned",
      risk: "To Be Determined",
      reviewer: "Anna Johnson",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Data Protection Impact Assessments</CardTitle>
            <CardDescription>
              Assessments for high-risk data processing activities
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New DPIA
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Templates
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All DPIAs</TabsTrigger>
            <TabsTrigger value="active">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {dpiaList.map((dpia) => (
              <div key={dpia.id} className="flex justify-between items-center border rounded-lg p-4">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{dpia.name}</h3>
                    <Badge 
                      variant={
                        dpia.status === "Completed" ? "default" : 
                        dpia.status === "In Progress" ? "outline" : "secondary"
                      }
                      className="ml-2"
                    >
                      {dpia.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Date: {dpia.date} • Risk Level: {dpia.risk} • Reviewer: {dpia.reviewer}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <FileCheck className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="active">
            {dpiaList
              .filter(dpia => dpia.status === "In Progress" || dpia.status === "Planned")
              .map((dpia) => (
                <div key={dpia.id} className="flex justify-between items-center border rounded-lg p-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="font-medium">{dpia.name}</h3>
                      <Badge 
                        variant={dpia.status === "In Progress" ? "outline" : "secondary"}
                        className="ml-2"
                      >
                        {dpia.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Date: {dpia.date} • Risk Level: {dpia.risk} • Reviewer: {dpia.reviewer}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <FileCheck className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
            ))}
          </TabsContent>
          
          <TabsContent value="completed">
            {dpiaList
              .filter(dpia => dpia.status === "Completed")
              .map((dpia) => (
                <div key={dpia.id} className="flex justify-between items-center border rounded-lg p-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="font-medium">{dpia.name}</h3>
                      <Badge className="ml-2">{dpia.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Date: {dpia.date} • Risk Level: {dpia.risk} • Reviewer: {dpia.reviewer}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <FileCheck className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
            ))}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2">When is a DPIA Required?</h4>
          <p className="text-sm text-muted-foreground">
            A Data Protection Impact Assessment is required when processing is likely to result in a high risk to individuals, particularly when:
          </p>
          <ul className="list-disc pl-6 mt-2 text-sm text-muted-foreground">
            <li>Using new technologies</li>
            <li>Processing on a large scale</li>
            <li>Systematic monitoring of individuals</li>
            <li>Processing sensitive data or data about vulnerable subjects</li>
            <li>Automated decision-making with significant effects</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DpiaRegister;
