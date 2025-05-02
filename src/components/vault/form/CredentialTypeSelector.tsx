
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceCredential } from "../types";

interface CredentialTypeSelectorProps {
  credentialType: ServiceCredential['credential_type'];
  credentialValue: string;
  onChange: (name: string, value: string) => void;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
          onValueChange={(value) => onChange('credential_type', value as ServiceCredential['credential_type'])}
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
          {credentialType === 'api_key' ? 'API Key' : 
           credentialType === 'oauth_token' ? 'OAuth Token' : 
           credentialType === 'connection_string' ? 'Connection String' : 'Secret Key'}
        </Label>
        <Input
          id="credential_value"
          name="credential_value"
          type="password"
          autoComplete="off"
          value={credentialValue}
          onChange={onValueChange}
          required
        />
      </div>
    </>
  );
};

export default CredentialTypeSelector;
