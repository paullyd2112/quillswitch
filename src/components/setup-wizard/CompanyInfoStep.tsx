
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input 
            id="industry"
            name="industry"
            placeholder="Technology, Healthcare, Financial Services, etc."
            value={formData.industry || ''}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companySize">Company Size</Label>
          <Input 
            id="companySize"
            name="companySize"
            placeholder="Number of employees"
            value={formData.companySize || ''}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="migrationGoals">Migration Goals</Label>
          <Textarea 
            id="migrationGoals"
            name="migrationGoals"
            placeholder="What are your main goals for this CRM migration?"
            value={formData.migrationGoals || ''}
            onChange={handleChange}
            className="min-h-20"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoStep;
