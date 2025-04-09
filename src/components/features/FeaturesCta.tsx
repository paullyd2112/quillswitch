
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturesCta = () => {
  return (
    <section className="py-16 px-4 md:px-6 bg-brand-50 dark:bg-brand-900/20">
      <div className="container max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to transform your CRM migration?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Start your migration today and experience the difference with QuillSwitch's powerful features.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link to="/migrations/setup">Start Migration <ArrowRight size={16} /></Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesCta;
