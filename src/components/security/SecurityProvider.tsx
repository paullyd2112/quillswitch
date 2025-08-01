import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSecurityMiddleware } from '@/hooks/useSecurityMiddleware';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SecurityHeaders from './SecurityHeaders';

interface SecurityContextType {
  checkFormRateLimit: (formType?: string) => Promise<boolean>;
  validateSecureInput: (input: unknown, fieldType: any, fieldName: string) => any;
  sanitizeContent: (content: string) => string;
  extendSession: () => Promise<void>;
  timeUntilWarning: number;
  timeUntilTimeout: number;
  showWarning: boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const { toast } = useToast();
  const securityMiddleware = useSecurityMiddleware();
  
  const sessionTimeout = useSessionTimeout({
    timeoutMinutes: 30,
    warningMinutes: 5,
    enableWarnings: true
  });

  // Monitor auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        sessionTimeout.updateActivity();
      }
    });

    return () => subscription.unsubscribe();
  }, [sessionTimeout]);

  return (
    <SecurityContext.Provider 
      value={{
        ...securityMiddleware,
        extendSession: sessionTimeout.extendSession,
        timeUntilWarning: sessionTimeout.timeUntilWarning,
        timeUntilTimeout: sessionTimeout.timeUntilTimeout,
        showWarning: sessionTimeout.showWarning
      }}
    >
      <SecurityHeaders />
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}