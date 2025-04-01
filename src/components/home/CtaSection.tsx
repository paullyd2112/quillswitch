
import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <ContentSection className="pb-32">
      <div className="text-center max-w-2xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to Switch CRM?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start your CRM migration today and experience a seamless transition without the typical headaches and costs.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/setup">
              Start Your Migration <ArrowRight size={16} />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </ContentSection>
  );
};

export default CtaSection;
