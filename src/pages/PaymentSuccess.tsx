
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tier = searchParams.get("tier");

  useEffect(() => {
    toast.success("Payment successful! Welcome to QuillSwitch!");
  }, []);

  const getTierInfo = () => {
    if (tier === 'essentials') {
      return {
        name: "Essentials Plan",
        price: "$999",
        features: [
          "Complete data migration for up to 250,000 records",
          "AI-powered field mapping",
          "Data validation & cleansing",
          "24/7 support during migration",
          "Standard integrations"
        ]
      };
    } else if (tier === 'pro') {
      return {
        name: "Professional Migration Plan",
        price: "$2,499",
        features: [
          "Complete data migration for up to 500,000 records",
          "Everything in Essentials",
          "Priority processing",
          "Advanced custom object support",
          "Dedicated migration specialist",
          "Complex transformation support"
        ]
      };
    }
    return {
      name: "QuillSwitch Plan",
      price: "Paid",
      features: ["Complete CRM migration solution"]
    };
  };

  const tierInfo = getTierInfo();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for choosing QuillSwitch. Your migration journey starts now!
          </p>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Order Confirmed
            </CardTitle>
            <CardDescription>
              You have successfully purchased the {tierInfo.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold">{tierInfo.name}</h3>
                <p className="text-sm text-muted-foreground">One-time payment</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{tierInfo.price}</p>
                <p className="text-sm text-muted-foreground">USD</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">What's included:</h4>
              <ul className="space-y-2">
                {tierInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Follow these steps to get started with your CRM migration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Check Your Email</h4>
                  <p className="text-sm text-muted-foreground">
                    We've sent you a confirmation email with next steps and access instructions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Access Your Dashboard</h4>
                  <p className="text-sm text-muted-foreground">
                    Log in to your QuillSwitch dashboard to begin setting up your migration.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Connect Your CRMs</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect your source and destination CRM systems to start the migration process.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/app/dashboard")} size="lg">
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/")} size="lg">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
