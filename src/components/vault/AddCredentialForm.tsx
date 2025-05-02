
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommonFormProps, ServiceCredential } from "./types";
import TagInput from "./TagInput";
import { useCredentialForm } from "@/hooks/useCredentialForm";
import ExpirySelector from "./form/ExpirySelector";
import CredentialTypeSelector from "./form/CredentialTypeSelector";

interface AddCredentialFormProps extends CommonFormProps {
  onAdd: (credential: ServiceCredential) => Promise<void>;
  onCancel: () => void;
  availableTags?: string[];
}

const AddCredentialForm: React.FC<AddCredentialFormProps> = ({ 
  onAdd, 
  onCancel, 
  isSubmitting,
  availableTags = [] 
}) => {
  const {
    formData,
    expiry,
    showExpiryWarning,
    handleChange,
    handleSelectChange,
    handleTagsChange,
    handleExpiryChange,
    handleCustomExpiryChange,
    handleSubmit
  } = useCredentialForm(onAdd, onCancel);

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
        <CredentialTypeSelector
          credentialType={formData.credential_type}
          credentialValue={typeof formData.credential_value === 'string' ? formData.credential_value : ''}
          onChange={handleSelectChange}
          onValueChange={handleChange}
        />
        
        <div className="space-y-2">
          <Label htmlFor="environment">Environment</Label>
          <Select 
            value={formData.environment || 'development'} 
            onValueChange={(value) => handleSelectChange('environment', value)}
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
        <Label htmlFor="tags">Tags</Label>
        <TagInput 
          tags={formData.tags || []} 
          onChange={handleTagsChange} 
          suggestions={availableTags}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Add tags to organize your credentials. Press Enter or comma after each tag.
        </p>
      </div>
      
      <ExpirySelector
        expiry={expiry}
        onExpiryChange={handleExpiryChange}
        onCustomExpiryChange={handleCustomExpiryChange}
        showWarning={showExpiryWarning}
      />
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !formData.service_name || !formData.credential_value}
        >
          {isSubmitting ? "Saving..." : "Save Credential"}
        </Button>
      </div>
    </form>
  );
};

export default AddCredentialForm;
