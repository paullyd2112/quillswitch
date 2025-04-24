
/**
 * Calculates the similarity between two strings using the Levenshtein distance algorithm.
 * Returns a score between 0 and 1, where 1 is an exact match.
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0;
  if (str1.length === 0 || str2.length === 0) return 0.0;
  
  // Convert to lowercase for better matching
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Calculate Levenshtein distance
  const distance = levenshteinDistance(s1, s2);
  
  // Normalize score between 0 and 1
  const maxLength = Math.max(s1.length, s2.length);
  const normalizedScore = 1 - distance / maxLength;
  
  return normalizedScore;
}

/**
 * Calculates the Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return dp[m][n];
}

/**
 * Compares two strings and returns whether they represent the same concept
 */
export function areFieldsConceptuallySimilar(source: string, target: string): boolean {
  // Normalize strings
  const normalizedSource = normalizeFieldName(source);
  const normalizedTarget = normalizeFieldName(target);
  
  if (normalizedSource === normalizedTarget) return true;
  
  const similarityScore = calculateStringSimilarity(normalizedSource, normalizedTarget);
  return similarityScore >= 0.8;
}

function normalizeFieldName(name: string): string {
  let result = name.toLowerCase();
  
  // Remove common prefixes
  const prefixesToRemove = ['the_', 'a_', 'is_', 'has_'];
  for (const prefix of prefixesToRemove) {
    if (result.startsWith(prefix)) {
      result = result.slice(prefix.length);
      break;
    }
  }
  
  // Replace separators
  result = result.replace(/[_\-\s.]/g, '');
  
  // Remove common suffixes
  const suffixesToRemove = ['id', 'date', 'name', 'type'];
  for (const suffix of suffixesToRemove) {
    if (result.endsWith(suffix)) {
      result = result.slice(0, -suffix.length);
      break;
    }
  }
  
  return result;
}
