
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertTriangle, Trash2, X } from "lucide-react";
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

const AccountDeletionCard = () => {
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  return (
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
  );
};

export default AccountDeletionCard;
