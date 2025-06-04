import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { ProductionMigrationConfig } from '@/services/migration/optimization';

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  recommendations: string[];
}

interface ProductionConfigValidatorProps {
  config: ProductionMigrationConfig;
  estimatedRecordCount?: number;
}

const ProductionConfigValidator: React.FC<ProductionConfigValidatorProps> = ({
  config,
  estimatedRecordCount = 0
}) => {
  const validateConfiguration = (): ValidationResult => {
    const warnings: string[] = [];
    const errors: string[] = [];
    const recommendations: string[] = [];

    // Validate bloom filter configuration
    if (config.enableSmartDelta && config.optimization.enableBloomFilter) {
      if (config.optimization.bloomFilterSize < estimatedRecordCount) {
        warnings.push(`Bloom filter size (${config.optimization.bloomFilterSize.toLocaleString()}) is smaller than estimated record count (${estimatedRecordCount.toLocaleString()}). This may increase false positive rate.`);
      }
      
      if (config.optimization.hashFunctions < 2 || config.optimization.hashFunctions > 5) {
        warnings.push('Hash functions should typically be between 2-5 for optimal performance');
      }
    }

    // Validate concurrency settings
    if (config.concurrency.maxWorkers > 20) {
      warnings.push('High worker count may overwhelm the destination API. Consider rate limiting.');
    }

    if (config.concurrency.maxWorkers < 2 && estimatedRecordCount > 1000) {
      recommendations.push('Consider increasing worker count for better performance with large datasets');
    }

    // Validate streaming configuration
    if (config.enableStreaming) {
      if (config.streaming.chunkSize > 1000) {
        warnings.push('Large chunk sizes may cause memory issues or API timeouts');
      }
      
      if (config.streaming.chunkSize < 10 && estimatedRecordCount > 10000) {
        recommendations.push('Consider larger chunk sizes for better performance with large datasets');
      }
    }

    // Validate safety level vs performance trade-offs
    if (config.optimization.safetyLevel === 'aggressive' && estimatedRecordCount > 50000) {
      warnings.push('Aggressive safety level with large datasets may skip legitimate records');
    }

    if (config.optimization.safetyLevel === 'conservative' && estimatedRecordCount > 100000) {
      recommendations.push('Conservative safety level may impact performance with very large datasets');
    }

    // Check for conflicting settings
    if (!config.enableSmartDelta && config.enableSchemaCache) {
      recommendations.push('Schema caching is most effective when combined with smart delta detection');
    }

    // Validate timeout settings
    if (config.concurrency.timeoutMs < 10000) {
      warnings.push('Short timeout may cause failures with slow API responses');
    }

    if (config.concurrency.timeoutMs > 120000) {
      recommendations.push('Long timeout may mask performance issues');
    }

    // Performance recommendations based on record count
    if (estimatedRecordCount > 100000) {
      if (!config.enableStreaming) {
        recommendations.push('Enable streaming for optimal performance with large datasets');
      }
      if (!config.enableAdvancedConcurrency) {
        recommendations.push('Enable advanced concurrency for better throughput');
      }
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
      recommendations
    };
  };

  const validation = validateConfiguration();

  const getOverallStatus = () => {
    if (!validation.isValid) return { icon: XCircle, color: 'text-red-500', label: 'Invalid' };
    if (validation.warnings.length > 0) return { icon: AlertTriangle, color: 'text-yellow-500', label: 'Warnings' };
    return { icon: CheckCircle, color: 'text-green-500', label: 'Valid' };
  };

  const status = getOverallStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <status.icon className={`h-5 w-5 ${status.color}`} />
            Configuration Validation
          </CardTitle>
          <Badge variant={validation.isValid ? 'default' : 'destructive'}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Configuration Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium">Optimizations</div>
            <div className="text-muted-foreground">
              {[
                config.enableSchemaCache && 'Schema Cache',
                config.enableSmartDelta && 'Smart Delta',
                config.enableStreaming && 'Streaming',
                config.enableAdvancedConcurrency && 'Concurrency'
              ].filter(Boolean).length}/4 enabled
            </div>
          </div>
          
          <div>
            <div className="font-medium">Safety Level</div>
            <div className="text-muted-foreground capitalize">
              {config.optimization.safetyLevel}
            </div>
          </div>
          
          <div>
            <div className="font-medium">Max Workers</div>
            <div className="text-muted-foreground">
              {config.concurrency.maxWorkers}
            </div>
          </div>
          
          <div>
            <div className="font-medium">Chunk Size</div>
            <div className="text-muted-foreground">
              {config.streaming.chunkSize}
            </div>
          </div>
        </div>

        {/* Errors */}
        {validation.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-600 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Configuration Errors
            </h4>
            {validation.errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Warnings */}
        {validation.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-yellow-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Warnings
            </h4>
            {validation.warnings.map((warning, index) => (
              <Alert key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{warning}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {validation.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-blue-600 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Recommendations
            </h4>
            {validation.recommendations.map((recommendation, index) => (
              <Alert key={index} className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <Info className="h-4 w-4" />
                <AlertDescription>{recommendation}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* All good message */}
        {validation.isValid && validation.warnings.length === 0 && validation.recommendations.length === 0 && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Configuration is optimal for your migration requirements.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductionConfigValidator;
