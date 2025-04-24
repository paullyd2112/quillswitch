
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Calendar, Clock, Tag } from "lucide-react";
import { ServiceCredential } from "./types";
import { useAuth } from "@/contexts/auth";
import { fieldDecrypt, maskSensitiveData } from "@/utils/encryptionUtils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import CredentialTag from "./CredentialTag";
import TagInput from "./TagInput";
import AccessLogViewer from "./AccessLogViewer";
import { supabase } from "@/integrations/supabase/client";
import { safeTable } from "@/services/utils/supabaseUtils";

interface CredentialDetailProps {
  credential: ServiceCredential | null;
  onClose: () => void;
  onUpdate: (updatedCredential: ServiceCredential) => Promise<void>;
  availableTags?: string[];
}

const CredentialDetail: React.FC<CredentialDetailProps> = ({ 
  credential, 
  onClose, 
  onUpdate,
  availableTags = []
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("details");
  const [showCredential, setShowCredential] = useState(false);
  const [decryptedValue, setDecryptedValue] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [tags, setTags] = useState<string[]>(credential?.tags || []);
  const [isSavingTags, setIsSavingTags] = useState(false);

  if (!credential) return null;

  const toggleCredentialVisibility = async () => {
    if (!showCredential && !decryptedValue) {
      // Decrypt when showing for the first time
      try {
        setIsDecrypting(true);
        const encryptionKey = `${user!.id}-credential-vault-key`;
        const decrypted = await fieldDecrypt(credential.credential_value, encryptionKey);
        setDecryptedValue(decrypted);
        setShowCredential(true);
        
        // Update last_used timestamp
        if (credential.id) {
          try {
            const now = new Date().toISOString();
            const metadata = {
              ...(credential.metadata || {}),
              last_used: now,
              access_history: [
                ...(credential.metadata?.access_history || []),
                { timestamp: now, action: "view" }
              ].slice(-10) // Keep last 10 accesses
            };
            
            await safeTable<ServiceCredential>('service_credentials')
              .update({ 
                metadata,
                updated_at: now
              })
              .eq('id', credential.id);
          } catch (error) {
            console.error("Failed to update usage timestamp:", error);
            // Non-critical error, don't show to user
          }
        }
      } catch (error) {
        console.error("Error decrypting credential:", error);
        toast.error("Failed to decrypt credential");
      } finally {
        setIsDecrypting(false);
      }
    } else {
      // Just toggle visibility if already decrypted
      setShowCredential(!showCredential);
    }
  };

  const copyToClipboard = async () => {
    try {
      // Decrypt if not already decrypted
      let valueToCopy = decryptedValue;
      if (!valueToCopy) {
        setIsDecrypting(true);
        const encryptionKey = `${user!.id}-credential-vault-key`;
        valueToCopy = await fieldDecrypt(credential.credential_value, encryptionKey);
        setDecryptedValue(valueToCopy);
      }
      
      await navigator.clipboard.writeText(valueToCopy || '');
      toast.success("Copied to clipboard");
      
      // Update last_used timestamp and access log
      if (credential.id) {
        try {
          const now = new Date().toISOString();
          const metadata = {
            ...(credential.metadata || {}),
            last_used: now,
            access_history: [
              ...(credential.metadata?.access_history || []),
              { timestamp: now, action: "copy" }
            ].slice(-10) // Keep last 10 accesses
          };
          
          await safeTable<ServiceCredential>('service_credentials')
            .update({ 
              metadata,
              updated_at: now
            })
            .eq('id', credential.id);
        } catch (error) {
          console.error("Failed to update usage timestamp:", error);
          // Non-critical error, don't show to user
        }
      }
    } catch (error) {
      console.error("Error copying credential:", error);
      toast.error("Failed to copy credential");
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleSaveTags = async () => {
    if (!credential.id) return;
    
    try {
      setIsSavingTags(true);
      await onUpdate({
        ...credential,
        tags
      });
      toast.success("Tags updated successfully");
    } catch (error) {
      console.error("Error updating tags:", error);
      toast.error("Failed to update tags");
    } finally {
      setIsSavingTags(false);
    }
  };

  const calculateExpiryDays = () => {
    if (!credential.expires_at) return null;
    
    const expiryDate = new Date(credential.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry;
  };

  const expiryDays = calculateExpiryDays();

  return (
    <Dialog open={!!credential} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{credential.service_name}: {credential.credential_name}</DialogTitle>
          <DialogDescription>
            View and manage your credential details
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="access-logs">Access Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Service</p>
                    <p>{credential.service_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Environment</p>
                    <p>{credential.environment}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="capitalize">{credential.credential_type.replace('_', ' ')}</p>
                </div>
                
                {credential.expires_at && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-1" /> Expiry
                    </p>
                    <div className="flex items-center">
                      <p>{new Date(credential.expires_at).toLocaleDateString()}</p>
                      {expiryDays !== null && (
                        <Badge 
                          variant="outline" 
                          className={`ml-2 ${
                            expiryDays < 0 ? 'bg-red-50 text-red-700' : 
                            expiryDays < 30 ? 'bg-amber-50 text-amber-700' : 
                            'bg-green-50 text-green-700'
                          }`}
                        >
                          {expiryDays < 0 
                            ? 'Expired' 
                            : `${expiryDays} days remaining`}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credential Value</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="font-mono text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded-l flex-grow">
                      {isDecrypting ? (
                        <div className="animate-pulse bg-gray-200 h-5 w-44 rounded"></div>
                      ) : showCredential && decryptedValue ? (
                        <span className="break-all">{decryptedValue}</span>
                      ) : (
                        <span>{maskSensitiveData(credential.credential_value, 8)}</span>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={toggleCredentialVisibility}
                      disabled={isDecrypting}
                    >
                      {isDecrypting ? (
                        <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-blue-600 animate-spin"></div>
                      ) : showCredential ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div>
                    {credential.created_at && (
                      <p>Created on {new Date(credential.created_at).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div>
                    {credential.metadata?.last_used && (
                      <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Last used on {new Date(credential.metadata.last_used).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                {credential.tags && credential.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center">
                      <Tag className="h-4 w-4 mr-1" /> Tags
                    </p>
                    <div className="flex flex-wrap mt-1">
                      {credential.tags.map(tag => (
                        <CredentialTag key={tag} tag={tag} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="tags">
            <Card className="p-4">
              <div className="space-y-4">
                <p className="text-sm">
                  Add or remove tags to better organize your credentials
                </p>
                
                <TagInput 
                  tags={tags} 
                  onChange={setTags}
                  suggestions={availableTags}
                />
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveTags} 
                    disabled={isSavingTags || JSON.stringify(tags) === JSON.stringify(credential.tags)}
                  >
                    {isSavingTags ? "Saving..." : "Save Tags"}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="access-logs">
            <Card className="p-4">
              <AccessLogViewer credential={credential} />
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialDetail;
