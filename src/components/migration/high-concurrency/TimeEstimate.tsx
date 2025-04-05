
import React from 'react';

interface TimeEstimateProps {
  timeEstimate: {
    seconds: number;
    formatted: string;
  };
  selectedSourcesCount: number;
  totalRecords: number;
  totalConcurrency: number;
}

const TimeEstimate: React.FC<TimeEstimateProps> = ({
  timeEstimate,
  selectedSourcesCount,
  totalRecords,
  totalConcurrency
}) => {
  return (
    <div className="bg-brand-50/30 dark:bg-brand-900/20 p-4 rounded-md border border-brand-200/30 dark:border-brand-700/20">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Estimated Migration Time</span>
        <span className="font-bold text-brand-600 dark:text-brand-400">{timeEstimate.formatted}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Based on your configuration and data volume, we estimate your migration would take approximately {timeEstimate.formatted}.
        {selectedSourcesCount > 1 && 
          " The estimate includes a 20% overhead for coordinating migrations from multiple CRM sources."}
      </p>
      
      {timeEstimate.seconds > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Estimated records/sec: </span>
            {Math.round(totalRecords / timeEstimate.seconds)}
          </div>
          <div>
            <span className="font-medium">Selected sources: </span>
            {selectedSourcesCount}
          </div>
          <div>
            <span className="font-medium">Total records: </span>
            {totalRecords.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Concurrency factor: </span>
            {totalConcurrency}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeEstimate;
