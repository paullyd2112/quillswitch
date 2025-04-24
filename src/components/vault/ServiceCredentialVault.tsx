
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Plus, Key, Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { fieldEncrypt } from "@/utils/encryptionUtils";
import { Skeleton } from "@/components/ui/skeleton";
import CredentialItem from "./CredentialItem";
import AddCredentialForm from "./AddCredentialForm";
import { ServiceCredential, CredentialFilter } from "./types";
import CredentialSecurityInfo from "./CredentialSecurityInfo";
import { safeTable } from "@/services/utils/supabaseUtils";
import SearchAndFilter from "./SearchAndFilter";
import BulkActions from "./BulkActions";
import CredentialDetail from "./CredentialDetail";

export const ServiceCredentialVault = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<ServiceCredential[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("api-keys");
  const [filter, setFilter] = useState<CredentialFilter>({
    searchTerm: "",
    types: [],
    environments: [],
    tags: [],
    showExpired: true
  });
  const [selectedCredentialIds, setSelectedCredentialIds] = useState<string[]>([]);
  const [selectedCredential, setSelectedCredential] = useState<ServiceCredential | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadCredentials();
    }
  }, [user]);

  useEffect(() => {
    // Extract all unique tags from credentials
    const tags = credentials
      .flatMap(cred => cred.tags || [])
      .filter((tag, index, self) => self.indexOf(tag) === index)
      .sort();
    setAvailableTags(tags);
  }, [credentials]);

  const loadCredentials = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await safeTable<ServiceCredential>('service_credentials')
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
      
      const { error } = await safeTable<ServiceCredential>('service_credentials')
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
      const { error } = await safeTable<ServiceCredential>('service_credentials')
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

  const handleBulkDelete = async (ids: string[]) => {
    try {
      setIsLoading(true);
      const { error } = await safeTable<ServiceCredential>('service_credentials')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      
      setSelectedCredentialIds([]);
      loadCredentials();
    } catch (error) {
      console.error("Error bulk deleting credentials:", error);
      toast.error("Failed to delete credentials");
      throw error; // Re-throw to be caught by BulkActions
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCredential = async (updatedCredential: ServiceCredential) => {
    try {
      setIsLoading(true);
      
      if (!updatedCredential.id) {
        throw new Error("Credential ID is missing");
      }
      
      const { error } = await safeTable<ServiceCredential>('service_credentials')
        .update({
          tags: updatedCredential.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedCredential.id);
      
      if (error) throw error;
      
      // Update local state
      setCredentials(prev => 
        prev.map(cred => 
          cred.id === updatedCredential.id ? updatedCredential : cred
        )
      );
      
      if (selectedCredential?.id === updatedCredential.id) {
        setSelectedCredential(updatedCredential);
      }
      
    } catch (error) {
      console.error("Error updating credential:", error);
      toast.error("Failed to update credential");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCredential = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedCredentialIds(prev => [...prev, id]);
    } else {
      setSelectedCredentialIds(prev => prev.filter(credId => credId !== id));
    }
  };

  const clearSelection = () => {
    setSelectedCredentialIds([]);
  };

  const openCredentialDetail = (credential: ServiceCredential) => {
    setSelectedCredential(credential);
  };

  const filterCredentials = (credentials: ServiceCredential[]): ServiceCredential[] => {
    return credentials.filter(cred => {
      // Filter by search term
      if (filter.searchTerm && 
          !cred.service_name.toLowerCase().includes(filter.searchTerm.toLowerCase()) && 
          !cred.credential_name.toLowerCase().includes(filter.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by type
      if (filter.types.length > 0 && !filter.types.includes(cred.credential_type)) {
        return false;
      }
      
      // Filter by environment
      if (filter.environments.length > 0 && cred.environment && 
          !filter.environments.includes(cred.environment)) {
        return false;
      }
      
      // Filter by tags
      if (filter.tags.length > 0) {
        if (!cred.tags || !cred.tags.some(tag => filter.tags.includes(tag))) {
          return false;
        }
      }
      
      // Filter expired credentials
      if (!filter.showExpired && cred.expires_at) {
        const now = new Date();
        const expiryDate = new Date(cred.expires_at);
        if (expiryDate < now) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Filter credentials based on current filter and tab
  const getFilteredCredentials = () => {
    const filteredByType = activeTab === "api-keys" 
      ? credentials.filter(cred => cred.credential_type === 'api_key')
      : activeTab === "oauth-tokens"
      ? credentials.filter(cred => cred.credential_type === 'oauth_token')
      : credentials.filter(cred => cred.credential_type === 'connection_string');
      
    return filterCredentials(filteredByType);
  };

  const filteredCredentials = getFilteredCredentials();
  const isSelectMode = selectedCredentialIds.length > 0;

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
              availableTags={availableTags}
            />
          </CardContent>
        </Card>
      )}

      {selectedCredentialIds.length > 0 && (
        <BulkActions 
          selectedCredentialIds={selectedCredentialIds}
          onDelete={handleBulkDelete}
          onComplete={clearSelection}
        />
      )}

      <SearchAndFilter 
        onFilterChange={setFilter}
        availableTags={availableTags}
      />

      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        clearSelection();
      }}>
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
                  {filteredCredentials.length === 0 ? (
                    <div className="text-center py-12 border rounded-md">
                      <Key className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-muted-foreground">
                        {filter.searchTerm || filter.types.length || filter.environments.length || filter.tags.length
                          ? "No credentials match your current filters"
                          : "No API keys stored yet. Add your first API key using the \"Add Credential\" button."}
                      </p>
                    </div>
                  ) : (
                    filteredCredentials.map(credential => (
                      <div key={credential.id} onClick={() => !isSelectMode && openCredentialDetail(credential)} className="cursor-pointer">
                        <CredentialItem 
                          credential={credential}
                          onDelete={handleDeleteCredential}
                          isSelectable={true}
                          isSelected={credential.id ? selectedCredentialIds.includes(credential.id) : false}
                          onSelectChange={handleSelectCredential}
                        />
                      </div>
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
                  {filteredCredentials.length === 0 ? (
                    <div className="text-center py-12 border rounded-md">
                      <KeyRound className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-muted-foreground">
                        {filter.searchTerm || filter.types.length || filter.environments.length || filter.tags.length
                          ? "No credentials match your current filters"
                          : "No OAuth tokens stored yet. Connect OAuth services using the \"Add Credential\" button."}
                      </p>
                    </div>
                  ) : (
                    filteredCredentials.map(credential => (
                      <div key={credential.id} onClick={() => !isSelectMode && openCredentialDetail(credential)} className="cursor-pointer">
                        <CredentialItem 
                          credential={credential}
                          onDelete={handleDeleteCredential}
                          isSelectable={true}
                          isSelected={credential.id ? selectedCredentialIds.includes(credential.id) : false}
                          onSelectChange={handleSelectCredential}
                        />
                      </div>
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
                  {filteredCredentials.length === 0 ? (
                    <div className="text-center py-12 border rounded-md">
                      <Lock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-muted-foreground">
                        {filter.searchTerm || filter.types.length || filter.environments.length || filter.tags.length
                          ? "No credentials match your current filters"
                          : "No connection strings stored yet. Add connection strings using the \"Add Credential\" button."}
                      </p>
                    </div>
                  ) : (
                    filteredCredentials.map(credential => (
                      <div key={credential.id} onClick={() => !isSelectMode && openCredentialDetail(credential)} className="cursor-pointer">
                        <CredentialItem 
                          credential={credential}
                          onDelete={handleDeleteCredential}
                          isSelectable={true}
                          isSelected={credential.id ? selectedCredentialIds.includes(credential.id) : false}
                          onSelectChange={handleSelectCredential}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CredentialDetail 
        credential={selectedCredential}
        onClose={() => setSelectedCredential(null)}
        onUpdate={handleUpdateCredential}
        availableTags={availableTags}
      />
      
      <CredentialSecurityInfo />
    </div>
  );
};

export default ServiceCredentialVault;
