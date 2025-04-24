
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";

interface ValidationResultsProps {
  issues: Array<{
    record_index: number;
    field_name: string;
    error_type: string;
    error_message: string;
    raw_value?: string;
    suggestion?: string;
  }>;
  onRetry?: () => void;
}

export const ValidationResults = ({ issues, onRetry }: ValidationResultsProps) => {
  const groupedIssues = issues.reduce((acc, issue) => {
    const key = `${issue.record_index}-${issue.error_type}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(issue);
    return acc;
  }, {} as Record<string, typeof issues>);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Validation Results</h3>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Retry Import
          </Button>
        )}
      </div>

      {Object.entries(groupedIssues).map(([key, groupIssues]) => (
        <Card key={key} className="p-4">
          <div className="flex items-start space-x-4">
            <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">
                  Row {groupIssues[0].record_index + 1}
                </h4>
                <Badge variant="destructive">
                  {groupIssues[0].error_type.replace('_', ' ')}
                </Badge>
              </div>
              
              <ul className="mt-2 space-y-2">
                {groupIssues.map((issue, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    <span className="font-medium">{issue.field_name}:</span>{' '}
                    {issue.error_message}
                    {issue.raw_value && (
                      <span className="block text-xs text-gray-500">
                        Current value: {issue.raw_value}
                      </span>
                    )}
                    {issue.suggestion && (
                      <span className="block text-xs text-green-600">
                        Suggestion: {issue.suggestion}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ))}

      {issues.length === 0 && (
        <Card className="p-4">
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <p>No validation issues found</p>
          </div>
        </Card>
      )}
    </div>
  );
};
