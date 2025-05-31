
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Calculator, AlertTriangle, Users, Building2 } from "lucide-react";
import { getRecordCountEstimate, getTierForRecordCount, formatNumber, formatCurrency } from "@/components/pricing/pricingUtils";

interface RecordEstimatorProps {
  selectedDataTypes: string[];
  className?: string;
}

const RecordEstimator: React.FC<RecordEstimatorProps> = ({ 
  selectedDataTypes, 
  className = "" 
}) => {
  const estimatedRecords = getRecordCountEstimate(selectedDataTypes);
  const recommendedTier = getTierForRecordCount(estimatedRecords);
  
  const dataTypeLabels: Record<string, string> = {
    contacts: "Contacts & Leads",
    accounts: "Accounts & Companies", 
    opportunities: "Opportunities & Deals",
    cases: "Cases & Tickets",
    activities: "Activities & Tasks",
    custom: "Custom Objects"
  };

  const tierInfo = {
    essentials: { 
      price: 1999, 
      limit: 50000, 
      name: "Essentials", 
      description: "Perfect for Small Businesses",
      icon: Users
    },
    pro: { 
      price: 4999, 
      limit: 500000, 
      name: "Pro", 
      description: "Built for SMB & Mid-Market",
      icon: Building2
    }
  };

  const currentTier = tierInfo[recommendedTier];
  const isNearLimit = estimatedRecords > (currentTier.limit * 0.8);
  const IconComponent = currentTier.icon;

  return (
    <div className={className}>
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-primary" />
            Migration Record Estimate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Data Types */}
          <div>
            <h4 className="font-medium mb-2">Selected Data Types:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedDataTypes.map(dataType => (
                <Badge key={dataType} variant="outline">
                  {dataTypeLabels[dataType] || dataType}
                </Badge>
              ))}
            </div>
          </div>

          {/* Record Count Estimate */}
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Estimated Total Records:</span>
              <span className="text-2xl font-bold text-primary">
                {formatNumber(estimatedRecords)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              This includes main records plus all associated activities, notes, attachments, and other sub-records that will be migrated.
            </p>
          </div>

          {/* Recommended Plan */}
          <div className="border rounded-lg p-4 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-primary" />
                <span className="font-medium">Recommended Plan:</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{currentTier.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(currentTier.price)}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              Up to {formatNumber(currentTier.limit)} records
            </div>
            <div className="text-xs text-muted-foreground/80">
              {currentTier.description}
            </div>
          </div>

          {/* Warning if near limit */}
          {isNearLimit && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your estimated record count is close to the {currentTier.name} tier limit. 
                Consider the Pro tier ({formatCurrency(tierInfo.pro.price)}) for {formatNumber(tierInfo.pro.limit)} records 
                to ensure you have adequate capacity for your SMB or Mid-Market needs.
              </AlertDescription>
            </Alert>
          )}

          {/* Info about record counting */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>How we count records:</strong> Each contact, company, deal, note, activity, 
              attachment, and custom object counts as one record. A single contact with 5 activities 
              and 3 notes counts as 9 records total (1 + 5 + 3).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordEstimator;
