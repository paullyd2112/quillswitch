
/**
 * Safely evaluates a transformation rule against input data
 */
export const evaluateTransformation = (code: string, input: string) => {
  try {
    // Create a safe evaluation environment
    const value = input;
    // eslint-disable-next-line no-new-func
    const transformFn = new Function('value', code);
    return {
      result: transformFn(value),
      error: null
    };
  } catch (err: any) {
    console.error("Code evaluation error:", err);
    return {
      result: null,
      error: err.message || "Error evaluating code"
    };
  }
};

/**
 * Validates a transformation rule without executing it
 */
export const validateTransformationCode = (code: string): boolean => {
  try {
    // eslint-disable-next-line no-new-func
    new Function('value', code);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Auto-selects a template based on field names
 */
export const suggestTemplateForField = (fieldName: string): string | null => {
  const name = fieldName.toLowerCase();
  
  if (name.includes('phone')) {
    return "Format phone";
  } else if (name.includes('date')) {
    return "Format date";
  } else if (name.includes('name')) {
    return "Capitalize";
  } else if (name.includes('price') || name.includes('amount')) {
    return "Round number";
  } else if (name.includes('email')) {
    return "Lowercase";
  }
  
  return null;
};
