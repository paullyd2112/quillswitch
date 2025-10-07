
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
    <section className="py-24 px-6 bg-white border-t border-slate-200">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 text-center">
            Why teams choose us
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center">
            Built by people who've done hundreds of migrations. We know where things go wrong.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="space-y-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded bg-slate-900 flex items-center justify-center">
                <benefit.icon className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900">
                {benefit.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
              
              {/* Comparison */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <X className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-500">{benefit.challenge}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-slate-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-900 font-medium">{benefit.solution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
