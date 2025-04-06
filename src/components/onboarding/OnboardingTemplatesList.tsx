
import React from "react";
import OnboardingTemplate from "@/components/templates/OnboardingTemplate";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const templates = [
  {
    id: "salesforce-to-hubspot",
    title: "Salesforce to HubSpot",
    description: "Migrate your CRM data from Salesforce to HubSpot with our optimized template.",
    category: "Popular",
    thumbnail: "/placeholder.svg",
    isNew: true,
  },
  {
    id: "dynamics-to-zoho",
    title: "Microsoft Dynamics to Zoho",
    description: "Complete migration package for moving from Microsoft Dynamics to Zoho CRM.",
    category: "Enterprise",
    thumbnail: "/placeholder.svg",
  },
  {
    id: "pipedrive-to-hubspot",
    title: "Pipedrive to HubSpot",
    description: "Seamlessly transfer your sales pipeline from Pipedrive to HubSpot.",
    category: "Popular",
    thumbnail: "/placeholder.svg",
  },
  {
    id: "freshsales-to-salesforce",
    title: "Freshsales to Salesforce",
    description: "Upgrade your CRM by migrating from Freshsales to Salesforce with our template.",
    category: "Business",
    thumbnail: "/placeholder.svg",
    isNew: true,
  },
];

const OnboardingTemplatesList = () => {
  const navigate = useNavigate();
  
  const handleCustomMigration = () => {
    navigate("/setup");
  };
  
  const handleUseTemplate = (templateId: string) => {
    // In a real implementation, you might pass the template ID to the setup wizard
    navigate("/setup", { state: { templateId } });
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Start with a template</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template, index) => (
            <OnboardingTemplate
              key={template.id}
              template={template}
              delay={`${index * 100}` as "100" | "200" | "300" | "400" | "500" | "none"}
              className="h-full"
            />
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t border-border">
        <h2 className="text-2xl font-semibold mb-6">Or create a custom migration</h2>
        <Button onClick={handleCustomMigration} size="lg" className="gap-2">
          <Plus size={18} /> Create Custom Migration
        </Button>
      </div>
    </div>
  );
};

export default OnboardingTemplatesList;
