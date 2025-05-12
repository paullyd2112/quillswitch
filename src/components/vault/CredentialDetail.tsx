import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Calendar, Clock, Tag, Shield } from "lucide-react";
import { ServiceCredential } from "./types";
import { useAuth } from "@/contexts/auth";
import { maskSensitiveData } from "@/utils/encryptionUtils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import CredentialTag from "./CredentialTag";
import TagInput from "./TagInput";
import AccessLogViewer from "./AccessLogViewer";
import { supabase } from "@/integrations/supabase/client";

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

  // Reset state when credential changes
  useEffect(() => {
    setShowCredential(false);
    setDecryptedValue(null);
    setTags(credential?.tags || []);
  }, [credential]);

  if (!credential) return null;

  const toggleCredentialVisibility = async () => {
    // Prevent logging raw keys by using a dedicated secure function
    if (!showCredential && !decryptedValue) {
      try {
        setIsDecrypting(true);
        
        // Get decrypted credential value using RPC function
        const { data, error } = await supabase.rpc('get_decrypted_credential_with_logging', {
          p_credential_id: credential.id
        });
        
        if (error) throw error;
        if (!data || data.length === 0) throw new Error("No data returned");
        
        setDecryptedValue(data[0].credential_value);
        setShowCredential(true);
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
        
        // Get decrypted credential value using RPC function
        const { data, error } = await supabase.rpc('get_decrypted_credential_with_logging', {
          p_credential_id: credential.id
        });
        
        if (error) throw error;
        if (!data || data.length === 0) throw new Error("No data returned");
        
        valueToCopy = data[0].credential_value;
        setDecryptedValue(valueToCopy);
      }
      
      await navigator.clipboard.writeText(valueToCopy || '');
      toast.success("Copied to clipboard securely");
      
      // Automatically hide after copying for additional security
      setTimeout(() => {
        setShowCredential(false);
      }, 10000); // Hide after 10 seconds
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
            <TabsTrigger value="security"><Shield className="h-4 w-4 mr-1" /> Security</TabsTrigger>
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
                        <span>{maskSensitiveData(credential.credential_value.toString(), 4)}</span>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={toggleCredentialVisibility}
                      disabled={isDecrypting}
                      className="transition-colors"
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
                  {showCredential && (
                    <p className="text-xs text-amber-600 mt-1">
                      <Shield className="h-3 w-3 inline mr-1" />
                      This credential will be hidden automatically after 10 seconds
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div>
                    {credential.created_at && (
                      <p>Created on {new Date(credential.created_at).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div>
                    {credential.last_used && (
                      <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Last used on {new Date(credential.last_used).toLocaleDateString()}
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
          
          <TabsContent value="security">
            <Card className="p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Credential Security Information</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2 items-start">
                    <Shield className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium">Encrypted Storage</p>
                      <p className="text-muted-foreground">This credential is stored encrypted using pgsodium with server-side encryption</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <Shield className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium">Access Control</p>
                      <p className="text-muted-foreground">Only you can view this credential due to Row Level Security</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <Shield className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium">Transmission Security</p>
                      <p className="text-muted-foreground">Credentials are only transmitted over HTTPS</p>
                    </div>
                  </div>

                  {credential.last_used && (
                    <div className="flex gap-2 items-start">
                      <Clock className="h-4 w-4 text-amber-500 mt-1" />
                      <div>
                        <p className="font-medium">Last Access</p>
                        <p className="text-muted-foreground">
                          Last accessed on {new Date(credential.last_used).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {credential.expires_at && (
                    <div className="flex gap-2 items-start">
                      <Calendar className="h-4 w-4 text-amber-500 mt-1" />
                      <div>
                        <p className="font-medium">Expiration</p>
                        <p className="text-muted-foreground">
                          This credential will expire on {new Date(credential.expires_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded border border-amber-200 dark:border-amber-800">
                  <h4 className="text-sm font-medium mb-1 flex items-center">
                    <Shield className="h-4 w-4 mr-1 text-amber-600" /> Security Recommendations
                  </h4>
                  <ul className="list-disc ml-5 text-xs text-muted-foreground space-y-1">
                    <li>Rotate your API keys regularly (every 30-90 days)</li>
                    <li>Use the most restrictive API permissions possible</li>
                    <li>Set a reminder to revoke this credential if no longer needed</li>
                    <li>Enable 2FA on your account for additional security</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialDetail;
