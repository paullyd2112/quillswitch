
import React from 'react';
import { EnhancedCard, CardContent } from '@/components/ui/enhanced-card';
import { Shield, Clock, DollarSign, X, Check } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const benefits = [
  {
    icon: Shield,
    title: "Your Data, Uncompromised",
    description: "Leverage bank-level security protocols to ensure your sensitive customer information is completely protected. We guarantee zero data loss with every migration.",
    challenge: "Risk of losing critical customer data",
    solution: "Unwavering 100% data integrity"
  },
  {
    icon: Clock,
    title: "Seamless Transition, Zero Downtime", 
    description: "Complete complex migrations in under 2 weeks, ensuring your sales and revenue teams stay fully productive. No operational pauses, no lost deals.",
    challenge: "Weeks of crippling business disruption",
    solution: "Guaranteed zero downtime. Stay productive."
  },
  {
    icon: DollarSign,
    title: "Eliminate Costly Consultants",
    description: "Bypass expensive consultants and lengthy, complex implementations. Achieve enterprise-grade migration quality at a fraction of the traditional cost.",
    challenge: "Exorbitant consultant fees & hidden costs",
    solution: "Save up to 90% on migration expenses"
  }
];

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-slate-950">
      <div className="container max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Teams Choose QuillSwitch
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Move faster, save money, and sleep better knowing your data is in expert hands.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <FadeIn key={index} delay={`${(index + 1) * 100}` as any}>
              <div className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-primary/50 transition-all hover:-translate-y-1 h-full">
                {/* Icon */}
                <div className="mb-6 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-slate-400 leading-relaxed mb-6">
                  {benefit.description}
                </p>
                
                {/* Comparison */}
                <div className="space-y-4 pt-6 border-t border-slate-800">
                  <div className="flex items-start gap-3">
                    <X className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-500 line-through">{benefit.challenge}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white font-medium">{benefit.solution}</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
