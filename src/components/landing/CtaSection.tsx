import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const CtaSection = () => {
  const navigate = useNavigate();
  return <section className="py-24 px-4 md:px-8 bg-brand-600/10">
      <div className="container max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-white">
          Ready to Simplify Your CRM Migration?
        </h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
          Start your migration journey today and experience a seamless, intelligent 
          transfer of your critical business data.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/migrations/setup")} className="gap-2 bg-brand-600 hover:bg-brand-700">
            Start Migration <ArrowRight size={16} />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/features")} className="gap-2 border-slate-700 hover:bg-slate-800 text-slate-300">
            View Features
          </Button>
        </div>
      </div>
    </section>;
};
export default CtaSection;