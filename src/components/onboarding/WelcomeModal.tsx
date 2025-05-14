
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
import { ChevronRight, X } from "lucide-react";

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            Welcome to QuillSwitch
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Your journey to seamless CRM migration starts here
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p>
            QuillSwitch makes migrating between CRM systems simple, secure and reliable.
            Let us guide you through the process with our interactive setup wizard.
          </p>
          
          <div className="border rounded-md p-4 bg-muted/30 space-y-2">
            <h3 className="font-medium">What you'll be able to do:</h3>
            <ul className="space-y-1.5 pl-5 list-disc text-muted-foreground">
              <li>Connect multiple source and destination CRMs</li>
              <li>Select which data types you want to migrate</li>
              <li>Map fields between different systems</li>
              <li>Monitor your migration in real-time</li>
              <li>Verify all your data has transferred correctly</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between gap-2 flex-row">
          <Button variant="outline" onClick={onClose}>
            Skip Tour
          </Button>
          <Button onClick={onStartOnboarding} className="gap-2">
            Start Quick Tour <ChevronRight size={16} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
