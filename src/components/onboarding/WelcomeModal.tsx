
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
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  const userName = user?.user_metadata?.full_name || 'there';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome to QuillSwitch, {userName}!</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Your CRM migration journey starts here. We're excited to help you seamlessly
            transfer your data and set up your new environment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.2L4.8 12L3 13.8L9 19.8L21 7.8L19.2 6L9 16.2Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Simplified Migration</h3>
              <p className="text-muted-foreground text-sm">Transfer data between CRMs with just a few clicks</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM12 5.5C12.83 5.5 13.5 6.17 13.5 7C13.5 7.83 12.83 8.5 12 8.5C11.17 8.5 10.5 7.83 10.5 7C10.5 6.17 11.17 5.5 12 5.5ZM15 17H9V15.5H11V11.5H10V10H13V15.5H15V17Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Smart Field Mapping</h3>
              <p className="text-muted-foreground text-sm">Intelligent suggestions for field mapping between systems</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 5H20V7H4V5ZM4 9H20V11H4V9ZM4 13H20V15H4V13ZM4 17H14V19H4V17Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Detailed Reports</h3>
              <p className="text-muted-foreground text-sm">Get comprehensive migration reports and analytics</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Skip for now
          </Button>
          <Button onClick={onStartOnboarding} className="gap-2">
            Take a quick tour <ChevronRight size={16} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
