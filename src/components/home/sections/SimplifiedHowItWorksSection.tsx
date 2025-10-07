
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
    <section className="py-32 px-4 bg-white">
      <div className="container max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-24">
            <div className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-bold text-sm mb-6">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              Four Steps to Freedom
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              From stuck to switched in under two weeks. No PhD required.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-full" />
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <FadeIn key={index} delay={`${(index + 1) * 100}` as any}>
                <div className="relative text-center">
                  {/* Step circle */}
                  <div className="mb-8 mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-3xl shadow-2xl relative z-10">
                    {index + 1}
                  </div>
                  
                  {/* Card */}
                  <div className="p-8 rounded-2xl bg-slate-50 border-2 border-slate-200">
                    <div className="mb-6 mx-auto w-14 h-14 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center">
                      <step.icon className="h-7 w-7 text-slate-700" strokeWidth={2.5} />
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
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
