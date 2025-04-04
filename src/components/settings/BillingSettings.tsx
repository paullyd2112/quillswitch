
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Download, Plus, Clock, DollarSign, BarChart4 } from "lucide-react";

const BillingSettings = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "Visa", last4: "4242", expiry: "04/25", isDefault: true },
    { id: 2, type: "Mastercard", last4: "5555", expiry: "09/24", isDefault: false }
  ]);

  const [invoices, setInvoices] = useState([
    { id: "INV-001", date: "Apr 1, 2023", amount: "$49.00", status: "Paid", project: "Salesforce Migration" },
    { id: "INV-002", date: "Mar 1, 2023", amount: "$49.00", status: "Paid", project: "Salesforce Migration" },
    { id: "INV-003", date: "Feb 1, 2023", amount: "$99.00", status: "Paid", project: "HubSpot Migration" },
    { id: "INV-004", date: "Jan 1, 2023", amount: "$49.00", status: "Paid", project: "Zoho Migration" }
  ]);

  const [usageData, setUsageData] = useState([
    { project: "Salesforce Migration", recordsMigrated: 10500, dataVolume: "1.2 GB", apiCalls: 8240, cost: "$45.00" },
    { project: "HubSpot Migration", recordsMigrated: 22300, dataVolume: "3.5 GB", apiCalls: 15320, cost: "$89.00" },
    { project: "Zoho Migration", recordsMigrated: 5100, dataVolume: "0.8 GB", apiCalls: 4120, cost: "$25.00" }
  ]);

  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvc: ""
  });

  const handleAddPaymentMethod = () => {
    // In a real app, this would interact with a payment processor like Stripe
    toast.success("Payment method added successfully");
    setIsAddingPaymentMethod(false);
    
    // Mock adding a new payment method
    const newMethod = {
      id: paymentMethods.length + 1,
      type: "Visa",
      last4: newPaymentMethod.cardNumber.slice(-4),
      expiry: newPaymentMethod.expiry,
      isDefault: false
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setNewPaymentMethod({
      cardNumber: "",
      cardHolder: "",
      expiry: "",
      cvc: ""
    });
  };

  const handleSetDefaultPaymentMethod = (id: number) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    setPaymentMethods(updatedMethods);
    toast.success("Default payment method updated");
  };

  const handleRemovePaymentMethod = (id: number) => {
    // Don't allow removing the default payment method
    if (paymentMethods.find(m => m.id === id)?.isDefault) {
      toast.error("Cannot remove default payment method");
      return;
    }
    
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast.success("Payment method removed");
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}`);
    // In a real app, this would download the invoice PDF
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Current Usage & Estimates</CardTitle>
              <CardDescription>
                Track your current usage and estimated costs for active projects.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <BarChart4 className="h-4 w-4 mr-1" />
              Detailed Analytics
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Records Migrated</TableHead>
                <TableHead className="text-right">Data Volume</TableHead>
                <TableHead className="text-right">API Calls</TableHead>
                <TableHead className="text-right">Estimated Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.project}</TableCell>
                  <TableCell className="text-right">{item.recordsMigrated.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.dataVolume}</TableCell>
                  <TableCell className="text-right">{item.apiCalls.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">{item.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableRow className="bg-muted/50">
              <TableCell className="font-medium">Total</TableCell>
              <TableCell className="text-right font-medium">
                {usageData.reduce((sum, item) => sum + item.recordsMigrated, 0).toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-medium">
                5.5 GB
              </TableCell>
              <TableCell className="text-right font-medium">
                {usageData.reduce((sum, item) => sum + item.apiCalls, 0).toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-medium">
                $159.00
              </TableCell>
            </TableRow>
          </Table>
          
          <div className="mt-6 border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-2" />
              <p className="text-sm font-medium">Current Billing Cycle: April 1 - April 30, 2023</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Usage is calculated based on records migrated, data volume, and API calls. Costs are estimated and will be finalized at the end of the billing cycle.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods and billing preferences.
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsAddingPaymentMethod(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingPaymentMethod ? (
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-medium">Add New Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={newPaymentMethod.cardNumber}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    placeholder="John Doe"
                    value={newPaymentMethod.cardHolder}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardHolder: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={newPaymentMethod.expiry}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, expiry: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={newPaymentMethod.cvc}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cvc: e.target.value})}
                    type="password"
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddingPaymentMethod(false)}>Cancel</Button>
                <Button onClick={handleAddPaymentMethod}>Save Payment Method</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex justify-between items-center border rounded-lg p-4">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {method.type} •••• {method.last4}
                        {method.isDefault && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">Default</span>}
                      </p>
                      <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefaultPaymentMethod(method.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleRemovePaymentMethod(method.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and download your past invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.project}</TableCell>
                  <TableCell className="text-right">{invoice.amount}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
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
