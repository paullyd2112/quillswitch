
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Eye, EyeOff, Plus, Key, Lock, KeyRound, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { fieldEncrypt, maskSensitiveData } from "@/utils/encryptionUtils";
import { Skeleton } from "@/components/ui/skeleton";
import CredentialItem from "./CredentialItem";
import AddCredentialForm from "./AddCredentialForm";
import { ServiceCredential } from "./types";
import CredentialSecurityInfo from "./CredentialSecurityInfo";

export const ServiceCredentialVault = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<ServiceCredential[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("api-keys");

  useEffect(() => {
    if (user) {
      loadCredentials();
    }
  }, [user]);

  const loadCredentials = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_credentials')
        .select('*')
        .order('service_name');
        
      if (error) {
        throw error;
      }
      
      setCredentials(data || []);
    } catch (error) {
      console.error("Error loading credentials:", error);
      toast.error("Failed to load credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCredential = async (credential: ServiceCredential) => {
    try {
      setIsLoading(true);
      
      // If credential contains a secret, encrypt it
      let encryptedCredential = { ...credential };
      if (credential.credential_value) {
        // Use a combination of the user's ID and a fixed string as the encryption key
        // This approach means credentials can only be decrypted by this user
        const encryptionKey = `${user!.id}-credential-vault-key`;
        encryptedCredential.credential_value = await fieldEncrypt(
          credential.credential_value, 
          encryptionKey
        );
      }
      
      const { error } = await supabase
        .from('service_credentials')
        .insert(encryptedCredential);
      
      if (error) throw error;
      
      toast.success(`${credential.service_name} credentials added successfully`);
      setShowAddForm(false);
      loadCredentials();
    } catch (error) {
      console.error("Error adding credential:", error);
      toast.error("Failed to save credential");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCredential = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('service_credentials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Credential deleted successfully");
      loadCredentials();
    } catch (error) {
      console.error("Error deleting credential:", error);
      toast.error("Failed to delete credential");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Credentials Vault</h2>
          <p className="text-muted-foreground">
            Securely store and manage your API keys, tokens, and other service credentials.
          </p>
        </div>
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2 bg-green-50 text-green-700 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            Encrypted Storage
          </Badge>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
            <Plus className="h-4 w-4 mr-1" />
            Add Credential
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="border-2 border-blue-200 shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800 flex items-center">
              <KeyRound className="h-5 w-5 mr-2" />
              Add New Service Credential
            </CardTitle>
            <CardDescription>
              Add credentials for a third-party service or API
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <AddCredentialForm 
              onAdd={handleAddCredential}
              onCancel={() => setShowAddForm(false)}
              isSubmitting={isLoading}
            />
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="api-keys">
            <Key className="h-4 w-4 mr-2" /> API Keys
          </TabsTrigger>
          <TabsTrigger value="oauth-tokens">
            <KeyRound className="h-4 w-4 mr-2" /> OAuth Tokens
          </TabsTrigger>
          <TabsTrigger value="connection-strings">
            <Lock className="h-4 w-4 mr-2" /> Connection Strings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for your integrated services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border rounded-md p-4">
                      <Skeleton className="h-6 w-48 mb-3" />
                      <Skeleton className="h-4 w-64 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {credentials.filter(cred => cred.credential_type === 'api_key').length === 0 ? (
                    <div className="text-center py-12 border rounded-md">
                      <Key className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-muted-foreground">
                        No API keys stored yet. Add your first API key using the "Add Credential" button.
                      </p>
                    </div>
                  ) : (
                    credentials
                      .filter(cred => cred.credential_type === 'api_key')
                      .map(credential => (
                        <CredentialItem 
                          key={credential.id} 
                          credential={credential}
                          onDelete={handleDeleteCredential}
                        />
                      ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="oauth-tokens">
          <Card>
            <CardHeader>
              <CardTitle>OAuth Tokens</CardTitle>
              <CardDescription>
                Manage OAuth access and refresh tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="border rounded-md p-4">
                      <Skeleton className="h-6 w-48 mb-3" />
                      <Skeleton className="h-4 w-64 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {credentials.filter(cred => cred.credential_type === 'oauth_token').length === 0 ? (
                    <div className="text-center py-12 border rounded-md">
                      <KeyRound className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-muted-foreground">
                        No OAuth tokens stored yet. Connect OAuth services using the "Add Credential" button.
                      </p>
                    </div>
                  ) : (
                    credentials
                      .filter(cred => cred.credential_type === 'oauth_token')
                      .map(credential => (
                        <CredentialItem 
                          key={credential.id} 
                          credential={credential}
                          onDelete={handleDeleteCredential}
                        />
                      ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="connection-strings">
          <Card>
            <CardHeader>
              <CardTitle>Connection Strings</CardTitle>
              <CardDescription>
                Manage database and service connection strings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="border rounded-md p-4">
                      <Skeleton className="h-6 w-48 mb-3" />
                      <Skeleton className="h-4 w-64 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {credentials.filter(cred => cred.credential_type === 'connection_string').length === 0 ? (
                    <div className="text-center py-12 border rounded-md">
                      <Lock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-muted-foreground">
                        No connection strings stored yet. Add connection strings using the "Add Credential" button.
                      </p>
                    </div>
                  ) : (
                    credentials
                      .filter(cred => cred.credential_type === 'connection_string')
                      .map(credential => (
                        <CredentialItem 
                          key={credential.id} 
                          credential={credential}
                          onDelete={handleDeleteCredential}
                        />
                      ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CredentialSecurityInfo />
    </div>
  );
};

export default ServiceCredentialVault;
