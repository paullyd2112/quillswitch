import React, { useEffect } from 'react';
import { securityHeaders } from '@/utils/securityUtils';

/**
 * Component to apply security headers via meta tags and script policies
 */
const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // Apply Content Security Policy
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = securityHeaders['Content-Security-Policy'];
    document.head.appendChild(cspMeta);

    // Apply other security headers via meta tags where possible
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

    return () => {
      // Cleanup on unmount
      document.head.removeChild(cspMeta);
      document.head.removeChild(frameOptionsMeta);
      document.head.removeChild(contentTypeMeta);
      document.head.removeChild(referrerMeta);
    };
  }, []);

  return null;
};

export default SecurityHeaders;