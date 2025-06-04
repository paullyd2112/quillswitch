
import React from 'react';
import { CheckCircle } from 'lucide-react';

const SecurityBenefits: React.FC = () => {
  const benefits = [
    'Server-side encryption using pgsodium',
    'Row-level security with user isolation',
    'Audit logging for all credential access',
    'Automatic expiry tracking and alerts',
  ];

  return (
    <div className="border-t pt-4">
      <h4 className="font-medium mb-3">Security Benefits:</h4>
      <div className="grid gap-2 text-sm">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBenefits;
