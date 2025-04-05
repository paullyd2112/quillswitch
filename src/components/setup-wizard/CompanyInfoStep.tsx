
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SetupFormData } from "@/types/setupWizard";

interface CompanyInfoStepProps {
  formData: SetupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Company Information</h3>
      <p className="text-muted-foreground mb-6">
        Tell us about your company to help us customize your CRM migration process.
      </p>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input 
            id="companyName"
            name="companyName"
            placeholder="Acme Inc."
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoStep;
