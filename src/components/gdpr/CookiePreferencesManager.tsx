
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { Cookie, Info, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface CookiePreferencesManagerProps {
  trigger?: React.ReactNode;
}

const CookiePreferencesManager: React.FC<CookiePreferencesManagerProps> = ({ 
  trigger = <Button variant="ghost" size="sm">Cookie Preferences</Button> 
}) => {
  const { consentStatus, updateConsent, resetConsent } = useCookieConsent();
  const [open, setOpen] = useState(false);
  const [localConsent, setLocalConsent] = useState({ ...consentStatus });
  
  const handleSavePreferences = () => {
    updateConsent(localConsent);
    toast.success("Cookie preferences updated");
    setOpen(false);
  };
  
  const handleResetPreferences = () => {
    resetConsent();
    toast.success("Cookie preferences reset");
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) {
        setLocalConsent({ ...consentStatus });
      }
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Cookie className="mr-2 h-5 w-5 text-brand-500" />
            Cookie Preferences
          </DialogTitle>
          <DialogDescription>
            Manage your cookie preferences and consent settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Necessary Cookies</p>
              <p className="text-xs text-muted-foreground">Required for the website to function properly</p>
            </div>
            <Switch checked={true} disabled />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Analytics Cookies</p>
              <p className="text-xs text-muted-foreground">Help us understand how you interact with our website</p>
            </div>
            <Switch 
              checked={localConsent.analytics} 
              onCheckedChange={(checked) => setLocalConsent(prev => ({ ...prev, analytics: checked }))} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Cookies</p>
              <p className="text-xs text-muted-foreground">Used to track you across websites for marketing purposes</p>
            </div>
            <Switch 
              checked={localConsent.marketing} 
              onCheckedChange={(checked) => setLocalConsent(prev => ({ ...prev, marketing: checked }))} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Preference Cookies</p>
              <p className="text-xs text-muted-foreground">Allow the website to remember your preferences</p>
            </div>
            <Switch 
              checked={localConsent.preferences} 
              onCheckedChange={(checked) => setLocalConsent(prev => ({ ...prev, preferences: checked }))} 
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between w-full">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetPreferences}
          >
            Reset Preferences
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferencesManager;
