
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProcessingContextType {
  isProcessing: boolean;
  processingMessage?: string;
  setProcessing: (processing: boolean, message?: string) => void;
  processingCount: number;
}

const ProcessingContext = createContext<ProcessingContextType | undefined>(undefined);

interface ProcessingProviderProps {
  children: ReactNode;
}

export const ProcessingProvider: React.FC<ProcessingProviderProps> = ({ children }) => {
  const [processingCount, setProcessingCount] = useState(0);
  const [processingMessage, setProcessingMessage] = useState<string>();

  const setProcessing = (processing: boolean, message?: string) => {
    setProcessingCount(prev => {
      const newCount = processing ? prev + 1 : Math.max(0, prev - 1);
      return newCount;
    });
    
    if (processing && message) {
      setProcessingMessage(message);
    } else if (!processing && processingCount <= 1) {
      setProcessingMessage(undefined);
    }
  };

  const isProcessing = processingCount > 0;

  return (
    <ProcessingContext.Provider value={{
      isProcessing,
      processingMessage,
      setProcessing,
      processingCount
    }}>
      {children}
    </ProcessingContext.Provider>
  );
};

export const useProcessing = () => {
  const context = useContext(ProcessingContext);
  if (context === undefined) {
    throw new Error('useProcessing must be used within a ProcessingProvider');
  }
  return context;
};
