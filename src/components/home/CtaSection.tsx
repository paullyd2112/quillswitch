
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const CtaSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    navigate(user ? "/migrations/setup" : "/auth");
  };
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-indigo-600/20 opacity-10"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0xaDF2NGgtMXYtNHptLTIgN2g0djFoLTR2LTF6bS00LThoMXY3aC0xdi03em0wIDEwaDEydjFIMzJ2LTF6bTAgMmgxMnYxSDMydi0xem0wIDJoMTJ2MUgzMnYtMXptMTUtMThIMzF2MjJoMTZWMTZ6bTEtMUgzMHYyNGgxOFYxNXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl shadow-primary/10">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your <span className="text-primary">CRM Migration</span> Process?
              </h2>
              <p className="text-slate-400 mb-8">
                Start your migration today and experience a seamless, intelligent transfer of your critical business data with our enterprise-grade platform.
              </p>
              
              <div className="space-y-3 mb-8">
                {[
                  "Free test migration with your data",
                  "No credit card required to start",
                  "Expert migration consultation included",
                  "Cancel anytime, no commitments"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted} 
                  className="bg-primary hover:bg-primary/90 gap-2"
                >
                  Get Started <ArrowRight size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate("/demo")}
                  className="border-slate-700 hover:bg-slate-800"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block relative bg-gradient-to-br from-primary/20 to-indigo-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full bg-primary opacity-10 animate-ping"></div>
                  <div className="absolute inset-8 rounded-full bg-primary opacity-20"></div>
                  <div className="absolute inset-16 rounded-full bg-primary opacity-30"></div>
                  <div className="absolute inset-[5.5rem] w-6 h-6 bg-white rounded-full shadow-lg shadow-primary/50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
