import { describe, it, expect } from 'vitest';
import { 
  getClubWeight, 
  getMatchWeight, 
  isDerby, 
  getCompetitionWeight,
  isTopCompetition,
  CLUB_WEIGHTS,
  COMPETITION_WEIGHTS
} from '../topClubs';

describe('Club Weight System', () => {
  describe('getClubWeight', () => {
    it('should return correct weights for elite clubs (Tier 1)', () => {
      expect(getClubWeight('Real Madrid')).toBe(10);
      expect(getClubWeight('Barcelona')).toBe(10);
      expect(getClubWeight('Manchester City')).toBe(10);
      expect(getClubWeight('Bayern Munich')).toBe(10);
      expect(getClubWeight('Paris Saint-Germain')).toBe(10);
    });

    it('should return correct weights for top clubs (Tier 2)', () => {
      expect(getClubWeight('Liverpool')).toBe(8);
      expect(getClubWeight('Arsenal')).toBe(8);
      expect(getClubWeight('Chelsea')).toBe(8);
      expect(getClubWeight('Manchester United')).toBe(8);
      expect(getClubWeight('Juventus')).toBe(8);
      expect(getClubWeight('AC Milan')).toBe(8);
      expect(getClubWeight('Inter Milan')).toBe(8);
      expect(getClubWeight('Atletico Madrid')).toBe(8);
    });

    it('should return correct weights for strong clubs (Tier 3)', () => {
      expect(getClubWeight('Borussia Dortmund')).toBe(6);
      expect(getClubWeight('Napoli')).toBe(6);
      expect(getClubWeight('Roma')).toBe(6);
      expect(getClubWeight('Sevilla')).toBe(6);
      expect(getClubWeight('RB Leipzig')).toBe(6);
      expect(getClubWeight('Bayer Leverkusen')).toBe(6);
      expect(getClubWeight('Marseille')).toBe(6);
      expect(getClubWeight('Monaco')).toBe(6);
      expect(getClubWeight('Ajax')).toBe(6);
      expect(getClubWeight('PSV')).toBe(6);
    });

    it('should return correct weights for good clubs (Tier 4)', () => {
      expect(getClubWeight('Lazio')).toBe(4);
      expect(getClubWeight('Tottenham')).toBe(4);
      expect(getClubWeight('Newcastle United')).toBe(4);
      expect(getClubWeight('Brighton')).toBe(4);
      expect(getClubWeight('Aston Villa')).toBe(4);
      expect(getClubWeight('West Ham')).toBe(4);
      expect(getClubWeight('Valencia')).toBe(4);
      expect(getClubWeight('Real Sociedad')).toBe(4);
      expect(getClubWeight('Feyenoord')).toBe(4);
      expect(getClubWeight('AZ Alkmaar')).toBe(4);
    });

    it('should return correct weights for decent clubs (Tier 5)', () => {
      expect(getClubWeight('Crystal Palace')).toBe(2);
      expect(getClubWeight('Fulham')).toBe(2);
      expect(getClubWeight('Brentford')).toBe(2);
      expect(getClubWeight('Wolves')).toBe(2);
      expect(getClubWeight('Everton')).toBe(2);
      expect(getClubWeight('FC Twente')).toBe(2);
      expect(getClubWeight('FC Utrecht')).toBe(2);
      expect(getClubWeight('Vitesse')).toBe(2);
      expect(getClubWeight('Heerenveen')).toBe(2);
    });

    it('should return 0 for unknown clubs', () => {
      expect(getClubWeight('Unknown Club')).toBe(0);
      expect(getClubWeight('')).toBe(0);
      expect(getClubWeight('Non-existent Team')).toBe(0);
    });

    it('should handle case sensitivity', () => {
      expect(getClubWeight('real madrid')).toBe(0); // Should be case sensitive
      expect(getClubWeight('REAL MADRID')).toBe(0); // Should be case sensitive
      expect(getClubWeight('Real Madrid')).toBe(10); // Correct case
    });
  });

  describe('getMatchWeight', () => {
    it('should calculate match weights correctly for elite vs elite', () => {
      expect(getMatchWeight('Real Madrid', 'Barcelona')).toBe(20); // 10 + 10
      expect(getMatchWeight('Manchester City', 'Bayern Munich')).toBe(20); // 10 + 10
    });

    it('should calculate match weights correctly for elite vs top', () => {
      expect(getMatchWeight('Real Madrid', 'Liverpool')).toBe(18); // 10 + 8
      expect(getMatchWeight('Barcelona', 'Arsenal')).toBe(18); // 10 + 8
    });

    it('should calculate match weights correctly for top vs top', () => {
      expect(getMatchWeight('Liverpool', 'Arsenal')).toBe(16); // 8 + 8
      expect(getMatchWeight('Chelsea', 'Manchester United')).toBe(16); // 8 + 8
    });

    it('should calculate match weights correctly for mixed tiers', () => {
      expect(getMatchWeight('Real Madrid', 'Lazio')).toBe(14); // 10 + 4
      expect(getMatchWeight('Liverpool', 'Napoli')).toBe(14); // 8 + 6
      expect(getMatchWeight('Arsenal', 'Crystal Palace')).toBe(10); // 8 + 2
    });

    it('should handle unknown teams', () => {
      expect(getMatchWeight('Unknown Team 1', 'Unknown Team 2')).toBe(0); // 0 + 0
      expect(getMatchWeight('Real Madrid', 'Unknown Team')).toBe(10); // 10 + 0
    });

    it('should be commutative', () => {
      expect(getMatchWeight('Real Madrid', 'Barcelona')).toBe(getMatchWeight('Barcelona', 'Real Madrid'));
      expect(getMatchWeight('Liverpool', 'Arsenal')).toBe(getMatchWeight('Arsenal', 'Liverpool'));
    });
  });

  describe('isDerby', () => {
    it('should identify derbies in Premier League', () => {
      expect(isDerby('ENGLAND: Premier League', 'Arsenal', 'Chelsea')).toBe(true);
      expect(isDerby('ENGLAND: Premier League', 'Liverpool', 'Manchester City')).toBe(true);
      expect(isDerby('ENGLAND: Premier League', 'Manchester United', 'Arsenal')).toBe(true);
    });

    it('should identify derbies in La Liga', () => {
      expect(isDerby('SPAIN: La Liga', 'Real Madrid', 'Barcelona')).toBe(true);
      expect(isDerby('SPAIN: La Liga', 'Real Madrid', 'Atletico Madrid')).toBe(true);
    });

    it('should identify derbies in Serie A', () => {
      expect(isDerby('ITALY: Serie A', 'AC Milan', 'Inter Milan')).toBe(true);
      expect(isDerby('ITALY: Serie A', 'Juventus', 'AC Milan')).toBe(true);
      expect(isDerby('ITALY: Serie A', 'Juventus', 'Inter Milan')).toBe(true);
    });

    it('should identify derbies in Champions League', () => {
      expect(isDerby('UEFA: Champions League', 'Real Madrid', 'Barcelona')).toBe(true);
      expect(isDerby('UEFA: Champions League', 'AC Milan', 'Inter Milan')).toBe(true);
      expect(isDerby('UEFA: Champions League', 'Arsenal', 'Chelsea')).toBe(true);
    });

    it('should identify derbies in Eredivisie', () => {
      expect(isDerby('NETHERLANDS: Eredivisie', 'Ajax', 'PSV')).toBe(true);
      expect(isDerby('NETHERLANDS: Eredivisie', 'Ajax', 'Feyenoord')).toBe(true);
      expect(isDerby('NETHERLANDS: Eredivisie', 'PSV', 'Feyenoord')).toBe(true);
      expect(isDerby('NETHERLANDS: Eredivisie', 'Ajax', 'AZ Alkmaar')).toBe(true);
    });

    it('should not identify non-derbies', () => {
      expect(isDerby('ENGLAND: Premier League', 'Arsenal', 'Crystal Palace')).toBe(false);
      expect(isDerby('SPAIN: La Liga', 'Real Madrid', 'Sevilla')).toBe(false);
      expect(isDerby('ITALY: Serie A', 'Juventus', 'Lazio')).toBe(false);
    });

    it('should return false for unknown competitions', () => {
      expect(isDerby('UNKNOWN: League', 'Real Madrid', 'Barcelona')).toBe(false);
      expect(isDerby('', 'Arsenal', 'Chelsea')).toBe(false);
    });

    it('should be commutative', () => {
      expect(isDerby('ENGLAND: Premier League', 'Arsenal', 'Chelsea')).toBe(
        isDerby('ENGLAND: Premier League', 'Chelsea', 'Arsenal')
      );
    });
  });

  describe('getCompetitionWeight', () => {
    it('should return correct weights for major competitions', () => {
      expect(getCompetitionWeight('UEFA: Champions League')).toBe(3);
      expect(getCompetitionWeight('UEFA: Europa League')).toBe(2.5);
      expect(getCompetitionWeight('ENGLAND: Premier League')).toBe(2.5);
      expect(getCompetitionWeight('SPAIN: La Liga')).toBe(2);
      expect(getCompetitionWeight('ITALY: Serie A')).toBe(2);
      expect(getCompetitionWeight('GERMANY: Bundesliga')).toBe(2);
      expect(getCompetitionWeight('FRANCE: Ligue 1')).toBe(1.5);
    });

    it('should return 0 for unknown competitions', () => {
      expect(getCompetitionWeight('UNKNOWN: League')).toBe(0);
      expect(getCompetitionWeight('')).toBe(0);
    });
  });

  describe('isTopCompetition', () => {
    it('should identify top competitions', () => {
      expect(isTopCompetition('UEFA: Champions League')).toBe(true);
      expect(isTopCompetition('ENGLAND: Premier League')).toBe(true);
      expect(isTopCompetition('SPAIN: La Liga')).toBe(true);
      expect(isTopCompetition('ITALY: Serie A')).toBe(true);
      expect(isTopCompetition('GERMANY: Bundesliga')).toBe(true);
      expect(isTopCompetition('FRANCE: Ligue 1')).toBe(true);
    });

    it('should handle API name mappings', () => {
      expect(isTopCompetition('EUROPE: Champions League, League Stage')).toBe(true);
      expect(isTopCompetition('EUROPE: Europa League, League Stage')).toBe(true);
    });

    it('should return false for non-top competitions', () => {
      expect(isTopCompetition('UNKNOWN: League')).toBe(false);
      expect(isTopCompetition('')).toBe(false);
    });
  });

  describe('Weight Distribution', () => {
    it('should have reasonable weight distribution', () => {
      const weights = Object.values(CLUB_WEIGHTS);
      const maxWeight = Math.max(...weights);
      const minWeight = Math.min(...weights);
      
      expect(maxWeight).toBe(10); // Elite clubs
      expect(minWeight).toBe(2); // Decent clubs
      
      // Should have clubs in each tier
      expect(weights.filter(w => w === 10).length).toBeGreaterThan(0); // Elite
      expect(weights.filter(w => w === 8).length).toBeGreaterThan(0); // Top
      expect(weights.filter(w => w === 6).length).toBeGreaterThan(0); // Strong
      expect(weights.filter(w => w === 4).length).toBeGreaterThan(0); // Good
      expect(weights.filter(w => w === 2).length).toBeGreaterThan(0); // Decent
    });

    it('should have reasonable competition weight distribution', () => {
      const weights = Object.values(COMPETITION_WEIGHTS);
      const maxWeight = Math.max(...weights);
      const minWeight = Math.min(...weights);
      
      expect(maxWeight).toBe(3); // Champions League, World Cup
      expect(minWeight).toBe(1.5); // Lower tier leagues
    });
  });
});
