
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { X, ChevronDown, ChevronUp, Cookie, Info, Shield, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const CookieConsentBanner: React.FC = () => {
  const { consentStatus, updateConsent } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  
  // Only show banner if user hasn't responded yet
  if (consentStatus.hasResponded) {
    return null;
  }
  
  const handleAcceptAll = () => {
    updateConsent({
      analytics: true,
      marketing: true,
      preferences: true,
    });
    toast.success("All cookies accepted");
  };
  
  const handleRejectNonEssential = () => {
    updateConsent({
      analytics: false,
      marketing: false,
      preferences: false,
    });
    toast.success("Only necessary cookies accepted");
  };
  
  const handleSavePreferences = () => {
    updateConsent({});
    toast.success("Cookie preferences saved");
    setShowDetails(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Cookie className="h-5 w-5 mr-2 text-brand-500" />
                <h3 className="font-semibold text-lg">Cookie Consent</h3>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowDialog(true)}>
                <Settings className="h-4 w-4" />
                <span className="sr-only">Cookie Settings</span>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your experience on our site, analyze site usage, and assist in our marketing efforts.
              By clicking "Accept All", you consent to our use of cookies. You can customize your cookie preferences or
              decline non-essential cookies by clicking "Customize".
            </p>
            
            {showDetails && (
              <div className="space-y-3 pt-2 border-t">
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
                    checked={consentStatus.analytics} 
                    onCheckedChange={(checked) => updateConsent({ analytics: checked })} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Cookies</p>
                    <p className="text-xs text-muted-foreground">Used to track you across websites for marketing purposes</p>
                  </div>
                  <Switch 
                    checked={consentStatus.marketing} 
                    onCheckedChange={(checked) => updateConsent({ marketing: checked })} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Preference Cookies</p>
                    <p className="text-xs text-muted-foreground">Allow the website to remember your preferences</p>
                  </div>
                  <Switch 
                    checked={consentStatus.preferences} 
                    onCheckedChange={(checked) => updateConsent({ preferences: checked })} 
                  />
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide Details" : "Customize"}
                {showDetails ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRejectNonEssential}
              >
                Reject All
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={handleAcceptAll}
              >
                Accept All
              </Button>
              
              {showDetails && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSavePreferences}
                >
                  Save Preferences
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-brand-500" />
              Cookie Policy
            </DialogTitle>
            <DialogDescription>
              Detailed information about how we use cookies and similar technologies
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">What are cookies?</h4>
              <p className="text-muted-foreground">
                Cookies are small text files stored on your device when you visit websites. 
                They help websites remember information about your visit, enhancing your browsing experience.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">How we use cookies</h4>
              <p className="text-muted-foreground">
                We use cookies to understand how visitors use our website, 
                remember your preferences, and improve your overall experience.
                Some cookies are essential for the website to function properly.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Third-party cookies</h4>
              <p className="text-muted-foreground">
                Some cookies are placed by third-party services that appear on our pages.
                We use these to analyze site traffic and for marketing purposes.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Managing your cookie preferences</h4>
              <p className="text-muted-foreground">
                You can manage your cookie preferences at any time by clicking on the
                settings icon in the cookie banner. You can also clear cookies through
                your browser settings.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Close</Button>
            <Button onClick={handleAcceptAll}>Accept All Cookies</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsentBanner;
