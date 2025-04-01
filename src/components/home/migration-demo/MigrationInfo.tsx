
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FadeIn from "@/components/animations/FadeIn";

const MigrationInfo = () => {
  return (
    <FadeIn>
      <h2 className="text-3xl font-bold tracking-tight mb-4">
        Stop Overpaying for Your CRM
      </h2>
      <p className="text-muted-foreground mb-6">
        Salesforce and other enterprise CRMs are designed to be sticky, making it difficult 
        and expensive to switch. Our platform breaks those chains, letting you move to more 
        cost-effective solutions without the typical migration pain.
      </p>
      <ul className="space-y-2 mb-6">
        <li className="flex items-start gap-2">
          <span className="text-green-500 mt-1">✓</span>
          <span>Save up to 70% on consultant fees</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-500 mt-1">✓</span>
          <span>Migrate in days instead of months</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-500 mt-1">✓</span>
          <span>Preserve all your valuable customer data</span>
        </li>
      </ul>
      <Button asChild className="gap-2">
        <Link to="/setup">
          Start Your Migration <ArrowRight size={16} />
        </Link>
      </Button>
    </FadeIn>
  );
};

export default MigrationInfo;
