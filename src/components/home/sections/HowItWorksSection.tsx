
import React, { useState, useEffect } from 'react';
import { ArrowRight, Database, Brain, Zap, CheckCircle } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const steps = [
  {
    icon: Database,
    title: "Connect",
    description: "Secure API connections to your source and target CRMs",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Gemini AI analyzes and maps your data structures intelligently",
    color: "from-blue-600 to-blue-700"
  },
  {
    icon: Zap,
    title: "Migrate",
    description: "Lightning-fast transfer with real-time monitoring",
    color: "from-blue-400 to-blue-500"
  },
  {
    icon: CheckCircle,
    title: "Validate",
    description: "Comprehensive validation ensures 100% data integrity",
    color: "from-blue-500 to-blue-600"
  }
];

const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Four simple steps to migrate your CRM data with AI precision.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          {/* Flow diagram */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="relative flex-1 max-w-xs">
                <FadeIn delay={`${(index + 1) * 200}` as any}>
                  <div 
                    className={`
                      relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer
                      ${activeStep === index 
                        ? 'bg-slate-800 border-slate-600 transform scale-105' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }
                    `}
                    onClick={() => setActiveStep(index)}
                  >
                    {/* Glowing background */}
                    <div 
                      className={`
                        absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500
                        bg-gradient-to-br ${step.color}
                        ${activeStep === index ? 'opacity-10' : ''}
                      `}
                    />
                    
                    {/* Step number */}
                    <div className={`
                      absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center
                      text-sm font-bold text-white transition-all duration-500
                      bg-gradient-to-br ${step.color}
                      ${activeStep === index ? 'scale-110 shadow-lg' : ''}
                    `}>
                      {index + 1}
                    </div>
                    
                    {/* Icon */}
                    <div className={`
                      mb-4 p-3 rounded-xl inline-flex transition-all duration-500
                      bg-gradient-to-br ${step.color}
                      ${activeStep === index ? 'scale-110' : ''}
                    `}>
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Active indicator */}
                    <div className={`
                      mt-4 h-1 rounded-full transition-all duration-500
                      bg-gradient-to-r ${step.color}
                      ${activeStep === index ? 'w-full' : 'w-0'}
                    `} />
                  </div>
                </FadeIn>
                
                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-12 space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${activeStep === index ? 'bg-primary scale-125' : 'bg-slate-700 hover:bg-slate-600'}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
