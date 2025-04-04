
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CtaSection = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleStartMigration = () => {
    if (user) {
      // User is logged in, redirect to setup wizard
      navigate("/migrations/setup");
    } else {
      // User is not logged in, redirect to auth page
      toast.info("Please create an account to start your migration", {
        duration: 4000,
      });
      navigate("/auth/register");
    }
  };

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
          <Button onClick={handleStartMigration} size="lg" className="gap-2">
            Start Your Migration <ArrowRight size={16} />
          </Button>
        </FadeIn>
      </div>
    </ContentSection>
  );
};

export default CtaSection;
