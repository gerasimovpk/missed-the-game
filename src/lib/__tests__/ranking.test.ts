import { describe, it, expect } from 'vitest';
import { 
  selectFeatured, 
  selectTop5, 
  sortHighlightsByWeight,
  groupAndSortByCompetition,
  enrichHighlights
} from '../ranking';
import { getClubWeight, getMatchWeight } from '../topClubs';
import { Highlight } from '@/redux/services/scorebatApi';

// Mock highlights for testing
const createMockHighlight = (
  id: string,
  homeTeam: string,
  awayTeam: string,
  competition: string,
  totalGoals?: number,
  dateUTC: string = '2024-01-15T15:00:00Z'
): Highlight => ({
  id,
  homeTeam,
  awayTeam,
  competition,
  totalGoals,
  dateUTC,
  title: `${homeTeam} vs ${awayTeam}`,
  embedCode: '',
  matchviewUrl: '',
  thumbnailUrl: '',
  description: '',
  duration: 0,
  isTopGame: false,
  isHighScore: false,
});

describe('Club Weight System', () => {
  it('should return correct weights for elite clubs', () => {
    expect(getClubWeight('Real Madrid')).toBe(10);
    expect(getClubWeight('Barcelona')).toBe(10);
    expect(getClubWeight('Manchester City')).toBe(10);
    expect(getClubWeight('Bayern Munich')).toBe(10);
    expect(getClubWeight('Paris Saint-Germain')).toBe(10);
  });

  it('should return correct weights for top clubs', () => {
    expect(getClubWeight('Liverpool')).toBe(8);
    expect(getClubWeight('Arsenal')).toBe(8);
    expect(getClubWeight('Chelsea')).toBe(8);
    expect(getClubWeight('Juventus')).toBe(8);
    expect(getClubWeight('AC Milan')).toBe(8);
  });

  it('should return correct weights for strong clubs', () => {
    expect(getClubWeight('Borussia Dortmund')).toBe(6);
    expect(getClubWeight('Napoli')).toBe(6);
    expect(getClubWeight('Roma')).toBe(6);
    expect(getClubWeight('Sevilla')).toBe(6);
  });

  it('should return correct weights for good clubs', () => {
    expect(getClubWeight('Lazio')).toBe(4);
    expect(getClubWeight('Tottenham')).toBe(4);
    expect(getClubWeight('Newcastle United')).toBe(4);
  });

  it('should return 0 for unknown clubs', () => {
    expect(getClubWeight('Unknown Club')).toBe(0);
    expect(getClubWeight('')).toBe(0);
  });

  it('should calculate match weights correctly', () => {
    // Elite vs Elite = 20
    expect(getMatchWeight('Real Madrid', 'Barcelona')).toBe(20);
    
    // Elite vs Top = 18
    expect(getMatchWeight('Real Madrid', 'Liverpool')).toBe(18);
    
    // Top vs Top = 16
    expect(getMatchWeight('Liverpool', 'Arsenal')).toBe(16);
    
    // Good vs Good = 8
    expect(getMatchWeight('Lazio', 'Juventus')).toBe(12); // Lazio(4) + Juventus(8)
    
    // Unknown vs Unknown = 0
    expect(getMatchWeight('Unknown Club 1', 'Unknown Club 2')).toBe(0);
  });
});

