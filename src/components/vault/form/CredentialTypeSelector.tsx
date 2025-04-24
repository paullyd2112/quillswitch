
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CredentialTypeSelectorProps {
  credentialType: string;
  credentialValue: string;
  onChange: (name: string, value: string) => void;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CredentialTypeSelector: React.FC<CredentialTypeSelectorProps> = ({
  credentialType,
  credentialValue,
  onChange,
  onValueChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="credential_type">Credential Type</Label>
        <Select 
          value={credentialType} 
          onValueChange={(value) => onChange('credential_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select credential type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="api_key">API Key</SelectItem>
            <SelectItem value="oauth_token">OAuth Token</SelectItem>
            <SelectItem value="connection_string">Connection String</SelectItem>
            <SelectItem value="secret_key">Secret Key</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="credential_value">
          {credentialType === 'connection_string' ? 'Connection String' : 'Credential Value'}
        </Label>
        {credentialType === 'connection_string' ? (
          <Textarea
            id="credential_value"
            name="credential_value"
            placeholder="Enter the full connection string"
            value={credentialValue}
            onChange={onValueChange}
            rows={3}
            className="font-mono text-sm"
            required
          />
        ) : (
          <Input
            id="credential_value"
            name="credential_value"
            type="password"
            placeholder="Enter secret value"
            value={credentialValue}
            onChange={onValueChange}
            className="font-mono"
            required
          />
        )}
        <p className="text-xs text-muted-foreground mt-1">
          This value will be encrypted before storage and can only be decrypted by you.
        </p>
      </div>
    </>
  );
};

export default CredentialTypeSelector;
