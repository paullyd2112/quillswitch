
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createDefaultMigrationProject } from "@/services/migrationService";
import { SetupFormData } from "./types";

export const useSubmission = (
  formData: SetupFormData, 
  selectedSourceCrms: string[], 
  multiCrmEnabled: boolean,
  selectedDestinationCrms: string[],
  multiDestinationEnabled: boolean,
  customCrmNames: Record<string, string>
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare the form data for submission
      const submissionData = {
        ...formData,
        // If multi-CRM is enabled, use the array of selected CRMs
        sourceCrm: multiCrmEnabled ? selectedSourceCrms : formData.sourceCrm,
        // If multi-destination is enabled, use the array of selected destination CRMs
        destinationCrm: multiDestinationEnabled ? selectedDestinationCrms : formData.destinationCrm,
        // Include custom CRM names if applicable
        customCrmNames: customCrmNames,
        // Include multi-CRM and multi-destination flags
        multiCrmEnabled,
        multiDestinationEnabled
      };
      
      // Create a migration project in Supabase and initialize tracking
      const project = await createDefaultMigrationProject(submissionData);
      
      if (project) {
        toast({
          title: "Migration Setup Complete!",
          description: "Your CRM migration has been configured and is ready to track.",
        });
        
        // Redirect to the migration dashboard for the new project
        navigate(`/migrations/${project.id}`);
      } else {
        throw new Error("Failed to create migration project");
      }
    } catch (error: any) {
      console.error("Error setting up migration:", error);
      toast({
        title: "Setup Failed",
        description: error.message || "There was an error setting up your migration. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