describe('Featured Game Selection', () => {
  it('should select Real Madrid vs Barcelona over Lazio vs Juventus', () => {
    const highlights = [
      createMockHighlight('1', 'Lazio', 'Juventus', 'ITALY: Serie A'),
      createMockHighlight('2', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga'),
      createMockHighlight('3', 'Arsenal', 'Chelsea', 'ENGLAND: Premier League'),
    ];

    const featured = selectFeatured(highlights);
    expect(featured?.id).toBe('2'); // Real Madrid vs Barcelona should be selected
    expect(featured?.homeTeam).toBe('Real Madrid');
    expect(featured?.awayTeam).toBe('Barcelona');
  });

  it('should prioritize Ajax vs PSV over smaller Dutch clubs', () => {
    const highlights = [
      createMockHighlight('1', 'FC Twente', 'FC Utrecht', 'NETHERLANDS: Eredivisie'),
      createMockHighlight('2', 'Ajax', 'PSV', 'NETHERLANDS: Eredivisie'),
      createMockHighlight('3', 'Vitesse', 'Heerenveen', 'NETHERLANDS: Eredivisie'),
    ];

    const featured = selectFeatured(highlights);
    expect(featured?.id).toBe('2'); // Ajax vs PSV should be selected
    expect(featured?.homeTeam).toBe('Ajax');
    expect(featured?.awayTeam).toBe('PSV');
  });

  it('should prioritize derby matches with high club weights', () => {
    const highlights = [
      createMockHighlight('1', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga'), // Weight: 20
      createMockHighlight('2', 'Arsenal', 'Chelsea', 'ENGLAND: Premier League'), // Weight: 16
      createMockHighlight('3', 'Liverpool', 'Manchester City', 'ENGLAND: Premier League'), // Weight: 18
    ];

    const featured = selectFeatured(highlights);
    expect(featured?.id).toBe('1'); // Real Madrid vs Barcelona should be selected
  });

  it('should consider competition weight in selection', () => {
    const highlights = [
      createMockHighlight('1', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga'), // Weight: 20 + competition bonus
      createMockHighlight('2', 'Real Madrid', 'Barcelona', 'UEFA: Champions League'), // Weight: 20 + higher competition bonus
    ];

    const featured = selectFeatured(highlights);
    expect(featured?.competition).toBe('UEFA: Champions League');
  });

  it('should handle high-scoring matches', () => {
    const highlights = [
      createMockHighlight('1', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga', 1), // Low scoring
      createMockHighlight('2', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga', 4), // High scoring
    ];

    const featured = selectFeatured(highlights);
    expect(featured?.totalGoals).toBe(4);
  });

  it('should return null for empty highlights', () => {
    const featured = selectFeatured([]);
    expect(featured).toBeNull();
  });
});

describe('Top 5 Selection', () => {
  it('should select top 5 highest weighted games', () => {
    const highlights = [
      createMockHighlight('1', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga'), // Weight: 20
      createMockHighlight('2', 'Liverpool', 'Manchester City', 'ENGLAND: Premier League'), // Weight: 18
      createMockHighlight('3', 'Arsenal', 'Chelsea', 'ENGLAND: Premier League'), // Weight: 16
      createMockHighlight('4', 'Bayern Munich', 'Borussia Dortmund', 'GERMANY: Bundesliga'), // Weight: 16
      createMockHighlight('5', 'Juventus', 'AC Milan', 'ITALY: Serie A'), // Weight: 16
      createMockHighlight('6', 'Lazio', 'Napoli', 'ITALY: Serie A'), // Weight: 10
      createMockHighlight('7', 'Sevilla', 'Valencia', 'SPAIN: La Liga'), // Weight: 8
    ];

    const top5 = selectTop5(highlights);
    expect(top5).toHaveLength(5);
    
    // Should be sorted by weight
    expect(top5[0].id).toBe('1'); // Real Madrid vs Barcelona
    expect(top5[1].id).toBe('2'); // Liverpool vs Manchester City
  });

  it('should exclude featured game from top 5', () => {
    const highlights = [
      createMockHighlight('1', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga'),
      createMockHighlight('2', 'Liverpool', 'Manchester City', 'ENGLAND: Premier League'),
      createMockHighlight('3', 'Arsenal', 'Chelsea', 'ENGLAND: Premier League'),
    ];

    const top5 = selectTop5(highlights, ['1']); // Exclude Real Madrid vs Barcelona
    expect(top5).toHaveLength(2);
    expect(top5[0].id).toBe('2'); // Liverpool vs Manchester City should be first
    expect(top5[1].id).toBe('3'); // Arsenal vs Chelsea should be second
  });

  it('should return empty array for empty highlights', () => {
    const top5 = selectTop5([]);
    expect(top5).toHaveLength(0);
  });
});

describe('League Sorting', () => {
  it('should sort highlights within a competition by weight', () => {
    const highlights = [
      createMockHighlight('1', 'Lazio', 'Napoli', 'ITALY: Serie A'), // Weight: 10
      createMockHighlight('2', 'Juventus', 'AC Milan', 'ITALY: Serie A'), // Weight: 16
      createMockHighlight('3', 'Roma', 'Inter Milan', 'ITALY: Serie A'), // Weight: 14
    ];

    const sorted = sortHighlightsByWeight(highlights);
    expect(sorted[0].id).toBe('2'); // Juventus vs AC Milan (highest weight)
    expect(sorted[1].id).toBe('3'); // Roma vs Inter Milan
    expect(sorted[2].id).toBe('1'); // Lazio vs Napoli (lowest weight)
  });

  it('should group and sort highlights by competition', () => {
    const highlights = [
      createMockHighlight('1', 'Lazio', 'Napoli', 'ITALY: Serie A'),
      createMockHighlight('2', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga'),
      createMockHighlight('3', 'Juventus', 'AC Milan', 'ITALY: Serie A'),
      createMockHighlight('4', 'Arsenal', 'Chelsea', 'ENGLAND: Premier League'),
    ];

    const grouped = groupAndSortByCompetition(highlights);
    
    // Each competition should be sorted by weight
    expect(grouped['ITALY: Serie A'][0].id).toBe('3'); // Juventus vs AC Milan first
    expect(grouped['ITALY: Serie A'][1].id).toBe('1'); // Lazio vs Napoli second
    
    expect(grouped['SPAIN: La Liga'][0].id).toBe('2'); // Real Madrid vs Barcelona
    
    expect(grouped['ENGLAND: Premier League'][0].id).toBe('4'); // Arsenal vs Chelsea
  });

  it('should handle ties by sorting by date (most recent first)', () => {
    const highlights = [
      createMockHighlight('1', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga', undefined, '2024-01-15T15:00:00Z'),
      createMockHighlight('2', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga', undefined, '2024-01-16T15:00:00Z'),
    ];

    const sorted = sortHighlightsByWeight(highlights);
    expect(sorted[0].id).toBe('2'); // More recent should be first
    });
  });

describe('Edge Cases', () => {
  it('should handle highlights with unknown teams', () => {
    const highlights = [
      createMockHighlight('1', 'Unknown Team 1', 'Unknown Team 2', 'UNKNOWN: League'),
      createMockHighlight('2', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga'),
    ];

    const featured = selectFeatured(highlights);
    expect(featured?.id).toBe('2'); // Should still select known teams
  });

  it('should handle highlights with missing data', () => {
    const highlights = [
      createMockHighlight('1', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga'),
      createMockHighlight('2', '', '', ''), // Empty teams
    ];

    const featured = selectFeatured(highlights);
    expect(featured?.id).toBe('1'); // Should select valid highlight
  });

  it('should handle single highlight', () => {
    const highlights = [
      createMockHighlight('1', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga'),
    ];

    const featured = selectFeatured(highlights);
    expect(featured?.id).toBe('1');
    
    const top5 = selectTop5(highlights);
    expect(top5).toHaveLength(1);
    expect(top5[0].id).toBe('1');
  });
});

describe('Top Game Badge Logic', () => {
  it('should mark elite matchups as Top Games', () => {
    const highlights = [
      createMockHighlight('1', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga'), // Elite vs Elite
      createMockHighlight('2', 'FC Twente', 'FC Utrecht', 'NETHERLANDS: Eredivisie'), // Small clubs
    ];

    const enriched = enrichHighlights(highlights);
    
    expect(enriched[0].isTopGame).toBe(true); // Real Madrid vs Barcelona should be Top Game
    expect(enriched[1].isTopGame).toBe(false); // FC Twente vs FC Utrecht should not be Top Game
  });

  it('should mark top 20% of games as Top Games', () => {
    const highlights = [
      createMockHighlight('1', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga'), // Highest weight
      createMockHighlight('2', 'Liverpool', 'Arsenal', 'ENGLAND: Premier League'), // High weight
      createMockHighlight('3', 'Ajax', 'PSV', 'NETHERLANDS: Eredivisie'), // Medium weight
      createMockHighlight('4', 'FC Twente', 'FC Utrecht', 'NETHERLANDS: Eredivisie'), // Low weight
      createMockHighlight('5', 'Unknown Team 1', 'Unknown Team 2', 'UNKNOWN: League'), // Lowest weight
    ];

    const enriched = enrichHighlights(highlights);
    
    // Top 20% of 5 games = top 1 game, but elite matchups should also be included
    expect(enriched[0].isTopGame).toBe(true); // Real Madrid vs Barcelona
    expect(enriched[1].isTopGame).toBe(true); // Liverpool vs Arsenal (high weight)
    expect(enriched[2].isTopGame).toBe(true); // Ajax vs PSV (high weight)
    expect(enriched[3].isTopGame).toBe(false); // FC Twente vs FC Utrecht
    expect(enriched[4].isTopGame).toBe(false); // Unknown teams
  });

  it('should mark high-scoring games appropriately', () => {
    const highlights = [
      createMockHighlight('1', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga', 4), // High scoring
      createMockHighlight('2', 'Real Madrid', 'Barcelona', 'SPAIN: La Liga', 1), // Low scoring
    ];

    const enriched = enrichHighlights(highlights);
    
    expect(enriched[0].isHighScore).toBe(true); // 4 goals
    expect(enriched[1].isHighScore).toBe(false); // 1 goal
  });
});