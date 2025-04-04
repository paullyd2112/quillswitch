
/**
 * Utilities for calculating string similarity
 */

/**
 * Calculate Levenshtein distance between two strings
 * Used to determine how similar two strings are
 */
export const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[b.length][a.length];
};

/**
 * Calculate similarity score between two strings (0-1)
 * 1 = identical, 0 = completely different
 */
export const calculateStringSimilarity = (a: string, b: string): number => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase());
  return (maxLength - distance) / maxLength;
};
