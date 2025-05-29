
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Download, Cog, Upload } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <Download className="h-8 w-8" />,
    title: "Connect Your Systems",
    description: "Securely connect your source and destination CRM systems using OAuth or API keys."
  },
  {
    number: "02",
    icon: <Cog className="h-8 w-8" />,
    title: "Smart Data Mapping",
    description: "Our AI automatically maps your data fields, or customize the mapping to fit your specific needs."
  },
  {
    number: "03",
    icon: <Upload className="h-8 w-8" />,
    title: "Migrate & Validate",
    description: "Watch as your data moves safely to the new system with real-time validation and progress tracking."
  }
];

const HomeHowItWorksSection = () => {
  return (
    <section className="py-20 px-4 bg-slate-900/50">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Three simple steps to complete your CRM migration safely and efficiently.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="bg-slate-800 border-slate-700 h-full">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl font-bold text-primary/20 mb-4">
                    {step.number}
                  </div>
                  <div className="text-primary mb-6 flex justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              
              {/* Arrow connector for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHowItWorksSection;
