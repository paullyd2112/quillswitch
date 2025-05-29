
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, Clock, Shield } from "lucide-react";

const benefits = [
  {
    icon: <TrendingUp className="h-12 w-12" />,
    title: "Reduce Migration Time",
    subtitle: "By 95%",
    description: "What used to take months now takes hours. Get back to focusing on your business, not data migration."
  },
  {
    icon: <DollarSign className="h-12 w-12" />,
    title: "Saving on Costs",
    subtitle: "By up to 90%",
    description: "No need for expensive migration consultants. Our platform handles the complexity for you."
  },
  {
    icon: <Clock className="h-12 w-12" />,
    title: "Zero Downtime",
    subtitle: "Keep Working",
    description: "Your business operations continue uninterrupted while we handle the migration in the background."
  },
  {
    icon: <Shield className="h-12 w-12" />,
    title: "Eliminate Data Loss Risk",
    subtitle: "100% Safe",
    description: "Advanced validation and backup systems ensure every piece of data arrives intact and verified."
  }
];

const HomeBenefitsSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The Impact on Your Business
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            See why over 500+ companies have chosen QuillSwitch for their CRM migrations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-blue-500/30 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="text-blue-400 flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <div className="text-blue-400 font-bold text-lg mb-3">
                      {benefit.subtitle}
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBenefitsSection;
