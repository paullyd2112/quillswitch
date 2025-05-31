
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import { DataType, MigrationStats } from "../types";

interface MigrateTabProps {
  sourceCrm: string;
  targetCrm: string;
  selectedDataTypes: string[];
  dataTypes: DataType[];
  migrationProgress: number;
  isMigrating: boolean;
  isMigrationComplete: boolean;
  migrationStats: MigrationStats;
  onStartMigration: () => void;
  onBack: () => void;
  formatTime: (seconds: number) => string;
}

const MigrateTab: React.FC<MigrateTabProps> = ({
  sourceCrm,
  targetCrm,
  selectedDataTypes,
  dataTypes,
  migrationProgress,
  isMigrating,
  isMigrationComplete,
  migrationStats,
  onStartMigration,
  onBack,
  formatTime
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Start Your Migration</h3>
        
        <div className="space-y-6">
          <p className="text-muted-foreground mb-4">
            You're ready to migrate your data from {sourceCrm} to {targetCrm}.
            Click the button below to start the full migration process.
          </p>
          
          {!isMigrating && migrationProgress === 0 && !isMigrationComplete ? (
            <Button onClick={onStartMigration} className="w-full">
              Start Full Migration
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Migration progress</span>
                  <span className="font-medium">{Math.round(migrationProgress)}%</span>
                </div>
                <Progress value={migrationProgress} className="h-2" />
              </div>
              
              {isMigrating && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mr-3"></div>
                    <div className="text-blue-600 dark:text-blue-400">
                      Migration in progress... {Math.round(migrationProgress)}% complete
                    </div>
                  </div>
                  <div className="text-sm text-blue-500 dark:text-blue-400 mt-2">
                    {migrationStats.recordsMigrated.toLocaleString()} of {dataTypes
                      .filter(dt => selectedDataTypes.includes(dt.id))
                      .reduce((acc, dt) => acc + dt.count, 0).toLocaleString()} records migrated
                  </div>
                </div>
              )}
              
              {isMigrationComplete && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <div className="flex items-center text-green-700 dark:text-green-400">
                    <Check className="h-5 w-5 mr-2" />
                    <div className="font-medium">Migration Completed Successfully</div>
                  </div>
                  <div className="mt-2 text-green-600 dark:text-green-500 text-sm">
                    Your data migration from {sourceCrm} to {targetCrm} has been completed. 
                    {migrationStats.recordsMigrated.toLocaleString()} records were successfully migrated.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {(isMigrating || isMigrationComplete) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
            <h4 className="font-medium mb-4">Migration Statistics</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-muted-foreground mb-1">
                  Records Migrated
                </div>
                <div className="font-bold">
                  {migrationStats.recordsMigrated.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-muted-foreground mb-1">
                  Migration Speed
                </div>
                <div className="font-bold">
                  {migrationStats.recordsPerSecond} records/sec
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-muted-foreground mb-1">
                  Time Elapsed
                </div>
                <div className="font-bold">
                  {formatTime(migrationStats.timeElapsed)}
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-muted-foreground mb-1">
                  Status
                </div>
                <div className="font-bold text-green-600 dark:text-green-400">
                  {isMigrationComplete ? "Completed" : "In Progress"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
            <h4 className="font-medium mb-4">Migration Details</h4>
            
            <div className="space-y-4">
              {selectedDataTypes.map(typeId => {
                const dataType = dataTypes.find(dt => dt.id === typeId);
                if (!dataType) return null;
                
                const typeMigrationProgress = isMigrationComplete ? 100 : 
                  typeId === "contacts" ? Math.min(100, migrationProgress * 1.2) :
                  typeId === "companies" ? Math.min(100, migrationProgress * 0.9) :
                  Math.min(100, migrationProgress * 0.8);
                  
                return (
                  <div key={typeId} className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{dataType.name}</div>
                      <div className="text-xs">
                        {Math.round((typeMigrationProgress / 100) * dataType.count).toLocaleString()} / {dataType.count.toLocaleString()}
                      </div>
                    </div>
                    
                    <Progress value={typeMigrationProgress} className="h-1.5 mb-2" />
                    
                    <div className="text-xs text-right text-muted-foreground">
                      {Math.round(typeMigrationProgress)}%
                    </div>
                  </div>
                );
              })}
              
              {isMigrationComplete && (
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h5 className="font-medium mb-3">Migration Complete</h5>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="rounded-full w-5 h-5 bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-2 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm">All {migrationStats.recordsMigrated.toLocaleString()} records migrated successfully</span>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="rounded-full w-5 h-5 bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-2 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm">Data integrity maintained throughout migration</span>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="rounded-full w-5 h-5 bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-2 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm">Ready for production use in {targetCrm}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline"
          onClick={onBack}
          disabled={isMigrating}
        >
          Back: Validation
        </Button>
      </div>
    </div>
  );
};

export default MigrateTab;
