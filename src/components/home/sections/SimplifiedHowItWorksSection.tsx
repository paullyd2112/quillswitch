
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
    <section className="py-20 px-4 bg-slate-950">
      <div className="container max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Four simple steps to switch CRMs without disrupting your business.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <FadeIn key={index} delay={`${(index + 1) * 100}` as any}>
              <div className="text-center">
                {/* Step number */}
                <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="mb-4 mx-auto w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-blue-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimplifiedHowItWorksSection;
