
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Info, 
  HelpCircle, 
  BookOpen, 
  FileQuestion, 
  MessageCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ContentSection 
          title="Resources & Support"
          description="Get help and learn more about QuillSwitch migration platform."
          centered
        >
          <div className="grid gap-8 mt-10">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileQuestion className="h-5 w-5 text-brand-500" />
                  Frequently Asked Questions
                </h3>
                <p className="text-muted-foreground mb-6">
                  Find answers to common questions about our platform, migration processes,
                  and best practices for successful data transitions.
                </p>
                
                <Accordion type="single" collapsible className="w-full">
                  <h4 className="font-medium text-lg mb-2">General Questions</h4>
                  
                  <AccordionItem value="what-is-quillswitch">
                    <AccordionTrigger className="text-left">What is QuillSwitch?</AccordionTrigger>
                    <AccordionContent>
                      QuillSwitch is an API-driven, automated platform that simplifies CRM migrations for businesses of all sizes. 
                      We provide a fast, accurate, and affordable alternative to traditional consultants.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="who-is-quillswitch-for">
                    <AccordionTrigger className="text-left">Who is QuillSwitch for?</AccordionTrigger>
                    <AccordionContent>
                      QuillSwitch is designed for businesses that need to migrate data between CRM systems, 
                      including SMBs, mid-market companies, and enterprises.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="how-different-from-consultants">
                    <AccordionTrigger className="text-left">How is QuillSwitch different from traditional CRM consultants?</AccordionTrigger>
                    <AccordionContent>
                      QuillSwitch automates much of the migration process, significantly reducing costs and project timelines 
                      compared to consultants. Our platform provides greater transparency and control over your migration.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="supported-crms">
                    <AccordionTrigger className="text-left">What CRM systems does QuillSwitch support?</AccordionTrigger>
                    <AccordionContent>
                      We support migrations between a wide range of popular CRM systems, including Salesforce, HubSpot, 
                      Microsoft Dynamics, Zoho, and more. Please contact us if you have a specific CRM pairing not listed.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="data-types">
                    <AccordionTrigger className="text-left">What data types can QuillSwitch migrate?</AccordionTrigger>
                    <AccordionContent>
                      We migrate all standard CRM data types, including Contacts & Leads, Accounts & Companies, 
                      Opportunities & Deals, Cases & Tickets, Activities & Tasks, and Custom Objects.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <h4 className="font-medium text-lg mb-2 mt-6">Pricing and Payments</h4>
                  
                  <AccordionItem value="pricing-model">
                    <AccordionTrigger className="text-left">How does QuillSwitch's pricing work?</AccordionTrigger>
                    <AccordionContent>
                      We use a transparent pay-per-use model, consisting of a one-time Core Platform Fee and 
                      usage-based charges for data volume, complex transformations, and integrations.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="platform-fee">
                    <AccordionTrigger className="text-left">What is the Core Platform Fee?</AccordionTrigger>
                    <AccordionContent>
                      The Core Platform Fee covers your access to the QuillSwitch platform, 
                      initial setup, basic support, and onboarding.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="hidden-fees">
                    <AccordionTrigger className="text-left">Are there any hidden fees?</AccordionTrigger>
                    <AccordionContent>
                      No, we believe in transparent pricing. All costs are clearly outlined 
                      in our pricing tool and documentation.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="price-estimate">
                    <AccordionTrigger className="text-left">How do I get a price estimate?</AccordionTrigger>
                    <AccordionContent>
                      Use our online pricing estimator tool on our website. Input your data volume, 
                      integration needs, and other relevant factors to get an instant estimate.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <h4 className="font-medium text-lg mb-2 mt-6">Technical Questions</h4>
                  
                  <AccordionItem value="third-party-ai">
                    <AccordionTrigger className="text-left">Are you using 3rd party AI apps with our data?</AccordionTrigger>
                    <AccordionContent>
                      API, not AI. At QuillSwitch, we prioritize the security and privacy of your data. That's why we've built 
                      our platform on a robust API architecture, not third-party AI models. We believe you should have complete 
                      control over your sensitive information, without relying on external AI providers.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="data-security">
                    <AccordionTrigger className="text-left">How secure is my data during migration?</AccordionTrigger>
                    <AccordionContent>
                      We prioritize data security and use industry-standard encryption and security protocols to protect your data.
                      All transfers are encrypted, and we do not store your sensitive data after migration is complete.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="migration-time">
                    <AccordionTrigger className="text-left">How long does a CRM migration take?</AccordionTrigger>
                    <AccordionContent>
                      Migration timelines vary depending on data volume, complexity, and integrations. 
                      Our platform automates many processes, resulting in faster migrations than traditional methods.
                      Typical migrations can be completed in days instead of the weeks or months required with consultants.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="data-transformations">
                    <AccordionTrigger className="text-left">What are complex data transformations?</AccordionTrigger>
                    <AccordionContent>
                      These are data manipulations that go beyond simple field mapping, such as data merging, 
                      splitting, conditional transformations, or calculated fields.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="integrations">
                    <AccordionTrigger className="text-left">What are integrations?</AccordionTrigger>
                    <AccordionContent>
                      Integrations are connections between your CRM and other applications or data sources, 
                      enabling data synchronization and automation.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <h4 className="font-medium text-lg mb-2 mt-6">Support and Onboarding</h4>
                  
                  <AccordionItem value="support-offered">
                    <AccordionTrigger className="text-left">What kind of support do you offer?</AccordionTrigger>
                    <AccordionContent>
                      We offer comprehensive support, including documentation, tutorials, FAQs, 
                      and direct support via email and chat.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="training">
                    <AccordionTrigger className="text-left">Do you offer training?</AccordionTrigger>
                    <AccordionContent>
                      We offer training packages for users who require additional assistance with the platform.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="getting-started">
                    <AccordionTrigger className="text-left">How do I get started with QuillSwitch?</AccordionTrigger>
                    <AccordionContent>
                      Use our setup wizard, or watch our tutorials, and if needed, 
                      contact our sales team to schedule a demo or consultation.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-brand-500" />
                  About QuillSwitch
                </h3>
                <p className="text-muted-foreground mb-4">
                  QuillSwitch was created to simplify data migration between CRMs and other enterprise systems.
                  Our platform reduces the typical technical challenges and risks associated with migrations.
                </p>
                <Button variant="outline" asChild>
                  <a href="/about">Learn More</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-brand-500" />
                  Knowledge Base
                </h3>
                <p className="text-muted-foreground">
                  Access our comprehensive collection of articles, guides, and documentation
                  to better understand migration concepts and platform features.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-brand-500" />
                  Tutorials and Guides
                </h3>
                <p className="text-muted-foreground">
                  Step-by-step instructions to help you make the most of QuillSwitch,
                  from initial setup to advanced migration scenarios.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-brand-500" />
                  Contact Support
                </h3>
                <p className="text-muted-foreground">
                  Need personalized assistance? Our support team is ready to help you
                  with any questions or challenges you encounter.
                </p>
              </CardContent>
            </Card>
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default Resources;
