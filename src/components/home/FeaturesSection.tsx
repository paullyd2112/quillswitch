
import React from "react";
import { Shield, GitMerge, ListChecks, BellRing, Zap, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="feature-card group p-8 bg-slate-900 border border-slate-800 rounded-xl hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
    <div className="mb-6 w-14 h-14 rounded-xl bg-slate-800 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <Database size={26} />,
      title: "Complete Data Transfer",
      description: "Move all your contacts, deals, companies, and even custom data fields from one CRM to another with ease."
    },
    {
      icon: <Shield size={26} />,
      title: "Bank-Level Security",
      description: "Your data is protected with the same security standards used by financial institutions. We never keep copies of your data."
    },
    {
      icon: <Zap size={26} />,
      title: "Fast & Accurate",
      description: "Get your new CRM up and running in half the time of manual transfers, with no missing information or duplicates."
    },
    {
      icon: <GitMerge size={26} />,
      title: "Smart Matching",
      description: "Our system intelligently matches fields between different CRMs so you don't have to figure out what goes where."
    },
    {
      icon: <ListChecks size={26} />,
      title: "Data Quality Checks",
      description: "We automatically check for and fix common issues like duplicate contacts and formatting problems."
    },
    {
      icon: <BellRing size={26} />,
      title: "Progress Updates",
      description: "Always know exactly where your migration stands with easy-to-understand progress reports and notifications."
    },
  ];

  return (
    <section className="py-24 relative">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-md bg-primary/10 text-primary">
            Why Choose QuillSwitch
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Everything You Need For A <br /> Smooth CRM Switch
          </h2>
          <p className="text-lg text-slate-400">
            We handle all the technical details so you can focus on your business while your data moves safely to your new CRM.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild variant="outline" className="gap-2 px-8 py-6 border-slate-700 hover:bg-slate-800 hover:border-primary/50">
            <Link to="/features">
              See All Features <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
