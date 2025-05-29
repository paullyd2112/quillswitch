
import React from 'react';
import { AlertTriangle, Shield, CheckCircle, Zap } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const problems = [
  { icon: AlertTriangle, text: "Data Loss?", color: "text-red-400" },
  { icon: AlertTriangle, text: "Schema Mismatches?", color: "text-orange-400" },
  { icon: AlertTriangle, text: "Security Risks?", color: "text-yellow-400" },
  { icon: AlertTriangle, text: "Manual Complexity?", color: "text-red-400" }
];

const solutions = [
  { icon: Shield, text: "Guaranteed Data Integrity", color: "text-green-400" },
  { icon: CheckCircle, text: "Intelligent Schema Mapping", color: "text-blue-400" },
  { icon: Shield, text: "Enterprise-Grade Security", color: "text-purple-400" },
  { icon: Zap, text: "AI-Powered Automation", color: "text-cyan-400" }
];

const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              From Pain Points to Perfect Solutions
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Traditional CRM migration challenges meet their match with AI-powered intelligence.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Problems Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-red-400 mb-8 text-center">Common Challenges</h3>
            {problems.map((problem, index) => (
              <FadeIn key={index} delay={`${(index + 1) * 100}` as any}>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-red-950/20 border border-red-900/30 hover:border-red-700/50 transition-all duration-300">
                  <problem.icon className={`h-6 w-6 ${problem.color}`} />
                  <span className="text-lg text-slate-200">{problem.text}</span>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Solutions Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-green-400 mb-8 text-center">QuillSwitch Solutions</h3>
            {solutions.map((solution, index) => (
              <FadeIn key={index} delay={`${(index + 1) * 100 + 200}` as any}>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-green-950/20 border border-green-900/30 hover:border-green-700/50 transition-all duration-300 transform hover:scale-105">
                  <solution.icon className={`h-6 w-6 ${solution.color}`} />
                  <span className="text-lg text-slate-200">{solution.text}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
