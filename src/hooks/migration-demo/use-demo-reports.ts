
import { useState, useEffect } from "react";
import { MigrationHistoryPoint } from "./types";

// Generate mock historical data points for the migration performance chart
const generateMockHistoryPoints = (): MigrationHistoryPoint[] => {
  const points: MigrationHistoryPoint[] = [];
  const baseTime = Date.now() - 300000; // 5 minutes ago
  
  for (let i = 0; i < 60; i++) {
    // Create smooth curve with some randomness for realism
    const recordMultiplier = Math.min(1, (i / 30) + (Math.random() * 0.1));
    const recordsProcessed = Math.floor(12458 * recordMultiplier);
    
    // Add jitter to create realistic looking chart
    const jitter = Math.random() * 0.2 - 0.1; // -10% to +10% randomness
    
    // Memory starts at 40MB and increases with some random fluctuations
    const baseMemory = 40 + ((i / 60) * 80) + (Math.random() * 15 - 7.5);
    
    // Network speed starts low, peaks in the middle, then reduces
    const networkShape = Math.sin((i / 60) * Math.PI) * 400;
    const networkSpeed = Math.max(50, networkShape + (Math.random() * 50 - 25));
    
    points.push({
      timestamp: baseTime + (i * 5000), // 5 second intervals
      records: Math.round(recordsProcessed * (1 + jitter)),
      memoryUsage: baseMemory,
      networkSpeed: networkSpeed
    });
  }
  
  return points;
};

export const useDemoReports = () => {
  const [historyPoints, setHistoryPoints] = useState<MigrationHistoryPoint[]>([]);
  
  useEffect(() => {
    // Generate mock historical data on component mount
    setHistoryPoints(generateMockHistoryPoints());
  }, []);
  
  return {
    historyPoints
  };
};
