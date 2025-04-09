
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturesCta = () => {
  return (
    <section className="py-16 px-4 md:px-6 bg-gray-50 dark:bg-slate-900/80">
      <div className="container max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Ready to transform your CRM migration?</h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
          Start your migration today and experience the difference with QuillSwitch's powerful features.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="gap-2 bg-brand-500 hover:bg-brand-600 text-white">
            <Link to="/migrations/setup">Start Migration <ArrowRight size={16} /></Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50">
            <Link to="/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesCta;
