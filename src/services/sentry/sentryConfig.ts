import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry for error monitoring and performance tracking
 */
export const initializeSentry = () => {
  Sentry.init({
    // You'll need to replace this with your actual Sentry DSN
    dsn: process.env.NODE_ENV === 'production' 
      ? 'YOUR_SENTRY_DSN_HERE' // Replace with actual DSN
      : '', // Don't send to Sentry in development
      
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Capture environment
    environment: process.env.NODE_ENV,
    
    // Release tracking (you can set this in your build process)
    release: `quillswitch@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
    
    // Set user context
    beforeSend(event, hint) {
      // Filter out some errors in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Sentry] Would send error:', event);
        return null; // Don't actually send in development
      }
      
      // Filter out network errors that aren't actionable
      const error = hint.originalException;
      if (error instanceof Error) {
        if (error.message.includes('NetworkError') && error.message.includes('fetch')) {
          return null;
        }
      }
      
      return event;
    },
    
    // Don't log certain URLs
    ignoreErrors: [
      // Browser extensions
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      // Network errors
      'NetworkError when attempting to fetch resource',
      'Load failed',
    ],
  });
};

/**
 * Set user context for Sentry
 */
export const setSentryUser = (user: { id: string; email?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
  });
};

/**
 * Clear user context (on logout)
 */
export const clearSentryUser = () => {
  Sentry.setUser(null);
};

/**
 * Add tags to Sentry context
 */
export const setSentryTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

/**
 * Add context to Sentry
 */
export const setSentryContext = (key: string, context: Record<string, any>) => {
  Sentry.setContext(key, context);
};

/**
 * Manually capture an error
 */
export const captureError = (error: Error, context?: Record<string, any>) => {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
};

/**
 * Capture a message
 */
export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.captureMessage(message, level);
};

// Re-export Sentry for direct access when needed
export { Sentry };