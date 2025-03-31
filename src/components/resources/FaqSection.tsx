
import React, { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileQuestion } from "lucide-react";

interface FaqCategory {
  title: string;
  items: {
    question: string;
    answer: string;
    value: string;
  }[];
}

const faqData: FaqCategory[] = [
  {
    title: "General Questions",
    items: [
      {
        question: "What is QuillSwitch?",
        answer: "QuillSwitch is an API-driven, automated platform that simplifies CRM migrations for businesses of all sizes. We provide a fast, accurate, and affordable alternative to traditional consultants.",
        value: "what-is-quillswitch"
      },
      {
        question: "Who is QuillSwitch for?",
        answer: "QuillSwitch is designed for businesses that need to migrate data between CRM systems, including SMBs, mid-market companies, and enterprises.",
        value: "who-is-quillswitch-for"
      },
      {
        question: "How is QuillSwitch different from traditional CRM consultants?",
        answer: "QuillSwitch automates much of the migration process, significantly reducing costs and project timelines compared to consultants. Our platform provides greater transparency and control over your migration.",
        value: "how-different-from-consultants"
      },
      {
        question: "What CRM systems does QuillSwitch support?",
        answer: "We support migrations between a wide range of popular CRM systems, including Salesforce, HubSpot, Microsoft Dynamics, Zoho, and more. Please contact us if you have a specific CRM pairing not listed.",
        value: "supported-crms"
      },
      {
        question: "What data types can QuillSwitch migrate?",
        answer: "We migrate all standard CRM data types, including Contacts & Leads, Accounts & Companies, Opportunities & Deals, Cases & Tickets, Activities & Tasks, and Custom Objects.",
        value: "data-types"
      }
    ]
  },
  {
    title: "Pricing and Payments",
    items: [
      {
        question: "How does QuillSwitch's pricing work?",
        answer: "We use a transparent pay-per-use model, consisting of a one-time Core Platform Fee and usage-based charges for data volume, complex transformations, and integrations.",
        value: "pricing-model"
      },
      {
        question: "What is the Core Platform Fee?",
        answer: "The Core Platform Fee covers your access to the QuillSwitch platform, initial setup, basic support, and onboarding.",
        value: "platform-fee"
      },
      {
        question: "Are there any hidden fees?",
        answer: "No, we believe in transparent pricing. All costs are clearly outlined in our pricing tool and documentation.",
        value: "hidden-fees"
      },
      {
        question: "How do I get a price estimate?",
        answer: "Use our online pricing estimator tool on our website. Input your data volume, integration needs, and other relevant factors to get an instant estimate.",
        value: "price-estimate"
      }
    ]
  },
  {
    title: "Technical Questions",
    items: [
      {
        question: "Are you using 3rd party AI apps with our data?",
        answer: "API, not AI. At QuillSwitch, we prioritize the security and privacy of your data. That's why we've built our platform on a robust API architecture, not third-party AI models. We believe you should have complete control over your sensitive information, without relying on external AI providers.",
        value: "third-party-ai"
      },
      {
        question: "How secure is my data during migration?",
        answer: "We prioritize data security and use industry-standard encryption and security protocols to protect your data. All transfers are encrypted, and we do not store your sensitive data after migration is complete.",
        value: "data-security"
      },
      {
        question: "How long does a CRM migration take?",
        answer: "Migration timelines vary depending on data volume, complexity, and integrations. Our platform automates many processes, resulting in faster migrations than traditional methods. Typical migrations can be completed in days instead of the weeks or months required with consultants.",
        value: "migration-time"
      },
      {
        question: "What are complex data transformations?",
        answer: "These are data manipulations that go beyond simple field mapping, such as data merging, splitting, conditional transformations, or calculated fields.",
        value: "data-transformations"
      },
      {
        question: "What are integrations?",
        answer: "Integrations are connections between your CRM and other applications or data sources, enabling data synchronization and automation.",
        value: "integrations"
      }
    ]
  },
  {
    title: "Support and Onboarding",
    items: [
      {
        question: "What kind of support do you offer?",
        answer: "We offer comprehensive support, including documentation, tutorials, FAQs, and direct support via email and chat.",
        value: "support-offered"
      },
      {
        question: "Do you offer training?",
        answer: "We offer training packages for users who require additional assistance with the platform.",
        value: "training"
      },
      {
        question: "How do I get started with QuillSwitch?",
        answer: "Use our setup wizard, or watch our tutorials, and if needed, contact our sales team to schedule a demo or consultation.",
        value: "getting-started"
      }
    ]
  }
];

const FaqSection = () => {
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  return (
    <Collapsible open={isFaqOpen} onOpenChange={setIsFaqOpen} className="w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileQuestion className="h-5 w-5 text-brand-500" />
          Frequently Asked Questions
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="outline">
            {isFaqOpen ? "Hide FAQ" : "View FAQ"}
          </Button>
        </CollapsibleTrigger>
      </div>
      <p className="text-muted-foreground mb-4">
        Find answers to common questions about our platform, migration processes,
        and best practices for successful data transitions.
      </p>
      
      <CollapsibleContent className="mt-4">
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((category, index) => (
            <React.Fragment key={index}>
              <h4 className="font-medium text-lg mb-2 mt-6">{category.title}</h4>
              
              {category.items.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </React.Fragment>
          ))}
        </Accordion>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FaqSection;
