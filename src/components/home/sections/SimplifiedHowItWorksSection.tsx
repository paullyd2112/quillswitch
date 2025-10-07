
import React from 'react';
import { Database, Cog, Zap, CheckCircle } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const steps = [
  {
    icon: Database,
    title: "Connect",
    description: "Link your old and new CRM systems securely in just a few clicks"
  },
  {
    icon: Cog,
    title: "Map", 
    description: "We automatically figure out how your data should move between systems"
  },
  {
    icon: Zap,
    title: "Move",
    description: "Watch your data transfer safely while your business keeps running"
  },
  {
    icon: CheckCircle,
    title: "Verify",
    description: "We double-check everything arrived perfectly before you go live"
  }
];

const SimplifiedHowItWorksSection: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Four steps. Two weeks. Done.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="space-y-4">
              {/* Step number */}
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 rounded bg-white border border-slate-200 flex items-center justify-center">
                <step.icon className="h-6 w-6 text-slate-700" strokeWidth={2} />
              </div>
              
              <h3 className="text-lg font-bold text-slate-900">
                {step.title}
              </h3>
              
              <p className="text-slate-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimplifiedHowItWorksSection;
