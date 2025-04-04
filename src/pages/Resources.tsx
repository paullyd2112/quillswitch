
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Info, 
  BookOpen, 
  MessageCircle,
  Image,
  Presentation
} from "lucide-react";
import ResourceCard from "@/components/resources/ResourceCard";
import FaqSection from "@/components/resources/FaqSection";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ScreenshotGuide from "@/components/resources/ScreenshotGuide";
import SlideShowGuide from "@/components/resources/SlideShowGuide";

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

const Resources = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  
  // Default to 'overview' if no tab is specified
  const defaultTab = tabParam || 'overview';
  
  useEffect(() => {
    // Update the URL if needed when tab changes directly in the component
    if (!tabParam && defaultTab !== 'overview') {
      navigate(`/resources?tab=${defaultTab}`, { replace: true });
    }
  }, [tabParam, defaultTab, navigate]);
  
  const handleTabChange = (value: string) => {
    navigate(`/resources?tab=${value}`, { replace: true });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ContentSection 
          title="Resources & Support"
          description="Get help and learn more about QuillSwitch migration platform."
          centered
        >
          <Tabs 
            defaultValue={defaultTab} 
            className="w-full mt-6"
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="guides">Screenshot Guides</TabsTrigger>
              <TabsTrigger value="tutorials">Quick Start</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              <ResourceCard
                icon={Info}
                title="About QuillSwitch"
                description="QuillSwitch was created to simplify data migration between CRMs and other enterprise systems. Our platform reduces the typical technical challenges and risks associated with migrations."
                linkHref="/about"
                linkText="Learn More"
              />
              
              <ResourceCard
                icon={BookOpen}
                title="Knowledge Base"
                description="Access our comprehensive collection of articles, guides, and documentation to better understand migration concepts and platform features."
                linkHref="/knowledge-base"
                linkText="Browse Knowledge Base"
              />

              <ResourceCard
                icon={Image}
                title="Screenshot Guides"
                description="Visual step-by-step instructions with annotated screenshots to help you navigate through common migration tasks."
                linkHref="/resources?tab=guides"
                linkText="View Guides"
              />

              <ResourceCard
                icon={Presentation}
                title="Quick Start Tutorials"
                description="Interactive slide-based tutorials that walk you through the essential steps to get started with QuillSwitch."
                linkHref="/resources?tab=tutorials"
                linkText="Start Learning"
              />

              <ResourceCard
                icon={MessageCircle}
                title="Contact Support"
                description="Need personalized assistance? Our support team is ready to help you with any questions or challenges you encounter."
              />
            </TabsContent>
            
            <TabsContent value="guides" className="space-y-8">
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
            </TabsContent>
            
            <TabsContent value="tutorials" className="space-y-8">
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
            </TabsContent>
            
            <TabsContent value="faq">
              <Card className="border border-border shadow-sm">
                <CardContent className="p-6">
                  <FaqSection />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ContentSection>
      </div>
    </div>
  );
};

export default Resources;
