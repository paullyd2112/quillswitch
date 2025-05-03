
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, X } from "lucide-react";
import { useAuth } from "@/contexts/auth";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOnboarding: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onStartOnboarding,
}) => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.name?.split(" ")[0] || "there";
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Welcome to QuillSwitch, {firstName}!</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full"
            >
              <X size={14} />
            </Button>
          </div>
          <DialogDescription className="pt-2">
            We're excited to help you migrate your CRM data quickly and seamlessly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-brand-50 dark:bg-brand-950/30 p-4 rounded-lg border border-brand-100 dark:border-brand-900">
            <h3 className="font-medium text-brand-900 dark:text-brand-400">
              Your CRM migration journey is just a few steps away:
            </h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-brand-600 dark:text-brand-400 mt-0.5">1.</span>
                <span>Connect your source and destination CRM systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600 dark:text-brand-400 mt-0.5">2.</span>
                <span>Select the data you want to migrate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600 dark:text-brand-400 mt-0.5">3.</span>
                <span>Review our AI-powered field mappings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600 dark:text-brand-400 mt-0.5">4.</span>
                <span>Validate and complete your migration</span>
              </li>
            </ul>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Would you like a quick tour of QuillSwitch to help you get started?
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Skip Tour
          </Button>
          <Button 
            onClick={onStartOnboarding} 
            className="gap-2 sm:w-auto w-full bg-brand-600 hover:bg-brand-700"
          >
            <Rocket className="h-4 w-4" />
            Take the Tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
