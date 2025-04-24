import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, Copy, Trash2, Key, Lock, Calendar, KeyRound, Clock } from "lucide-react";
import { ServiceCredential } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { fieldDecrypt, maskSensitiveData } from "@/utils/encryptionUtils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { safeTable } from "@/services/utils/supabaseUtils";
import CredentialTag from "./CredentialTag";

interface CredentialItemProps {
  credential: ServiceCredential;
  onDelete: (id: string) => Promise<void>;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelectChange?: (id: string, selected: boolean) => void;
}

const CredentialItem: React.FC<CredentialItemProps> = ({ 
  credential, 
  onDelete,
  isSelectable = false,
  isSelected = false,
  onSelectChange
}) => {
  const { user } = useAuth();
  const [showCredential, setShowCredential] = useState(false);
  const [decryptedValue, setDecryptedValue] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getCredentialIcon = () => {
    switch (credential.credential_type) {
      case 'api_key':
        return <Key className="h-4 w-4" />;
      case 'oauth_token':
        return <KeyRound className="h-4 w-4" />;
      case 'connection_string':
        return <Lock className="h-4 w-4" />;
      case 'secret_key':
        return <Lock className="h-4 w-4" />;
      default:
        return <Key className="h-4 w-4" />;
    }
  };

  const getEnvironmentColor = () => {
    switch (credential.environment) {
      case 'production':
        return "bg-red-50 text-red-700 border-red-200";
      case 'staging':
        return "bg-amber-50 text-amber-700 border-amber-200";
      case 'development':
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatCredentialType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

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

  const handleDelete = async () => {
    if (credential.id) {
      await onDelete(credential.id);
    }
    setDeleteDialogOpen(false);
  };

  const calculateExpiryStatus = () => {
    if (!credential.expires_at) return null;
    
    const expiryDate = new Date(credential.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { label: "Expired", color: "bg-red-50 text-red-700 border-red-200" };
    } else if (daysUntilExpiry < 7) {
      return { label: `Expires in ${daysUntilExpiry} days`, color: "bg-amber-50 text-amber-700 border-amber-200" };
    } else if (daysUntilExpiry < 30) {
      return { label: `Expires in ${daysUntilExpiry} days`, color: "bg-yellow-50 text-yellow-700 border-yellow-200" };
    }
    return { label: `Expires in ${daysUntilExpiry} days`, color: "bg-green-50 text-green-700 border-green-200" };
  };

  const formatLastUsed = () => {
    if (!credential.metadata?.last_used) return null;
    
    const lastUsed = new Date(credential.metadata.last_used);
    const now = new Date();
    const diffMs = now.getTime() - lastUsed.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return lastUsed.toLocaleDateString();
    }
  };

  const expiryStatus = calculateExpiryStatus();
  const lastUsedFormatted = formatLastUsed();

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            {isSelectable && (
              <div className="mr-2 pt-1">
                <Checkbox 
                  checked={isSelected} 
                  onCheckedChange={(checked) => {
                    if (onSelectChange && credential.id) {
                      onSelectChange(credential.id, checked === true);
                    }
                  }} 
                  aria-label="Select credential"
                />
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center flex-wrap">
                <h3 className="font-medium">
                  {credential.service_name}: {credential.credential_name}
                </h3>
                {credential.environment && (
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${getEnvironmentColor()}`}
                  >
                    {credential.environment}
                  </Badge>
                )}
                {expiryStatus && (
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${expiryStatus.color}`}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {expiryStatus.label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center flex-wrap">
                {getCredentialIcon()}
                <span className="ml-1">{formatCredentialType(credential.credential_type)}</span>
                {credential.created_at && (
                  <span className="ml-2 text-xs">
                    Added {new Date(credential.created_at).toLocaleDateString()}
                  </span>
                )}
                {lastUsedFormatted && (
                  <span className="ml-2 text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> 
                    Last used {lastUsedFormatted}
                  </span>
                )}
              </p>
              {credential.tags && credential.tags.length > 0 && (
                <div className="flex flex-wrap mt-1">
                  {credential.tags.map(tag => (
                    <CredentialTag key={tag} tag={tag} />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleCredentialVisibility}
              disabled={isDecrypting}
              title={showCredential ? "Hide credential" : "Show credential"}
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
              variant="ghost" 
              size="icon"
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  title="Delete credential"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Credential</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this credential? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t">
          <div className="font-mono text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded flex items-center justify-between">
            <div className="overflow-hidden overflow-ellipsis">
              {isDecrypting ? (
                <div className="animate-pulse bg-gray-200 h-5 w-44 rounded"></div>
              ) : showCredential && decryptedValue ? (
                <span className="break-all">{decryptedValue}</span>
              ) : (
                <span>{maskSensitiveData(credential.credential_value, 8)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CredentialItem;
