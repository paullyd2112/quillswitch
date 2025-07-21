
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

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {benefits.map((benefit, index) => (
            <FadeIn key={index} delay={`${(index + 1) * 100}` as any}>
              <EnhancedCard 
                variant="elevated" 
                hover={true} 
                glow={true}
                className="bg-slate-900/80 border-slate-700 backdrop-blur-sm h-full shadow-2xl"
              >
                <CardContent className="p-10 text-center h-full flex flex-col">
                  {/* Premium Icon */}
                  <div className="mb-8 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <benefit.icon className="h-10 w-10 text-white" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed mb-6 text-base flex-grow">
                    {benefit.description}
                  </p>
                  
                  {/* Enhanced Challenge/Solution comparison */}
                  <div className="bg-slate-800/30 rounded-xl p-6 space-y-5 border border-slate-700/50 mt-auto">
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 letterspacing-wide">
                        The Challenge
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-600/40 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <X className="h-3 w-3 text-slate-400" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm leading-relaxed text-slate-300">{benefit.challenge}</span>
                      </div>
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                    
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        With QuillSwitch
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="h-3 w-3 text-blue-400" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm leading-relaxed text-white font-medium">{benefit.solution}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
