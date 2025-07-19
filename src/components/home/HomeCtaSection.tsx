
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const HomeCtaSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/app/setup");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="section-premium" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--primary) / 0.03) 100%)' }}>
      <div className="container max-w-5xl mx-auto text-center">
        {/* Premium heading with display font */}
        <h2 className="font-display text-4xl md:text-6xl font-bold text-hero-gradient mb-8 animate-premium-fade-in">
          Ready to Transform Your CRM Migration Experience?
        </h2>
        
        {/* Enhanced description with better typography */}
        <p className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto mb-12 animate-premium-fade-in delay-200" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Join <span className="text-primary font-semibold">hundreds of companies</span> that have successfully migrated their CRM data with QuillSwitch. 
          Experience the future of data migration today.
        </p>
        
        {/* Premium CTA buttons with enhanced styling */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-premium-fade-in delay-400">
          <div className="btn-premium-primary interactive-premium animate-premium-glow" onClick={handleGetStarted}>
            {user ? "Start New Migration" : "Start Free Migration"} 
            <ArrowRight size={20} className="ml-2" />
          </div>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/demo")}
            className="gap-2 px-8 py-4 text-lg glass-panel interactive-premium hover:border-primary/30 font-display font-semibold"
          >
            <Play size={20} /> Watch Live Demo
          </Button>
        </div>
        
        {/* Premium guarantee badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-8 animate-premium-fade-in delay-600">
          {[
            "No credit card required",
            "Free test migration",
            "Setup in under 5 minutes",
            "24/7 expert support"
          ].map((feature, index) => (
            <div key={index} className="badge-premium">
              <CheckCircle2 size={16} className="text-primary" />
              <span className="text-foreground font-medium">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* Social proof */}
        <div className="text-sm opacity-70 animate-premium-fade-in delay-800" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Trusted by companies migrating <span className="text-primary font-semibold">2M+ records</span> safely every month
        </div>
      </div>
    </section>
  );
};

export default HomeCtaSection;
