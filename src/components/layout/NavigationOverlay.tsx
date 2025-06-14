
import React from 'react';
import { useProcessing } from '@/contexts/ProcessingContext';

const NavigationOverlay: React.FC = () => {
  const { isProcessing, processingMessage } = useProcessing();

  if (!isProcessing) return null;

  return (
    <>
      {/* Overlay for navigation bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-20 bg-transparent z-[150] pointer-events-auto"
        style={{ pointerEvents: isProcessing ? 'auto' : 'none' }}
        onClick={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
      />
      
      {/* Processing indicator */}
      <div className="fixed top-4 right-4 z-[200] bg-background border rounded-lg shadow-lg p-3 flex items-center gap-2">
        <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
        <span className="text-sm font-medium">
          {processingMessage || 'Processing...'}
        </span>
      </div>
    </>
  );
};

export default NavigationOverlay;
