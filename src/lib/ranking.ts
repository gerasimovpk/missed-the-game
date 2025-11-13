import { Highlight } from '@/redux/services/scorebatApi';
import { 
  isDerby, 
  getCompetitionWeight, 
  isTopCompetition,
  getMatchWeight
} from './topClubs';

// Score a highlight based on club weights and other criteria
function scoreHighlight(highlight: Highlight): number {
  let score = 0;
  
  // Primary factor: Club weights (most important)
  // This is the main differentiator - Real Madrid vs Barcelona will score much higher than Lazio vs Juventus
  const matchWeight = getMatchWeight(highlight.homeTeam, highlight.awayTeam);
  score += matchWeight * 2; // Multiply by 2 to make club weights the dominant factor
  
  // Secondary factor: Competition weight
  score += getCompetitionWeight(highlight.competition) * 1.5;
  
  // Tertiary factors: Derby bonus and high-scoring bonus
  if (isDerby(highlight.competition, highlight.homeTeam, highlight.awayTeam)) {
    score += 5; // Derby bonus
  }
  
  if (highlight.totalGoals && highlight.totalGoals >= 3) {
    score += 3; // High-scoring bonus
  }
  
  // Bonus for top competitions
  if (isTopCompetition(highlight.competition)) {
    score += 2;
  }
  
  return score;
}

// Select the featured match - highest weighted game across all competitions
export function selectFeatured(highlights: Highlight[]): Highlight | null {
  if (!highlights || highlights.length === 0) return null;
  
  // Score all highlights and select the highest scoring one
  const scored = highlights.map(h => ({
    highlight: h,
    score: scoreHighlight(h),
  }));
  
  // Sort by score (descending), then by date (most recent first)
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.highlight.dateUTC).getTime() - new Date(a.highlight.dateUTC).getTime();
  });
  
  return scored[0].highlight;
}

// Select top 5 cross-league highlights based on weighted scoring
export function selectTop5(highlights: Highlight[], excludeIds: string[] = []): Highlight[] {
  if (!highlights || highlights.length === 0) return [];
  
  // Filter out excluded highlights
  const available = highlights.filter(h => !excludeIds.includes(h.id));
  
  // Score and sort highlights by weight
  const scored = available.map(h => ({
    highlight: h,
    score: scoreHighlight(h),
  }));
  
  // Sort by score (descending), then by date (most recent first)
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.highlight.dateUTC).getTime() - new Date(a.highlight.dateUTC).getTime();
  });
  
  // Return top 5 highest weighted highlights
  return scored.slice(0, 5).map(item => item.highlight);
}

// Group highlights by competition
export function groupByCompetition(highlights: Highlight[]): Record<string, Highlight[]> {
  const grouped: Record<string, Highlight[]> = {};
  
  for (const highlight of highlights) {
    if (!grouped[highlight.competition]) {
      grouped[highlight.competition] = [];
    }
    grouped[highlight.competition].push(highlight);
  }
  
  return grouped;
}

// Sort highlights within a competition by weighted scoring
export function sortHighlightsByWeight(highlights: Highlight[]): Highlight[] {
  const scored = highlights.map(h => ({
    highlight: h,
    score: scoreHighlight(h),
  }));
  
  // Sort by score (descending), then by date (most recent first)
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.highlight.dateUTC).getTime() - new Date(a.highlight.dateUTC).getTime();
  });
  
  return scored.map(item => item.highlight);
}

// Group highlights by competition and sort each group by weight
export function groupAndSortByCompetition(highlights: Highlight[]): Record<string, Highlight[]> {
  const grouped = groupByCompetition(highlights);
  
  // Sort each competition's highlights by weight
  for (const competition in grouped) {
    grouped[competition] = sortHighlightsByWeight(grouped[competition]);
  }
  
  return grouped;
}

// Determine if a game is a "Top Game" based on weighted scoring
function isTopGameByWeight(highlight: Highlight, allHighlights: Highlight[]): boolean {
  // Calculate the score for this highlight
  const highlightScore = scoreHighlight(highlight);
  
  // Get all scores and sort them
  const allScores = allHighlights.map(h => scoreHighlight(h)).sort((a, b) => b - a);
  
  // Consider it a "Top Game" if it's in the top 20% of all games
  // or if it has a very high score (elite matchups)
  const top20PercentThreshold = Math.ceil(allHighlights.length * 0.2);
  const isInTop20Percent = allScores.indexOf(highlightScore) < top20PercentThreshold;
  
  // Also consider it a top game if it has a very high score (elite matchups)
  const isEliteMatchup = highlightScore >= 30; // Elite clubs + competition bonus
  
  return isInTop20Percent || isEliteMatchup;
}

// Mark highlights with special flags
export function enrichHighlights(highlights: Highlight[]): Highlight[] {
  return highlights.map(h => ({
    ...h,
    isTopGame: isTopGameByWeight(h, highlights),
    isHighScore: (h.totalGoals || 0) >= 3,
  }));
}
