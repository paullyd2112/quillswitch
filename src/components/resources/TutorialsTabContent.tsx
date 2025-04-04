
import React from "react";
import SlideShowGuide from "@/components/resources/SlideShowGuide";

// Example slideshow data
const quickStartSlides = [
  {
    title: "Create Your Account",
    description: "Sign up for a QuillSwitch account to get started with your migration journey.",
    imageSrc: "/placeholder.svg",
    alt: "QuillSwitch signup page"
  },
  {
    title: "Configure Your First Project",
    description: "Set up your migration project by defining your source and target systems.",
    imageSrc: "/placeholder.svg",
    alt: "Project configuration page"
  },
  {
    title: "Map Your Data Fields",
    description: "Use our visual mapping tool to connect fields between your source and target systems.",
    imageSrc: "/placeholder.svg",
    alt: "Data field mapping interface"
  },
  {
    title: "Run Your Migration",
    description: "Start your migration and monitor progress in real-time on your dashboard.",
    imageSrc: "/placeholder.svg",
    alt: "Migration progress dashboard"
  },
  {
    title: "Verify Your Results",
    description: "Verify your migrated data and address any issues using our validation tools.",
    imageSrc: "/placeholder.svg",
    alt: "Data verification interface"
  }
];

const TutorialsTabContent = () => {
  return (
    <div className="space-y-8">
      <SlideShowGuide
        title="QuillSwitch Quick Start Tutorial"
        description="A step-by-step walkthrough of the essential features to get you up and running with QuillSwitch."
        slides={quickStartSlides}
      />
      
      <SlideShowGuide
        title="Advanced Migration Techniques"
        description="Discover advanced strategies for optimizing your data migrations."
        slides={[
          {
            title: "Handling Complex Data Relationships",
            description: "Learn strategies for maintaining relational data during migration.",
            imageSrc: "/placeholder.svg",
            alt: "Complex data relationship diagram"
          },
          {
            title: "Data Transformations",
            description: "Apply transformations to your data during migration to ensure compatibility.",
            imageSrc: "/placeholder.svg",
            alt: "Data transformation interface"
          },
          {
            title: "Incremental Migration Strategies",
            description: "Set up incremental migrations to minimize downtime for large datasets.",
            imageSrc: "/placeholder.svg",
            alt: "Incremental migration setup screen"
          }
        ]}
      />
    </div>
  );
};

export default TutorialsTabContent;
