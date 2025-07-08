
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const DemoFooterCta: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-0 shadow-2xl glass-panel relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
      
      <div className="px-8 py-12 md:py-20 text-center relative">
        <div className="max-w-4xl mx-auto">
          {/* Status badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
            <span className="text-sm font-medium text-primary">Ready to Get Started</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text text-transparent leading-tight">
            Ready to Experience Effortless
            <br />
            CRM Migration?
          </h2>
          
          <p className="text-xl mb-10 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join hundreds of companies that have simplified their CRM migration with QuillSwitch. 
            Get started today and migrate weeks faster with better results.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="gap-2 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              onClick={() => navigate("/app/setup")}
            >
              Start Your Free Migration <ArrowRight size={18} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg font-semibold glass-panel border-primary/20 hover:bg-primary/10 transition-all duration-200"
              onClick={() => window.open("#schedule-demo", "_blank")}
            >
              Schedule a Demo
            </Button>
          </div>
          
          <Separator className="mb-10 opacity-30" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 glass-panel rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-bold">✨</span>
                </div>
                <h3 className="font-semibold text-lg">No Commitment Required</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Free test migration with your data</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">No credit card needed to start</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Cancel anytime</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 glass-panel rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-bold">🔒</span>
                </div>
                <h3 className="font-semibold text-lg">Enterprise-Grade Security</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">SOC 2 Type II certified</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">End-to-end encryption</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Zero data retention policy</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 glass-panel rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-bold">🚀</span>
                </div>
                <h3 className="font-semibold text-lg">World-Class Support</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Free migration consultation</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Expert technical support</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Comprehensive knowledge base</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DemoFooterCta;
