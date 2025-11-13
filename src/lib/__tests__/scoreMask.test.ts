import { describe, it, expect } from 'vitest';
import { maskScores, isScoreInText, extractScoreFromText } from '../scoreMask';

describe('scoreMask', () => {
  describe('maskScores', () => {
    it('should mask basic score patterns', () => {
      expect(maskScores('Arsenal 2-1 Chelsea')).toBe('Arsenal ⚽⚽ Chelsea');
      expect(maskScores('Final score: 3:2')).toBe('Final score: ⚽⚽');
      expect(maskScores('Man City 4-0 Liverpool')).toBe('Man City ⚽⚽ Liverpool');
    });

    it('should mask scores with spaces', () => {
      expect(maskScores('Barcelona 2 - 1 Real Madrid')).toBe('Barcelona ⚽⚽ Real Madrid');
      expect(maskScores('Score was 1 : 0')).toBe('Score was ⚽⚽');
    });

    it('should mask scores in brackets', () => {
      expect(maskScores('Game ended [2-1]')).toBe('Game ended ⚽⚽');
      expect(maskScores('Result (3-2) after ET')).toBe('Result ⚽⚽ after ⚽⚽');
    });

    it('should mask aggregate scores', () => {
      expect(maskScores('Won 3 (5) on aggregate')).toBe('Won ⚽⚽ on ⚽⚽');
      expect(maskScores('Lost 1 [3]')).toBe('Lost ⚽⚽');
    });

    it('should mask extra time indicators', () => {
      expect(maskScores('2-2 AET')).toBe('⚽⚽ ⚽⚽');
      expect(maskScores('Won on pens')).toBe('Won on ⚽⚽');
      expect(maskScores('3-3 agg')).toBe('⚽⚽ ⚽⚽');
    });

    it('should handle multiple scores in one string', () => {
      expect(maskScores('Game 1: 2-1, Game 2: 3-0')).toBe('Game 1: ⚽⚽, Game 2: ⚽⚽');
    });

    it('should not mask non-score numbers', () => {
      expect(maskScores('Top 10 goals')).toBe('Top 10 goals');
      expect(maskScores('Round 16 match')).toBe('Round 16 match');
    });

    it('should handle empty strings', () => {
      expect(maskScores('')).toBe('');
    });
  });

  describe('isScoreInText', () => {
    it('should detect scores in text', () => {
      expect(isScoreInText('Arsenal 2-1 Chelsea')).toBe(true);
      expect(isScoreInText('Final 3:2')).toBe(true);
      expect(isScoreInText('Won on pens')).toBe(true);
    });

    it('should return false when no score is present', () => {
      expect(isScoreInText('Top 10 goals')).toBe(false);
      expect(isScoreInText('Round 16 preview')).toBe(false);
      expect(isScoreInText('')).toBe(false);
    });
  });

  describe('extractScoreFromText', () => {
    it('should extract the first score from text', () => {
      expect(extractScoreFromText('Arsenal 2-1 Chelsea')).toBe('2-1');
      expect(extractScoreFromText('Final 3:2 after ET')).toBe('3:2');
    });

    it('should return null when no score is present', () => {
      expect(extractScoreFromText('Top 10 goals')).toBe(null);
      expect(extractScoreFromText('')).toBe(null);
    });
  });
});
