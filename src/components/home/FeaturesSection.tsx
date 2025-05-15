
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
      title: "Comprehensive Migration",
      description: "Transfer all CRM objects including contacts, opportunities, custom objects, and attachments with field-level mapping."
    },
    {
      icon: <Shield size={26} />,
      title: "Enterprise Security",
      description: "SOC 2 Type II certified with end-to-end encryption, secure OAuth, and zero data retention policies."
    },
    {
      icon: <Zap size={26} />,
      title: "High-Performance",
      description: "Parallel processing and optimized throughput deliver migrations 50% faster than manual methods."
    },
    {
      icon: <GitMerge size={26} />,
      title: "Intelligent Mapping",
      description: "AI-powered field matching with 95%+ accuracy minimizes manual configuration and prevents data loss."
    },
    {
      icon: <ListChecks size={26} />,
      title: "Data Validation",
      description: "Built-in validation rules and quality checks ensure data integrity throughout the migration process."
    },
    {
      icon: <BellRing size={26} />,
      title: "Real-time Monitoring",
      description: "Track migration progress with detailed analytics, instant alerts, and comprehensive reporting."
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
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Everything You Need for Seamless <br /> CRM Migration
          </h2>
          <p className="text-lg text-slate-400">
            Our comprehensive toolkit simplifies every aspect of CRM migration, from initial data mapping to ongoing synchronization.
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
              View All Features <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
