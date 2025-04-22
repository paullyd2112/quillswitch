import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FileBarChart } from "lucide-react";

const Reports = () => {
  return (
    <BaseLayout>
      <ContentSection 
        title="Reports"
        description="View and generate detailed reports on your migration processes."
        centered
      >
        <div className="grid gap-8 mt-10">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileBarChart className="h-5 w-5 text-brand-500" />
                  Migration Summary Reports
                </h3>
                <p className="text-muted-foreground">
                  Get a comprehensive overview of your migration projects, including progress, 
                  success rates, and time metrics.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Data Quality Reports</h3>
                <p className="text-muted-foreground">
                  Assess the quality and integrity of your data before, during, and after migration
                  to ensure nothing is lost in the process.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Error Reports</h3>
                <p className="text-muted-foreground">
                  Identify and resolve issues that occurred during the migration process
                  with detailed error logs and resolution suggestions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Validation Reports</h3>
                <p className="text-muted-foreground">
                  Verify that your migrated data meets all required specifications and
                  business rules in your destination system.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Customizable Report Builder</h3>
                <p className="text-muted-foreground">
                  Create tailored reports for specific needs and stakeholders by selecting
                  the metrics and visualizations that matter most to you.
                </p>
              </CardContent>
            </Card>
          </div>
      </ContentSection>
    </BaseLayout>
  );
};

export default Reports;
