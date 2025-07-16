import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { ExtractedData } from "../types";
import LimitReachedModal from "../components/LimitReachedModal";

interface ResultsStepProps {
  extractedData: ExtractedData[];
  onContinue: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({
  extractedData,
  onContinue
}) => {
  const totalRecords = extractedData.reduce((total, data) => total + data.totalCount, 0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Check if we've hit the 100-record limit
  useEffect(() => {
    if (totalRecords >= 100) {
      // Small delay to let the success animation complete
      const timer = setTimeout(() => {
        setShowLimitModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [totalRecords]);

  return (
    <>
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Data Extraction Complete!</h2>
          <p className="text-muted-foreground">
            Successfully extracted {totalRecords} records 
            from your CRM for the migration demo.
            {totalRecords >= 100 && (
              <span className="block mt-2 font-medium text-primary">
                🎉 You've reached the demo limit!
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {extractedData.map((data) => (
            <Card key={data.objectType}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {data.totalCount}
                  </div>
                  <div className="text-sm font-medium capitalize">
                    {data.objectType}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    records extracted
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Your real data is ready for the complete migration experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Data Mapping</div>
                  <div className="text-sm text-muted-foreground">
                    Review and customize how your fields will be mapped between CRMs
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Validation & Preview</div>
                  <div className="text-sm text-muted-foreground">
                    Validate your data and preview the migration results
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Simulation Migration</div>
                  <div className="text-sm text-muted-foreground">
                    Experience the complete migration process with your real data
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button size="lg" onClick={onContinue}>
            Continue with Migration Demo
          </Button>
        </div>
      </div>

      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        recordCount={totalRecords}
      />
    </>
  );
};

export default ResultsStep;