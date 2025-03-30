
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MigrationError } from "@/integrations/supabase/migrationTypes";
import { AlertCircle, CheckCircle } from "lucide-react";

interface ErrorSummaryProps {
  errors: MigrationError[];
  limit?: number;
}

const ErrorSummary: React.FC<ErrorSummaryProps> = ({ errors, limit = 5 }) => {
  const limitedErrors = errors.slice(0, limit);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Recent Errors</CardTitle>
          <div className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {errors.length} Issues
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {limitedErrors.length > 0 ? (
          <div className="space-y-3">
            {limitedErrors.map((error) => (
              <div key={error.id} className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {error.resolved ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{error.error_type}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(error.created_at)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{error.error_message}</p>
                  {error.resolved && error.resolution_notes && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Resolution: {error.resolution_notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {errors.length > limit && (
              <div className="pt-2 text-center">
                <p className="text-sm text-muted-foreground">
                  + {errors.length - limit} more errors
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-base font-medium">No Errors Found</h3>
            <p className="text-sm text-muted-foreground mt-1">Your migration is running smoothly</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorSummary;
