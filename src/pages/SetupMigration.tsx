
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import ContentSection from "@/components/layout/ContentSection";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SetupMigration = () => {
  const navigate = useNavigate();
  
  // Redirect to the connection hub if needed
  const handleNeedConnection = () => {
    toast.info("You'll need to connect your CRM systems first");
    navigate("/connect");
  };

  return (
    <BaseLayout>
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <ContentSection>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Migration Setup</h1>
            <p className="text-muted-foreground">
              Configure your CRM migration settings
            </p>
          </div>
          
          <div className="grid gap-8">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
              <p className="mb-4">
                To start your migration, you need to connect both your source and destination CRM systems
                in the Connection Hub.
              </p>
              <button 
                onClick={handleNeedConnection}
                className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors"
              >
                Go to Connection Hub
              </button>
            </div>
          </div>
        </ContentSection>
      </div>
    </BaseLayout>
  );
};

export default SetupMigration;
