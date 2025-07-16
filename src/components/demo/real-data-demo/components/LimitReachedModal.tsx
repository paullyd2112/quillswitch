import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Users, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordCount: number;
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({
  isOpen,
  onClose,
  recordCount
}) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePayment = async (priceId: string, planName: string) => {
    try {
      setIsProcessingPayment(true);
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          priceId,
          planName,
          metadata: {
            source: 'demo_limit_reached',
            recordCount: recordCount
          }
        }
      });

      if (error) {
        console.error('Payment error:', error);
        toast.error('Payment setup failed. Please try again.');
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
        toast.success('Redirecting to secure payment...');
      }
    } catch (error) {
      console.error('Unexpected payment error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Demo Limit Reached! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success Message */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-lg font-medium">
                Successfully processed {recordCount} records from your CRM
              </span>
            </div>
            <p className="text-muted-foreground">
              You've seen QuillSwitch in action with your real data. Ready for the full migration?
            </p>
          </div>

          {/* Migration Service Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Express Migration */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Express Migration</span>
                  </CardTitle>
                  <Badge variant="secondary">Most Popular</Badge>
                </div>
                <CardDescription>
                  Complete CRM migration with founder support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$2,997</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Complete data migration (all records)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Personal consultation call</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Custom field mapping</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Data validation & cleanup</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>7-day migration guarantee</span>
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handlePayment('price_express_migration', 'Express Migration')}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'Processing...' : 'Get Express Migration'}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Migration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Premium Migration</span>
                </CardTitle>
                <CardDescription>
                  Full-service migration with dedicated support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$4,997</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Everything in Express Migration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Dedicated migration specialist</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Team training sessions (2 hours)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>30-day post-migration support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Integration with 3rd party tools</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handlePayment('price_premium_migration', 'Premium Migration')}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'Processing...' : 'Get Premium Migration'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* What Happens Next */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>What Happens Next?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto">
                    1
                  </div>
                  <h4 className="font-medium">Secure Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete your payment securely through Stripe
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto">
                    2
                  </div>
                  <h4 className="font-medium">Personal Outreach</h4>
                  <p className="text-sm text-muted-foreground">
                    I'll personally contact you within 24 hours to discuss your migration
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto">
                    3
                  </div>
                  <h4 className="font-medium">Migration Complete</h4>
                  <p className="text-sm text-muted-foreground">
                    Your CRM migration completed within 7 days, guaranteed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              🔒 Secure payment powered by Stripe • 💯 100% money-back guarantee • 🚀 7-day delivery
            </p>
            <Button variant="ghost" onClick={onClose}>
              Continue Exploring Demo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LimitReachedModal;