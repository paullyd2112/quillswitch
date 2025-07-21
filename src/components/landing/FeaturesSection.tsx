
import React from "react";
import { TrendingUp, Clock, DollarSign, Users, CheckSquare, Handshake } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Keep Revenue Growing",
    description: "Your sales team stays productive during the switch. No lost deals, no downtime, no excuses."
  },
  {
    icon: Clock,
    title: "Switch in Days, Not Months",
    description: "Complete your CRM migration in under 2 weeks. Get back to business while competitors are still planning."
  },
  {
    icon: DollarSign,
    title: "Save $50K+ in Consulting Fees",
    description: "Skip expensive consultants and lengthy implementations. Get enterprise-quality results at a fraction of the cost."
  },
  {
    icon: Users,
    title: "Zero Training Required",
    description: "Your team focuses on what they do best - selling. We handle the technical complexity behind the scenes."
  },
  {
    icon: CheckSquare,
    title: "Perfect Data, Every Time",
    description: "Your customer data arrives clean, organized, and ready to use. No missing contacts, no broken relationships."
  },
  {
    icon: Handshake,
    title: "We Guarantee Success",
    description: "Your migration works perfectly, or we fix it for free. No hidden costs, no surprises, no risk."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-friendly-bg">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            From Pain Points to Perfect Solutions
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-friendly-text-secondary">
            Finally, a CRM migration that solves your business problems instead of creating new ones.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
            >
              <div className="icon-container">
                <feature.icon size={26} />
              </div>
              <h3>
                {feature.title}
              </h3>
              <p>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
