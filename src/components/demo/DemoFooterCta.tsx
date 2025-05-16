
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const DemoFooterCta: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/20 via-slate-100 to-slate-50 dark:from-primary/20 dark:via-slate-900/70 dark:to-slate-900/60 overflow-hidden">
      <div className="px-8 py-10 md:py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Effortless CRM Migration?
          </h2>
          
          <p className="text-lg mb-8 text-muted-foreground">
            Join hundreds of companies that have simplified their CRM migration with QuillSwitch. 
            Get started today and migrate weeks faster with better results.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => navigate("/app/setup")}
            >
              Start Your Free Migration <ArrowRight size={16} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => window.open("#schedule-demo", "_blank")}
            >
              Schedule a Demo
            </Button>
          </div>
          
          <Separator className="mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <h3 className="font-medium mb-3">No Commitment Required</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Free test migration with your data</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">No credit card needed to start</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Cancel anytime</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Enterprise-Grade Security</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">SOC 2 Type II certified</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">End-to-end encryption</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Zero data retention policy</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">World-Class Support</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Free migration consultation</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Expert technical support</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Comprehensive knowledge base</span>
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
