
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber, formatPercentage, formatStatus, getStatusColor } from '@/utils/formatters';

interface DataDisplayProps {
  label: string;
  value: string | number | null | undefined;
  type?: 'text' | 'number' | 'percentage' | 'status' | 'badge';
  status?: string;
  className?: string;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'inline';
}

const DataDisplay: React.FC<DataDisplayProps> = ({
  label,
  value,
  type = 'text',
  status,
  className,
  loading = false,
  size = 'md',
  variant = 'default'
}) => {
  if (loading) {
    return (
      <div className={cn('space-y-2', className)}>
        <Skeleton className="h-4 w-16" />
        <Skeleton className={cn(
          'h-6',
          size === 'sm' && 'h-5',
          size === 'lg' && 'h-8'
        )} />
      </div>
    );
  }

  const formatValue = () => {
    if (value === null || value === undefined) return 'N/A';

    switch (type) {
      case 'number':
        return typeof value === 'number' ? formatNumber(value) : value;
      case 'percentage':
        return typeof value === 'number' ? formatPercentage(value) : value;
      case 'status':
        return formatStatus(String(value));
      default:
        return String(value);
    }
  };

  const getValueColor = () => {
    if (type === 'status' || status) {
      return getStatusColor(status || String(value));
    }
    return 'text-foreground';
  };

  const formattedValue = formatValue();

  if (variant === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-2', className)}>
        <span className="text-muted-foreground text-sm">{label}:</span>
        {type === 'badge' ? (
          <Badge variant="outline" className={getValueColor()}>
            {formattedValue}
          </Badge>
        ) : (
          <span className={cn(
            'font-medium',
            getValueColor(),
            size === 'sm' && 'text-sm',
            size === 'lg' && 'text-lg'
          )}>
            {formattedValue}
          </span>
        )}
      </span>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        'p-4 rounded-lg border bg-card',
        className
      )}>
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        {type === 'badge' ? (
          <Badge variant="outline" className={getValueColor()}>
            {formattedValue}
          </Badge>
        ) : (
          <div className={cn(
            'font-semibold',
            getValueColor(),
            size === 'sm' && 'text-lg',
            size === 'md' && 'text-xl',
            size === 'lg' && 'text-2xl'
          )}>
            {formattedValue}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="text-sm text-muted-foreground">{label}</div>
      {type === 'badge' ? (
        <Badge variant="outline" className={getValueColor()}>
          {formattedValue}
        </Badge>
      ) : (
        <div className={cn(
          'font-medium',
          getValueColor(),
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg'
        )}>
          {formattedValue}
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
