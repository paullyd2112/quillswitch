
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceCredential, CommonFormProps } from "./types";
import { AlertTriangle, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

interface AddCredentialFormProps extends CommonFormProps {
  onAdd: (credential: ServiceCredential) => Promise<void>;
  onCancel: () => void;
}

const AddCredentialForm: React.FC<AddCredentialFormProps> = ({ onAdd, onCancel, isSubmitting }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ServiceCredential>({
    service_name: '',
    credential_name: '',
    credential_type: 'api_key',
    credential_value: '',
    environment: 'development',
    expires_at: null,
    user_id: user?.id || '', // Add user_id to initial state with a default empty string
  });

  const [expiry, setExpiry] = useState<string>('never');
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpiryChange = (value: string) => {
    setExpiry(value);
    
    if (value === 'never') {
      setFormData(prev => ({ ...prev, expires_at: null }));
      setShowExpiryWarning(false);
    } else if (value === 'custom') {
      setShowExpiryWarning(false);
      // Don't set the date yet, wait for the user to pick one
    } else {
      // Calculate expiry date based on selection
      const now = new Date();
      let expiryDate = new Date(now);
      
      switch (value) {
        case '30days':
          expiryDate.setDate(now.getDate() + 30);
          break;
        case '60days':
          expiryDate.setDate(now.getDate() + 60);
          break;
        case '90days':
          expiryDate.setDate(now.getDate() + 90);
          break;
        case '1year':
          expiryDate.setFullYear(now.getFullYear() + 1);
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        expires_at: expiryDate.toISOString()
      }));
      
      if (value === '30days') {
        setShowExpiryWarning(true);
      } else {
        setShowExpiryWarning(false);
      }
    }
  };

  const handleCustomExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setFormData(prev => ({
        ...prev,
        expires_at: new Date(e.target.value).toISOString()
      }));
      
      const selectedDate = new Date(e.target.value);
      const now = new Date();
      const diffDays = Math.floor((selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      setShowExpiryWarning(diffDays <= 30);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure user_id is required, not optional
    const credentialWithUserId = {
      ...formData,
      user_id: user?.id || ''
    };
    
    await onAdd(credentialWithUserId);
  };
  
  // Calculate minimum date for expiry selector (today)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="service_name">Service Name</Label>
          <Input
            id="service_name"
            name="service_name"
            placeholder="e.g., Google Maps, Stripe"
            value={formData.service_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="credential_name">Credential Name</Label>
          <Input
            id="credential_name"
            name="credential_name"
            placeholder="e.g., Production API Key"
            value={formData.credential_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="credential_type">Credential Type</Label>
          <Select 
            value={formData.credential_type} 
            onValueChange={(value) => handleSelectChange('credential_type', value)}
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
          <Label htmlFor="environment">Environment</Label>
          <Select 
            value={formData.environment || 'development'} 
            onValueChange={(value: any) => handleSelectChange('environment', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="production">Production</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="credential_value">
          {formData.credential_type === 'connection_string' ? 'Connection String' : 'Credential Value'}
        </Label>
        {formData.credential_type === 'connection_string' ? (
          <Textarea
            id="credential_value"
            name="credential_value"
            placeholder="Enter the full connection string"
            value={formData.credential_value}
            onChange={handleChange}
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
            value={formData.credential_value}
            onChange={handleChange}
            className="font-mono"
            required
          />
        )}
        <p className="text-xs text-muted-foreground mt-1">
          This value will be encrypted before storage and can only be decrypted by you.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expires_at">Expiry</Label>
        <Select value={expiry} onValueChange={handleExpiryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select expiration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="never">Never</SelectItem>
            <SelectItem value="30days">30 Days</SelectItem>
            <SelectItem value="60days">60 Days</SelectItem>
            <SelectItem value="90days">90 Days</SelectItem>
            <SelectItem value="1year">1 Year</SelectItem>
            <SelectItem value="custom">Custom Date</SelectItem>
          </SelectContent>
        </Select>
        
        {expiry === 'custom' && (
          <div className="mt-2">
            <Input
              type="date"
              min={minDate}
              onChange={handleCustomExpiryChange}
            />
          </div>
        )}
        
        {showExpiryWarning && (
          <Alert className="mt-2 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800">
              This credential will expire in 30 days or less. Consider setting reminders to rotate it.
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.service_name || !formData.credential_value}>
          {isSubmitting ? "Saving..." : "Save Credential"}
        </Button>
      </div>
    </form>
  );
};

export default AddCredentialForm;
