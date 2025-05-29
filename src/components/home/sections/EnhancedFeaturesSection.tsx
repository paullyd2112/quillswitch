
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Shield, Zap, Database, CheckCircle, Clock } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const features = [
  {
    icon: Brain,
    title: "AI Schema Mapping",
    description: "Gemini-powered intelligent field matching with 99.9% accuracy. Our AI understands data relationships and suggests optimal mappings automatically.",
    gradient: "from-blue-400 to-blue-600"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption, SOC 2 compliance, and zero-trust architecture ensure your data remains protected throughout every migration step.",
    gradient: "from-blue-500 to-blue-700"
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    description: "Process millions of records in hours, not weeks. Our optimized algorithms and parallel processing deliver unmatched speed.",
    gradient: "from-blue-300 to-blue-500"
  },
  {
    icon: Database,
    title: "Universal Compatibility",
    description: "Connect to 50+ CRM platforms with native API integrations. From Salesforce to HubSpot, we speak every CRM's language.",
    gradient: "from-blue-400 to-blue-600"
  },
  {
    icon: CheckCircle,
    title: "Guaranteed Accuracy",
    description: "Advanced validation engines and real-time monitoring ensure 100% data integrity with comprehensive rollback capabilities.",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: Clock,
    title: "Real-Time Intelligence",
    description: "Live progress tracking, predictive analytics, and instant notifications keep you informed throughout the entire process.",
    gradient: "from-blue-400 to-blue-700"
  }
];

const EnhancedFeaturesSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 bg-slate-950">
      <div className="container max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Next-Generation Migration Technology
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Powered by cutting-edge AI and built for enterprise-scale performance.
            </p>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeIn key={index} delay={`${(index + 1) * 100}` as any}>
              <Card 
                className={`
                  relative overflow-hidden bg-slate-900 border-slate-800 
                  transition-all duration-500 ease-out cursor-pointer
                  ${hoveredCard === index ? 'transform -translate-y-2 border-slate-600' : 'hover:border-slate-700'}
                `}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated background gradient */}
                <div 
                  className={`
                    absolute inset-0 opacity-0 transition-opacity duration-500
                    bg-gradient-to-br ${feature.gradient}
                    ${hoveredCard === index ? 'opacity-10' : ''}
                  `}
                />
                
                <CardContent className="relative p-8 h-full flex flex-col">
                  {/* Icon with glow effect */}
                  <div className={`
                    mb-6 relative inline-flex items-center justify-center
                    w-16 h-16 rounded-xl transition-all duration-500
                    ${hoveredCard === index ? 'scale-110' : ''}
                  `}>
                    <div className={`
                      absolute inset-0 rounded-xl opacity-20 transition-opacity duration-500
                      bg-gradient-to-br ${feature.gradient}
                      ${hoveredCard === index ? 'opacity-40 blur-md' : ''}
                    `} />
                    <feature.icon 
                      className={`
                        h-8 w-8 relative z-10 transition-colors duration-500
                        ${hoveredCard === index ? 'text-white' : 'text-blue-400'}
                      `} 
                    />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-400 leading-relaxed flex-grow transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Hover indicator */}
                  <div className={`
                    mt-4 h-1 rounded-full transition-all duration-500
                    bg-gradient-to-r ${feature.gradient}
                    ${hoveredCard === index ? 'w-full opacity-100' : 'w-0 opacity-0'}
                  `} />
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedFeaturesSection;
