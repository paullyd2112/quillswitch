
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Calculator } from "lucide-react";

interface ContactEstimatorProps {
  onEstimateComplete: (estimatedContacts: number) => void;
}

const ContactEstimator: React.FC<ContactEstimatorProps> = ({ onEstimateComplete }) => {
  const [userCount, setUserCount] = useState<number>(100);
  const [averageContactsPerUser, setAverageContactsPerUser] = useState<number>(50);
  const [estimatedContacts, setEstimatedContacts] = useState<number | null>(null);

  const calculateEstimate = () => {
    const estimate = userCount * averageContactsPerUser;
    setEstimatedContacts(estimate);
    onEstimateComplete(estimate);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Don't know your record count?</h3>
            <p className="text-sm text-muted-foreground">Estimate based on your user base</p>
          </div>
          <Users className="h-5 w-5 text-primary" />
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="userCount">Number of users on your platform</Label>
            <Input
              id="userCount"
              type="number"
              min={1}
              value={userCount}
              onChange={(e) => setUserCount(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Total number of customers using your platform
            </p>
          </div>

          <div>
            <Label htmlFor="contactsPerUser">Average contacts per user</Label>
            <Input
              id="contactsPerUser"
              type="number"
              min={1}
              value={averageContactsPerUser}
              onChange={(e) => setAverageContactsPerUser(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Average number of contacts each user maintains
            </p>
          </div>

          <Button onClick={calculateEstimate} className="w-full" variant="secondary">
            <Calculator className="mr-2 h-4 w-4" /> Calculate Estimated Records
          </Button>

          {estimatedContacts !== null && (
            <div className="bg-muted/40 p-4 rounded-md text-center">
              <p className="text-sm">Estimated Records:</p>
              <p className="text-xl font-bold">{estimatedContacts.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ContactEstimator;
