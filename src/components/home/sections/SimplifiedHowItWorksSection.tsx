
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
    <section className="py-24 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Migration Made Simple
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Four straightforward steps. No technical expertise required.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <FadeIn key={index} delay={`${(index + 1) * 100}` as any}>
                <div className="relative">
                  {/* Step circle */}
                  <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                    {index + 1}
                  </div>
                  
                  {/* Card */}
                  <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                    <step.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                    
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimplifiedHowItWorksSection;
