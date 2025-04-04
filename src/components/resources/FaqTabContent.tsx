
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FaqSection from "@/components/resources/FaqSection";

const FaqTabContent = () => {
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-6">
        <FaqSection />
      </CardContent>
    </Card>
  );
};

export default FaqTabContent;
