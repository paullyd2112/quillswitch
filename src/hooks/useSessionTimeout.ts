import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SessionTimeoutOptions {
  warningMinutes?: number;
  timeoutMinutes?: number;
  enableWarnings?: boolean;
}

export const useSessionTimeout = (options: SessionTimeoutOptions = {}) => {
  const {
    warningMinutes = 5,
    timeoutMinutes = 30,
    enableWarnings = true
  } = options;
  
  const { user, session } = useAuth();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  // Handle session timeout
  const handleTimeout = useCallback(async () => {
    if (user) {
      toast.error('Session expired. Please sign in again.');
      await supabase.auth.signOut();
    }
  }, [user]);

  // Extend session
  const extendSession = useCallback(async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      if (!error) {
        updateActivity();
        toast.success('Session extended');
      }
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  }, [updateActivity]);

  // Set up activity listeners
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [user, updateActivity]);

  // Set up timeout checking
  useEffect(() => {
    if (!user || !enableWarnings) return;

    const checkTimeout = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      const warningThreshold = (timeoutMinutes - warningMinutes) * 60 * 1000;
      const timeoutThreshold = timeoutMinutes * 60 * 1000;

      if (timeSinceActivity >= timeoutThreshold) {
        handleTimeout();
      } else if (timeSinceActivity >= warningThreshold && !showWarning) {
        setShowWarning(true);
        toast.warning(
          `Your session will expire in ${warningMinutes} minutes due to inactivity.`,
          {
            duration: 10000,
            action: {
              label: 'Extend Session',
              onClick: extendSession
            }
          }
        );
      }
    };

    const interval = setInterval(checkTimeout, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, lastActivity, warningMinutes, timeoutMinutes, showWarning, enableWarnings, handleTimeout, extendSession]);

  // Check for token expiration
  useEffect(() => {
    if (!session) return;

    const checkTokenExpiry = () => {
      const expiresAt = session.expires_at;
      if (expiresAt) {
        const expiryTime = expiresAt * 1000; // Convert to milliseconds
        const now = Date.now();
        const timeUntilExpiry = expiryTime - now;
        
        // Warn 5 minutes before expiry
        if (timeUntilExpiry <= 5 * 60 * 1000 && timeUntilExpiry > 0) {
          toast.warning('Your session token will expire soon. Activity will refresh it automatically.');
        }
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [session]);

  return {
    updateActivity,
    extendSession,
    showWarning,
    timeUntilWarning: Math.max(0, (timeoutMinutes - warningMinutes) * 60 * 1000 - (Date.now() - lastActivity)),
    timeUntilTimeout: Math.max(0, timeoutMinutes * 60 * 1000 - (Date.now() - lastActivity))
  };
};