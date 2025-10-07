
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
    <section className="py-32 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-6">
              THE QUILLSWITCH ADVANTAGE
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              Migration That Actually Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Stop worrying. Start switching. We've solved the problems that keep teams stuck.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <FadeIn key={index} delay={`${(index + 1) * 100}` as any}>
              <div className="group p-10 rounded-3xl bg-white border-2 border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 h-full">
                {/* Icon */}
                <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <benefit.icon className="h-8 w-8 text-white" strokeWidth={2} />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                  {benefit.description}
                </p>
                
                {/* Comparison */}
                <div className="space-y-4 pt-6 border-t-2 border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <X className="h-3 w-3 text-red-600" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-500 font-medium line-through">{benefit.challenge}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-900 font-bold">{benefit.solution}</span>
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
