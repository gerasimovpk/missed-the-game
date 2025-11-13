// League logo mapping
// Using ScoreBat league logos from their website
// Reference: https://www.scorebat.com/

export const LEAGUE_LOGOS: Record<string, string> = {
  "ENGLAND: Premier League": "https://www.scorebat.com/og/flag/default/epl.png",
  "SPAIN: La Liga": "https://www.scorebat.com/og/flag/default/laliganew.png",
  "ITALY: Serie A": "https://www.scorebat.com/og/flag/default/seriea.png",
  "GERMANY: Bundesliga": "https://www.scorebat.com/og/flag/default/bundesliga.png",
  "FRANCE: Ligue 1": "https://www.scorebat.com/og/flag/default/ligue1A.png",
  "NETHERLANDS: Eredivisie": "https://www.scorebat.com/og/flag/default/132.png",
  "UEFA: Champions League": "https://www.scorebat.com/og/flag/default/cl.png",
  "UEFA: Europa League": "https://www.scorebat.com/og/flag/default/erplg.png",
  "UEFA: Conference League": "https://www.scorebat.com/og/flag/default/epl.png",
  "EUROPE: Champions League, League Stage": "https://www.scorebat.com/og/flag/default/cl.png",
  "EUROPE: Europa League, League Stage": "https://www.scorebat.com/og/flag/default/erplg.png",
};

/**
 * Get logo URL for a competition
 * Returns the logo URL if available, otherwise returns null
 */
export function getLeagueLogo(competition: string): string | null {
  return LEAGUE_LOGOS[competition] || null;
}

/**
 * Get short name for a competition (for tooltip/alt text)
 */
export function getLeagueShortName(competition: string): string {
  const shortNames: Record<string, string> = {
    "ENGLAND: Premier League": "Premier League",
    "SPAIN: La Liga": "La Liga",
    "ITALY: Serie A": "Serie A",
    "GERMANY: Bundesliga": "Bundesliga",
    "FRANCE: Ligue 1": "Ligue 1",
    "NETHERLANDS: Eredivisie": "Eredivisie",
    "UEFA: Champions League": "Champions League",
    "UEFA: Europa League": "Europa League",
    "UEFA: Conference League": "Conference League",
    "EUROPE: Champions League, League Stage": "Champions League",
    "EUROPE: Europa League, League Stage": "Europa League",
  };
  
  return shortNames[competition] || competition;
}

