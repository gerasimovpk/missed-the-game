// Score masking utility for spoiler protection
export const SCORE_PATTERNS = [
  // Basic score formats
  /\b\d{1,2}\s?[-:]\s?\d{1,2}\b/gi,           // 2-1, 2:1
  /\b\d{1,2}\s*[-:]\s*\d{1,2}\b/gi,           // 2 - 1
  /\b\d{1,2}\s*to\s*\d{1,2}\b/gi,             // 2 to 1
  /\b\d{1,2}\s+vs\s+\d{1,2}\b/gi,             // 0 vs 3
  
  // Scores in brackets/parentheses
  /\[\d{1,2}[-:]\d{1,2}\]/gi,                 // [2-1]
  /\(\d{1,2}[-:]\d{1,2}\)/gi,                 // (2-1)
  
  // Aggregate scores
  /\b\d{1,2}\s*\(\d{1,2}\)/gi,                // 1 (2)
  /\b\d{1,2}\s*\[\d{1,2}\]/gi,                // 1 [2]
  
  // Single numbers in brackets/parentheses
  /\(\d{1,2}\)/gi,                             // (2)
  /\[\d{1,2}\]/gi,                            // [2]
  
  // Additional tokens to mask
  /\b(pen|pens|agg|aggregate|et|aet|so)\b/gi, // penalty, aggregate, extra time, shootout
] as const;

export function maskScores(text: string): string {
  if (!text) return text;
  
  let masked = text;
  
  // Apply all patterns
  SCORE_PATTERNS.forEach((pattern) => {
    masked = masked.replace(pattern, '⚽⚽');
  });
  
  return masked;
}

export function isScoreInText(text: string): boolean {
  if (!text) return false;
  
  return SCORE_PATTERNS.some(pattern => pattern.test(text));
}

export function extractScoreFromText(text: string): string | null {
  if (!text) return null;
  
  for (const pattern of SCORE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return null;
}
