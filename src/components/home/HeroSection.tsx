
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import FadeIn from "@/components/animations/FadeIn";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const HeroSection = () => {
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
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
              Intelligent CRM Migration
            </Badge>
          </FadeIn>
          <FadeIn delay="100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Seamless CRM Migration with AI-Powered Mapping
            </h1>
          </FadeIn>
          <FadeIn delay="200">
            <p className="text-xl text-muted-foreground mb-8">
              Painlessly migrate from Salesforce to HubSpot, or between any other CRMs, 
              with automated field mapping, data validation, and real-time monitoring.
            </p>
          </FadeIn>
          <FadeIn delay="300">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={handleStartMigration} size="lg" className="gap-2">
                Start Migration <ArrowRight size={16} />
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/features">
                  Explore Features
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
