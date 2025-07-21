
import React from 'react';
import { AlertTriangle, Shield, CheckCircle, Clock } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const problems = [
  { icon: AlertTriangle, text: "Losing customer data?", color: "text-blue-400" },
  { icon: AlertTriangle, text: "Business disruption for weeks?", color: "text-blue-300" },
  { icon: AlertTriangle, text: "Expensive consultants?", color: "text-blue-500" },
  { icon: AlertTriangle, text: "Complex technical setup?", color: "text-blue-400" }
];

const solutions = [
  { icon: Shield, text: "Your Data Stays Safe", color: "text-white" },
  { icon: CheckCircle, text: "Business Keeps Running", color: "text-blue-400" },
  { icon: Clock, text: "Done in Days, Not Months", color: "text-white" },
  { icon: CheckCircle, text: "Simple Setup Process", color: "text-blue-300" }
];

const ProblemSolutionSection: React.FC = () => {
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

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Problems Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-blue-400 mb-8 text-center">The Old Way</h3>
            {problems.map((problem, index) => (
              <FadeIn key={index} delay={`${(index + 1) * 100}` as any}>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-950/20 border border-blue-900/30 hover:border-blue-700/50 transition-all duration-300">
                  <problem.icon className={`h-6 w-6 ${problem.color}`} />
                  <span className="text-lg text-slate-200">{problem.text}</span>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Solutions Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-8 text-center">The QuillSwitch Way</h3>
            {solutions.map((solution, index) => (
              <FadeIn key={index} delay={`${(index + 1) * 100 + 200}` as any}>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-950/20 border border-blue-900/30 hover:border-blue-700/50 transition-all duration-300 transform hover:scale-105">
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
