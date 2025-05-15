
import React from "react";
import { Database, Shield, Zap, GitMerge, ListChecks, BellRing } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Comprehensive Data Transfer",
    description: "Migrate contacts, opportunities, and custom objects seamlessly across CRM platforms."
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "End-to-end encryption and compliance with GDPR, CCPA, and other data protection standards."
  },
  {
    icon: Zap,
    title: "High-Performance Migration",
    description: "Optimize migration speed with parallel processing and intelligent data handling."
  },
  {
    icon: GitMerge,
    title: "AI-Powered Field Matching",
    description: "Advanced artificial intelligence matches your fields with 95%+ accuracy to minimize manual work."
  },
  {
    icon: ListChecks,
    title: "Data Validation",
    description: "Comprehensive data quality checks and transformation rules to ensure clean migrations."
  },
  {
    icon: BellRing,
    title: "Real-time Notifications",
    description: "Stay informed with detailed migration progress and instant alerts."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-friendly-bg">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose QuillSwitch?
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-friendly-text-secondary">
            We've built a comprehensive migration platform that addresses the most complex CRM transition challenges.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
            >
              <div className="icon-container">
                <feature.icon size={26} />
              </div>
              <h3>
                {feature.title}
              </h3>
              <p>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
