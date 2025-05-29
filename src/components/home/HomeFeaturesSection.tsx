
import React from "react";
import { Shield, Zap, Users, CheckCircle, Database, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Enterprise Security",
    description: "Bank-level encryption and SOC 2 compliance ensure your data stays protected throughout the migration process."
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Lightning Fast",
    description: "Complete migrations in hours, not weeks. Our optimized algorithms process millions of records efficiently."
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "No Technical Expertise Required",
    description: "User-friendly interface designed for business users. No coding or technical knowledge needed."
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "99.9% Data Accuracy",
    description: "Advanced validation and matching algorithms ensure your data integrity throughout the migration."
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "Smart Data Mapping",
    description: "AI-powered field mapping automatically matches your data structures between different CRM systems."
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Real-Time Progress",
    description: "Track your migration progress in real-time with detailed reporting and instant notifications."
  }
];

const HomeFeaturesSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Businesses Choose QuillSwitch
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Built specifically for non-technical teams who need enterprise-grade results without the complexity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all duration-300 hover:transform hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturesSection;
