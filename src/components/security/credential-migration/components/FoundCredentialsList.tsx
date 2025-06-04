
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface FoundCredentialsListProps {
  credentials: string[];
}

const FoundCredentialsList: React.FC<FoundCredentialsListProps> = ({ credentials }) => {
  if (credentials.length === 0) return null;

  const getCredentialType = (key: string): string => {
    if (key.includes('api_key')) return 'API Key';
    if (key.includes('token')) return 'Token';
    if (key.includes('secret')) return 'Secret';
    return 'Credential';
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium">Found Potential Credentials:</h4>
      <div className="grid gap-2">
        {credentials.map((key, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-orange-500" />
              <span className="font-mono text-sm">{key}</span>
            </div>
            <Badge variant="outline">
              {getCredentialType(key)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoundCredentialsList;
