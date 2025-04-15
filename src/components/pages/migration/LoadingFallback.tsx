
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LoadingFallbackProps {
  error?: Error | null;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <div className="container px-4 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          {error ? (
            <>
              <div className="bg-red-500/10 dark:bg-red-900/20 p-4 rounded-full inline-flex mb-6">
                <RefreshCw className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-xl font-medium mb-3">Error Loading Migration Data</h2>
              <p className="text-muted-foreground mb-6">
                {error.message || "We encountered a problem while loading your migration data. This could be due to a network issue or the migration project may not exist."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => window.location.reload()}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/migrations')}
                >
                  Return to Migrations List
                </Button>
              </div>
            </>
          ) : (
            <>
              <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-brand-500" />
              <h2 className="text-xl font-medium">Loading migration data...</h2>
              <p className="text-muted-foreground mt-2">
                This may take a few moments...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingFallback;
