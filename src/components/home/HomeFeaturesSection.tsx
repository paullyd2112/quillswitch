
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Users, CheckCircle, Database, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Enterprise Security",
    description: "Bank-level encryption and SOC 2 compliance ensure your data stays protected throughout the migration process.",
    color: "from-green-400/20 to-green-600/20",
    borderColor: "border-green-500/30"
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Lightning Fast",
    description: "Complete migrations in hours, not weeks. Our optimized algorithms process millions of records efficiently.",
    color: "from-yellow-400/20 to-yellow-600/20",
    borderColor: "border-yellow-500/30"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "No Technical Expertise Required",
    description: "User-friendly interface designed for business users. No coding or technical knowledge needed.",
    color: "from-blue-400/20 to-blue-600/20",
    borderColor: "border-blue-500/30"
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "99.9% Data Accuracy",
    description: "Advanced validation and matching algorithms ensure your data integrity throughout the migration.",
    color: "from-purple-400/20 to-purple-600/20",
    borderColor: "border-purple-500/30"
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "Smart Data Mapping",
    description: "AI-powered field mapping automatically matches your data structures between different CRM systems.",
    color: "from-indigo-400/20 to-indigo-600/20",
    borderColor: "border-indigo-500/30"
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Real-Time Progress",
    description: "Track your migration progress in real-time with detailed reporting and instant notifications.",
    color: "from-orange-400/20 to-orange-600/20",
    borderColor: "border-orange-500/30"
  }
];

const HomeFeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-950 to-slate-900 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      <div className="container max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 border border-primary/20 text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Why Choose QuillSwitch
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight">
            Why Businesses Choose
            <span className="block bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              QuillSwitch
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Built specifically for non-technical teams who need enterprise-grade results without the complexity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className={`group relative overflow-hidden bg-gradient-to-br ${feature.color} backdrop-blur-sm border ${feature.borderColor} hover:border-opacity-60 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl`}>
              <CardContent className="p-8 relative z-10">
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </CardContent>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button 
            onClick={() => navigate("/features")}
            variant="outline" 
            size="lg"
            className="group bg-slate-800/50 text-slate-200 border-slate-600/50 hover:bg-slate-700/50 hover:border-primary/50 backdrop-blur-sm px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105"
          >
            See All Features 
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturesSection;
