
import React from "react";
import { CompanyInfoSectionProps } from "./types";

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({ formData }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 bg-muted font-medium">Company Information</div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-sm text-muted-foreground">Company Name:</span>
            <p>{formData.companyName}</p>
          </div>
          {formData.industry && (
            <div>
              <span className="text-sm text-muted-foreground">Industry:</span>
              <p>{formData.industry}</p>
            </div>
          )}
          {formData.companySize && (
            <div>
              <span className="text-sm text-muted-foreground">Company Size:</span>
              <p>{formData.companySize}</p>
            </div>
          )}
        </div>
        {formData.migrationGoals && (
          <div>
            <span className="text-sm text-muted-foreground">Migration Goals:</span>
            <p className="whitespace-pre-line">{formData.migrationGoals}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInfoSection;
