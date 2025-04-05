
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  isRunning: boolean;
  progress: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ isRunning, progress }) => {
  if (!isRunning) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Test Progress</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
};

export default ProgressIndicator;
