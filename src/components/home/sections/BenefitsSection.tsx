
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Clock, DollarSign } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const benefits = [
  {
    icon: Shield,
    title: "Your Data Stays Safe",
    description: "Bank-level security ensures your customer information is protected. We guarantee zero data loss with every migration.",
    oldWay: "Risk losing customer data",
    newWay: "100% data protection guarantee"
  },
  {
    icon: Clock,
    title: "Business Keeps Running", 
    description: "Complete migrations in under 2 weeks while your sales team stays productive. No downtime, no lost deals.",
    oldWay: "Weeks of business disruption",
    newWay: "Zero downtime required"
  },
  {
    icon: DollarSign,
    title: "Save Thousands in Consulting",
    description: "Skip expensive consultants and lengthy implementations. Get enterprise-quality results at a fraction of the cost.",
    oldWay: "Expensive consultant fees",
    newWay: "Save up to 90% on costs"
  }
];

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Finally, CRM Migration That Works for Your Business
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Stop worrying about the usual migration nightmares. We've solved the problems that keep business owners up at night.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <FadeIn key={index} delay={`${(index + 1) * 100}` as any}>
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all duration-300 h-full">
                <CardContent className="p-8 text-center">
                  {/* Icon */}
                  <div className="mb-6 mx-auto w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-slate-400 leading-relaxed mb-6">
                    {benefit.description}
                  </p>
                  
                  {/* Before/After comparison */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-red-400">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      <span>Old way: {benefit.oldWay}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span>QuillSwitch: {benefit.newWay}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
