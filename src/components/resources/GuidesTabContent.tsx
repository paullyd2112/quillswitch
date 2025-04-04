
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ScreenshotGuide from "@/components/resources/ScreenshotGuide";

// Example screenshot data
const migrationSetupScreenshots = [
  {
    title: "Starting a New Migration",
    description: "Navigate to the dashboard and click on 'New Migration' to begin the process.",
    imageSrc: "/placeholder.svg",
    alt: "Migration dashboard with New Migration button highlighted"
  },
  {
    title: "Selecting Source and Destination",
    description: "Choose your source and destination CRM systems from the available options.",
    imageSrc: "/placeholder.svg",
    alt: "Source and destination selection screen"
  },
  {
    title: "Field Mapping Configuration",
    description: "Map fields from your source CRM to your destination CRM using our intuitive interface.",
    imageSrc: "/placeholder.svg",
    alt: "Field mapping interface showing source and destination fields"
  }
];

const GuidesTabContent = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Visual Guides</CardTitle>
          <p className="text-muted-foreground">Step-by-step screenshots to help you navigate through common tasks</p>
        </CardHeader>
      </Card>
      
      <ScreenshotGuide
        title="Setting Up Your First Migration"
        description="Follow these steps to set up your first migration project in QuillSwitch."
        screenshots={migrationSetupScreenshots}
        category="migration-setup"
      />
      
      <ScreenshotGuide
        title="Data Mapping Guide"
        description="Learn how to effectively map fields between your source and destination CRMs."
        screenshots={[
          {
            title: "Understanding the Mapping Interface",
            description: "Get familiar with our visual mapping tool to connect fields between systems.",
            imageSrc: "/placeholder.svg",
            alt: "Data mapping interface overview"
          },
          {
            title: "Creating Custom Field Mappings",
            description: "Learn how to create custom field mappings for specialized data requirements.",
            imageSrc: "/placeholder.svg",
            alt: "Custom field mapping creation screen"
          }
        ]}
        category="data-mapping"
      />
    </div>
  );
};

export default GuidesTabContent;
