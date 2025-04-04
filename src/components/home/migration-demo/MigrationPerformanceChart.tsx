
import React, { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { MigrationHistoryPoint } from "@/hooks/migration-demo/types";
import { formatBytes } from "@/lib/utils";

type MigrationPerformanceChartProps = {
  progressHistory?: MigrationHistoryPoint[];
  height?: number;
};

const MigrationPerformanceChart = ({ 
  progressHistory = [], 
  height = 200 
}: MigrationPerformanceChartProps) => {
  // Format data for chart display
  const chartData = useMemo(() => {
    if (!progressHistory.length) return [];

    // Get initial timestamp to normalize x-axis
    const initialTimestamp = progressHistory[0]?.timestamp || 0;
    
    return progressHistory.map(point => {
      const elapsedSeconds = Math.round((point.timestamp - initialTimestamp) / 1000);
      
      return {
        time: elapsedSeconds,
        timeLabel: `${elapsedSeconds}s`,
        records: point.records,
        memory: point.memoryUsage || 0,
        network: point.networkSpeed || 0
      };
    });
  }, [progressHistory]);

  // Don't render chart if no data
  if (chartData.length < 2) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-muted/20 rounded-md">
        <p className="text-sm text-muted-foreground">Collecting data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Migration Performance</h4>
      <div className="rounded-md border p-2 bg-card/30 overflow-hidden">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="timeLabel"
              className="text-xs"
              label={{ value: 'Time (seconds)', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              yAxisId="left"
              className="text-xs"
              label={{ value: 'Records', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              className="text-xs"
              label={{ value: 'MB / KB/s', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'records') return [value.toLocaleString(), 'Records'];
                if (name === 'memory') return [value.toFixed(1), 'Memory (MB)'];
                if (name === 'network') return [value.toFixed(1), 'Network (KB/s)'];
                return [value, name];
              }}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="records"
              name="records"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="memory"
              name="memory"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="network"
              name="network"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MigrationPerformanceChart;
