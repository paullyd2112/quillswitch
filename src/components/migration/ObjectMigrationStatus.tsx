
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MigrationObjectType } from "@/integrations/supabase/migrationTypes";

interface ObjectMigrationStatusProps {
  objectTypes: MigrationObjectType[];
}

const ObjectMigrationStatus: React.FC<ObjectMigrationStatusProps> = ({ objectTypes }) => {
  const calculateProgress = (objectType: MigrationObjectType): number => {
    if (objectType.total_records === 0) return 0;
    return Math.round((objectType.processed_records / objectType.total_records) * 100);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in_progress":
        return "text-blue-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Migration Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {objectTypes.map((objectType) => (
            <div key={objectType.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">{objectType.name}</h4>
                  <p className="text-xs text-muted-foreground">{objectType.description}</p>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(objectType.status)}`}>
                  {calculateProgress(objectType)}%
                </span>
              </div>
              <Progress 
                value={calculateProgress(objectType)} 
                className="h-1.5" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{objectType.processed_records} of {objectType.total_records} processed</span>
                <span>{objectType.failed_records} failed</span>
              </div>
            </div>
          ))}

          {objectTypes.length === 0 && (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">No data objects configured for migration</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectMigrationStatus;
