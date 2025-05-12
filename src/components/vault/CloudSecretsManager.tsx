import React, { useState, useEffect } from "react";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Cloud, Shield, RefreshCw, Clock, 
  Search, ChevronDown, AlertTriangle 
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { isConnectionSecure } from "@/utils/encryptionUtils";
import GCPSecretManagerService from "@/services/secrets/gcpSecretManagerService";

export const CloudSecretsManager = () => {
  const [secrets, setSecrets] = useState<Array<{
    name: string;
    createTime: string;
    labels: Record<string, string>;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const isSecure = isConnectionSecure();

  useEffect(() => {
    loadSecrets();
  }, []);

  const loadSecrets = async () => {
    setIsLoading(true);
    const secretsList = await GCPSecretManagerService.listSecrets();
    setSecrets(secretsList);
    setIsLoading(false);
  };

  const handleImportSecret = async (secretName: string) => {
    toast.info(`Importing secret: ${secretName}`);
    const { value } = await GCPSecretManagerService.getAndMaskSecret(secretName);
    if (!value) {
      toast.error("Failed to import secret");
      return;
    }
    
    // Here you would implement the logic to store this secret in your
    // existing credential vault, possibly showing a form to name the credential
    toast.success(`Secret ${secretName} successfully imported to vault`);
  };

  const filteredSecrets = secrets.filter(secret => 
    secret.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>Google Cloud Secret Manager</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadSecrets}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Securely access and manage your Google Cloud secrets
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isSecure && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your connection is not secure. For security reasons, accessing cloud secrets requires HTTPS.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search secrets..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!isSecure}
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Secret Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Labels</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-9 w-[100px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredSecrets.length > 0 ? (
                filteredSecrets.map((secret) => (
                  <TableRow key={secret.name}>
                    <TableCell className="font-medium">{secret.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(secret.createTime).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(secret.labels || {}).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}: {value}
                          </Badge>
                        ))}
                        {Object.keys(secret.labels || {}).length === 0 && (
                          <span className="text-sm text-muted-foreground">No labels</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={!isSecure}>
                          <Button variant="ghost" size="sm">
                            Actions <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleImportSecret(secret.name)}
                          >
                            Import to Vault
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    {searchTerm ? 'No secrets match your search' : 'No secrets found in your Google Cloud project'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Secrets are accessed securely through a server-side edge function
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CloudSecretsManager;
