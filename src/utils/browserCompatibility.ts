
/**
 * Check if the browser supports a specific CSS property or value
 */
export const supportsCSS = (property: string, value?: string): boolean => {
  if (!window || !document) return true; // SSR safety
  
  // For checking property support
  if (!value) {
    return property in document.documentElement.style;
  }
  
  // For checking property-value support
  const element = document.createElement('div');
  element.style[property as any] = value;
  return element.style[property as any] === value;
};

/**
 * Check if touch events are supported
 */
export const supportsTouchEvents = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Check if a specific browser API is available
 */
export const supportsAPI = (api: string): boolean => {
  return api in window;
};

/**
 * Apply fallback styles for older browsers
 */
export const applyCompatibilityClass = (): void => {
  const html = document.documentElement;
  
  // Add classes for graceful fallbacks
  if (!supportsCSS('position', 'sticky')) {
    html.classList.add('no-sticky');
  }
  
  if (supportsTouchEvents()) {
    html.classList.add('touch-device');
  }
  
  // Detect legacy browsers
  const isIE = /*@cc_on!@*/false || !!(document as any).documentMode;
  const isEdgeHTML = !isIE && !!(window as any).StyleMedia;
  
  if (isIE || isEdgeHTML) {
    html.classList.add('legacy-browser');
  }
};
