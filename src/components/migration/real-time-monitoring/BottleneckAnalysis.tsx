import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  Database,
  Globe,
  Server
} from "lucide-react";

interface Bottleneck {
  component: string;
  delay: number;
  reason: string;
}

interface BottleneckAnalysisProps {
  bottlenecks: Bottleneck[];
}

const BottleneckAnalysis: React.FC<BottleneckAnalysisProps> = ({ bottlenecks }) => {
  const getBottleneckIcon = (component: string) => {
    if (component.toLowerCase().includes('api')) return <Globe className="h-4 w-4" />;
    if (component.toLowerCase().includes('database')) return <Database className="h-4 w-4" />;
    if (component.toLowerCase().includes('server')) return <Server className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  const getSeverityLevel = (delay: number) => {
    if (delay > 5000) return { level: 'critical', color: 'text-red-600', bg: 'bg-red-50' };
    if (delay > 2000) return { level: 'high', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (delay > 1000) return { level: 'medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'low', color: 'text-blue-600', bg: 'bg-blue-50' };
  };

  const formatDelay = (delay: number) => {
    if (delay >= 1000) {
      return `${(delay / 1000).toFixed(1)}s`;
    }
    return `${delay}ms`;
  };

  const getOptimizationSuggestions = (component: string, delay: number) => {
    const suggestions = [];
    
    if (component.toLowerCase().includes('api')) {
      suggestions.push("Consider implementing request batching");
      suggestions.push("Check API rate limits and upgrade if needed");
      if (delay > 3000) suggestions.push("Switch to a faster API tier");
    }
    
    if (component.toLowerCase().includes('database')) {
      suggestions.push("Optimize database queries");
      suggestions.push("Consider adding database indexes");
      if (delay > 2000) suggestions.push("Scale up database resources");
    }
    
    if (component.toLowerCase().includes('network')) {
      suggestions.push("Check network connectivity");
      suggestions.push("Consider using a CDN");
      suggestions.push("Implement connection pooling");
    }

    return suggestions;
  };

  const maxDelay = Math.max(...bottlenecks.map(b => b.delay));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-amber-600" />
          Performance Bottlenecks ({bottlenecks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bottlenecks.map((bottleneck, index) => {
          const severity = getSeverityLevel(bottleneck.delay);
          const relativeDelay = (bottleneck.delay / maxDelay) * 100;
          
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${severity.bg} border-current/20`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={severity.color}>
                    {getBottleneckIcon(bottleneck.component)}
                  </div>
                  <div>
                    <h4 className="font-medium">{bottleneck.component}</h4>
                    <p className="text-sm text-muted-foreground">{bottleneck.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={severity.level === 'critical' ? 'destructive' : 'outline'}
                    className="mb-1"
                  >
                    {formatDelay(bottleneck.delay)} delay
                  </Badge>
                  <p className="text-xs text-muted-foreground capitalize">
                    {severity.level} impact
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">Relative Impact:</span>
                </div>
                <Progress 
                  value={relativeDelay} 
                  className="h-2"
                  style={{
                    backgroundColor: severity.level === 'critical' ? '#fef2f2' : '#f8fafc'
                  }}
                />
              </div>

              <div className="mt-4 space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3" />
                  Optimization Suggestions:
                </h5>
                <ul className="text-sm space-y-1">
                  {getOptimizationSuggestions(bottleneck.component, bottleneck.delay).map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}

        {bottlenecks.length === 0 && (
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-emerald-800 mb-2">
              Optimal Performance
            </h3>
            <p className="text-emerald-600">
              No performance bottlenecks detected. Your migration is running efficiently.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BottleneckAnalysis;