
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface DataQualityMetricsProps {
  metrics: {
    completeness: number;
    accuracy: number;
    uniqueness: number;
    consistency: number;
    overall: number;
  };
}

export const DataQualityMetrics: React.FC<DataQualityMetricsProps> = ({ metrics }) => {
  const getQualityColor = (value: number) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getQualityLabel = (value: number) => {
    if (value >= 90) return 'Excellent';
    if (value >= 70) return 'Good';
    if (value >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Data Quality Assessment</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="text-sm font-medium">Completeness</span>
            <p className="text-xs text-gray-500">How complete your data fields are</p>
          </div>
          <span className="text-sm font-medium">{metrics.completeness}%</span>
        </div>
        <Progress value={metrics.completeness} className="h-2" indicatorClassName={getQualityColor(metrics.completeness)} />
        
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="text-sm font-medium">Accuracy</span>
            <p className="text-xs text-gray-500">How accurate your data values are</p>
          </div>
          <span className="text-sm font-medium">{metrics.accuracy}%</span>
        </div>
        <Progress value={metrics.accuracy} className="h-2" indicatorClassName={getQualityColor(metrics.accuracy)} />
        
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="text-sm font-medium">Uniqueness</span>
            <p className="text-xs text-gray-500">How many unique records you have</p>
          </div>
          <span className="text-sm font-medium">{metrics.uniqueness}%</span>
        </div>
        <Progress value={metrics.uniqueness} className="h-2" indicatorClassName={getQualityColor(metrics.uniqueness)} />
        
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="text-sm font-medium">Consistency</span>
            <p className="text-xs text-gray-500">How consistent your data patterns are</p>
          </div>
          <span className="text-sm font-medium">{metrics.consistency}%</span>
        </div>
        <Progress value={metrics.consistency} className="h-2" indicatorClassName={getQualityColor(metrics.consistency)} />
      </div>
      
      <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium">Overall Quality Score</span>
          <div className="flex items-center">
            <span className="text-lg font-bold">{metrics.overall}%</span>
            <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-opacity-20" 
              style={{ backgroundColor: `${getQualityColor(metrics.overall)}30` }}>
              {getQualityLabel(metrics.overall)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
