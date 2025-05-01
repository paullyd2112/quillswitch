
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DataProcessingAgreements: React.FC = () => {
  const agreements = [
    {
      id: 1,
      processor: "CloudHost Services",
      purpose: "Infrastructure hosting",
      signed: "January 15, 2025",
      expires: "January 15, 2026",
      status: "Active",
    },
    {
      id: 2,
      processor: "EmailSender Pro",
      purpose: "Email marketing services",
      signed: "February 3, 2025",
      expires: "February 3, 2026",
      status: "Active",
    },
    {
      id: 3,
      processor: "AnalyticTrack",
      purpose: "User behavior analytics",
      signed: "November 10, 2024",
      expires: "November 10, 2025",
      status: "Active",
    },
    {
      id: 4,
      processor: "CustomerSupportDesk",
      purpose: "Support ticket management",
      signed: "December 22, 2024",
      expires: "June 22, 2025",
      status: "Renewal Required",
    },
    {
      id: 5,
      processor: "NewVendor Inc.",
      purpose: "Payment processing",
      signed: "Pending",
      expires: "N/A",
      status: "Draft",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Data Processing Agreements</CardTitle>
            <CardDescription>
              Legal agreements with third-party data processors
            </CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add New Agreement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Processor</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Signed</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements.map((agreement) => (
                <TableRow key={agreement.id}>
                  <TableCell className="font-medium">{agreement.processor}</TableCell>
                  <TableCell>{agreement.purpose}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        agreement.status === "Active" ? "default" : 
                        agreement.status === "Draft" ? "outline" : "secondary"
                      }
                      className={agreement.status === "Renewal Required" ? "bg-amber-500" : ""}
                    >
                      {agreement.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{agreement.signed}</TableCell>
                  <TableCell>
                    {agreement.status === "Renewal Required" ? (
                      <div className="flex items-center text-amber-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {agreement.expires}
                      </div>
                    ) : agreement.expires}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      {agreement.status === "Draft" && (
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Sign</span>
                        </Button>
                      )}
                      {agreement.status === "Renewal Required" && (
                        <Button variant="ghost" size="sm" className="text-amber-500">
                          <AlertCircle className="h-4 w-4" />
                          <span className="sr-only">Renew</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 space-y-4">
          <h3 className="font-medium">DPA Requirements Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Required Content for DPAs</h4>
              <ul className="text-xs space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  Subject matter and duration of processing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  Nature and purpose of processing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  Types of personal data processed
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  Categories of data subjects
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  Controller's obligations and rights
                </li>
              </ul>
            </div>
            
            <div className="border p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Processor Obligations</h4>
              <ul className="text-xs space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  Process data only on documented instructions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  Ensure confidentiality commitments
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  Implement appropriate security measures
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  Assist with data subject rights requests
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  Assist with breach notifications
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            Under GDPR Article 28, whenever a controller uses a processor to process personal data on their behalf, 
            a written contract must be in place. These Data Processing Agreements (DPAs) establish the processor's obligations 
            regarding data security, confidentiality, and compliance with GDPR requirements.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataProcessingAgreements;
