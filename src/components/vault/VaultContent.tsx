
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, KeyRound, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCredential } from "./types";
import CredentialItem from "./CredentialItem";

interface VaultContentProps {
  isLoading: boolean;
  activeTab: string;
  filteredCredentials: ServiceCredential[];
  onCredentialSelect: (credential: ServiceCredential) => void;
  onDelete: (id: string) => Promise<void>;
  isSelectMode: boolean;
  selectedCredentialIds: string[];
  onSelectChange: (id: string, selected: boolean) => void;
  onTabChange: (value: string) => void;
  filter: any;
}

const VaultContent: React.FC<VaultContentProps> = ({
  isLoading,
  activeTab,
  filteredCredentials,
  onCredentialSelect,
  onDelete,
  isSelectMode,
  selectedCredentialIds,
  onSelectChange,
  onTabChange,
  filter
}) => {
  const renderEmptyState = (icon: React.ReactNode, type: string) => (
    <div className="text-center py-12 border rounded-md">
      {icon}
      <p className="text-muted-foreground">
        {filter.searchTerm || filter.types.length || filter.environments.length || filter.tags.length
          ? "No credentials match your current filters"
          : `No ${type} stored yet. Add your first ${type} using the "Add Credential" button.`}
      </p>
    </div>
  );

  const renderContent = (type: string, Icon: React.FC<any>) => (
    <Card>
      <CardHeader>
        <CardTitle>{type}</CardTitle>
        <CardDescription>
          Manage {type.toLowerCase()} for your integrated services
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
              renderEmptyState(
                <Icon className="h-12 w-12 mx-auto text-gray-300 mb-3" />,
                type
              )
            ) : (
              filteredCredentials.map(credential => (
                <div 
                  key={credential.id} 
                  onClick={() => !isSelectMode && onCredentialSelect(credential)} 
                  className="cursor-pointer"
                >
                  <CredentialItem
                    credential={credential}
                    onDelete={onDelete}
                    isSelectable={true}
                    isSelected={credential.id ? selectedCredentialIds.includes(credential.id) : false}
                    onSelectChange={onSelectChange}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
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
        {renderContent("API Keys", Key)}
      </TabsContent>
      
      <TabsContent value="oauth-tokens">
        {renderContent("OAuth Tokens", KeyRound)}
      </TabsContent>
      
      <TabsContent value="connection-strings">
        {renderContent("Connection Strings", Lock)}
      </TabsContent>
    </Tabs>
  );
};

export default VaultContent;
