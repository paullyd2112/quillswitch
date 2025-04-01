
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, CreditCard, Download, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BillingSettings = () => {
  const invoices = [
    {
      id: "INV-001",
      date: "May 15, 2023",
      amount: "$99.00",
      status: "paid",
    },
    {
      id: "INV-002",
      date: "June 15, 2023",
      amount: "$99.00",
      status: "paid",
    },
    {
      id: "INV-003",
      date: "July 15, 2023",
      amount: "$99.00",
      status: "paid",
    },
    {
      id: "INV-004",
      date: "August 15, 2023",
      amount: "$99.00",
      status: "pending",
    },
  ];

  const paymentMethods = [
    {
      id: "pm_1",
      type: "visa",
      last4: "4242",
      expiry: "04/24",
      isDefault: true,
    },
    {
      id: "pm_2",
      type: "mastercard",
      last4: "5555",
      expiry: "08/25",
      isDefault: false,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>
            Manage your subscription and billing information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Current Plan</div>
              <div className="text-lg font-medium mt-1">Professional</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Billing Cycle</div>
              <div className="text-lg font-medium mt-1">Monthly</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Next Payment</div>
              <div className="text-lg font-medium mt-1">August 15, 2023</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Change Plan</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between border rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-md">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium capitalize">
                    {method.type} •••• {method.last4}
                    {method.isDefault && (
                      <Badge variant="outline" className="ml-2">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Expires {method.expiry}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                {!method.isDefault && (
                  <Button variant="outline" size="sm">
                    Set as Default
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div className="mt-4">
            <Button variant="outline" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View and download your past invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "paid" ? "success" : "outline"}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSettings;
