
import React from 'react';
import { useProcessing } from '@/contexts/ProcessingContext';

const NavigationOverlay: React.FC = () => {
  const { isProcessing, processingMessage } = useProcessing();

  if (!isProcessing) return null;

  return (
    <>
      {/* Processing indicator only - no full screen overlay */}
      <div className="fixed top-4 right-4 z-[1000] bg-background border rounded-lg shadow-lg p-3 flex items-center gap-2">
        <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
        <span className="text-sm font-medium">
          {processingMessage || 'Processing...'}
        </span>
      </div>
    </>
  );
};

export default NavigationOverlay;
