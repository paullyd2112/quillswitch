
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Download, Plus } from "lucide-react";

const DataProcessingRegister: React.FC = () => {
  const processingActivities = [
    {
      id: 1,
      activity: "User Registration",
      purpose: "Account creation and service provision",
      dataCategories: "Identity, contact information",
      dataSubjects: "Customers",
      retention: "Duration of account + 30 days after deletion",
      security: "Encryption, access controls",
      recipients: "Internal only",
      transfers: "None",
    },
    {
      id: 2,
      activity: "Newsletter Subscription",
      purpose: "Marketing communications",
      dataCategories: "Email address, name",
      dataSubjects: "Subscribers",
      retention: "Until unsubscribe",
      security: "Encryption, access controls",
      recipients: "Email service provider",
      transfers: "EU-based email provider",
    },
    {
      id: 3,
      activity: "Data Migration",
      purpose: "Customer-requested data transfer between systems",
      dataCategories: "Business data, contact records",
      dataSubjects: "Customer's contacts and accounts",
      retention: "30 days after migration completion",
      security: "End-to-end encryption, access controls",
      recipients: "Destination system",
      transfers: "As specified by customer",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Data Processing Register</CardTitle>
            <CardDescription>
              Record of all data processing activities as required by GDPR Article 30
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Activity
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Processing Activity</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Data Categories</TableHead>
                <TableHead>Retention</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processingActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.activity}</TableCell>
                  <TableCell>{activity.purpose}</TableCell>
                  <TableCell>{activity.dataCategories}</TableCell>
                  <TableCell>{activity.retention}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          This register documents all processing activities involving personal data, as required by GDPR Article 30. 
          It should be regularly updated to reflect any changes in processing activities.
        </p>
      </CardContent>
    </Card>
  );
};

export default DataProcessingRegister;
