
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ExpirySelectorProps {
  expiry: string;
  onExpiryChange: (value: string) => void;
  onCustomExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showWarning: boolean;
}

const ExpirySelector: React.FC<ExpirySelectorProps> = ({
  expiry,
  onExpiryChange,
  onCustomExpiryChange,
  showWarning
}) => {
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-2">
      <Label htmlFor="expires_at">Expiry</Label>
      <Select value={expiry} onValueChange={onExpiryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select expiration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="never">Never</SelectItem>
          <SelectItem value="30days">30 Days</SelectItem>
          <SelectItem value="60days">60 Days</SelectItem>
          <SelectItem value="90days">90 Days</SelectItem>
          <SelectItem value="1year">1 Year</SelectItem>
          <SelectItem value="custom">Custom Date</SelectItem>
        </SelectContent>
      </Select>
      
      {expiry === 'custom' && (
        <div className="mt-2">
          <Input
            type="date"
            min={minDate}
            onChange={onCustomExpiryChange}
          />
        </div>
      )}
      
      {showWarning && (
        <Alert className="mt-2 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-800">
            This credential will expire in 30 days or less. Consider setting reminders to rotate it.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ExpirySelector;
