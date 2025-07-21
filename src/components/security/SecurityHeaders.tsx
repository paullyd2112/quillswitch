
import React, { useEffect } from 'react';
import { securityHeaders } from '@/utils/security';

/**
 * Component to apply security headers via meta tags and script policies
 * Updated to support OAuth flows
 */
const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // Apply Content Security Policy with OAuth support
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = securityHeaders['Content-Security-Policy'];
    document.head.appendChild(cspMeta);

    // Apply X-Frame-Options as SAMEORIGIN to allow OAuth popups
    const frameOptionsMeta = document.createElement('meta');
    frameOptionsMeta.httpEquiv = 'X-Frame-Options';
    frameOptionsMeta.content = securityHeaders['X-Frame-Options'];
    document.head.appendChild(frameOptionsMeta);

    const contentTypeMeta = document.createElement('meta');
    contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
    contentTypeMeta.content = securityHeaders['X-Content-Type-Options'];
    document.head.appendChild(contentTypeMeta);

    // Set referrer policy
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrerMeta);

    console.log('Security headers applied with OAuth support');

    return () => {
      // Cleanup on unmount
      try {
        document.head.removeChild(cspMeta);
        document.head.removeChild(frameOptionsMeta);
        document.head.removeChild(contentTypeMeta);
        document.head.removeChild(referrerMeta);
      } catch (error) {
        // Headers might have already been removed
        console.log('Header cleanup completed');
      }
    };
  }, []);

  return null;
};

export default SecurityHeaders;
