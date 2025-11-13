// Club weights configuration - defines importance of clubs across all competitions
// Higher weight = more important club, used for game ranking and selection
export const CLUB_WEIGHTS: Record<string, number> = {
  // Tier 1 - Elite clubs (weight 10)
  "Real Madrid": 10,
  "Barcelona": 10,
  "Manchester City": 10,
  "Bayern Munich": 10,
  "Paris Saint-Germain": 10,
  
  // Tier 2 - Top clubs (weight 8)
  "Liverpool": 8,
  "Arsenal": 8,
  "Chelsea": 8,
  "Manchester United": 8,
  "Juventus": 8,
  "AC Milan": 8,
  "Inter Milan": 8,
  "Atletico Madrid": 8,
  
  // Tier 3 - Strong clubs (weight 6)
  "Borussia Dortmund": 6,
  "Napoli": 6,
  "Roma": 6,
  "Sevilla": 6,
  "RB Leipzig": 6,
  "Bayer Leverkusen": 6,
  "Marseille": 6,
  "Monaco": 6,
  "Ajax": 6,
  "PSV": 6,
  
  // Tier 4 - Good clubs (weight 4)
  "Lazio": 4,
  "Tottenham": 4,
  "Newcastle United": 4,
  "Brighton": 4,
  "Aston Villa": 4,
  "West Ham": 4,
  "Valencia": 4,
  "Real Sociedad": 4,
  "Real Betis": 4,
  "Villarreal": 4,
  "Fiorentina": 4,
  "Atalanta": 4,
  "Bologna": 4,
  "Eintracht Frankfurt": 4,
  "Wolfsburg": 4,
  "Borussia Mönchengladbach": 4,
  "Lille": 4,
  "Lyon": 4,
  "Nice": 4,
  "Rennes": 4,
  "Feyenoord": 4,
  "AZ Alkmaar": 4,
  
  // Tier 5 - Decent clubs (weight 2)
  "Crystal Palace": 2,
  "Fulham": 2,
  "Brentford": 2,
  "Wolves": 2,
  "Everton": 2,
  "Nottingham Forest": 2,
  "Burnley": 2,
  "Sheffield United": 2,
  "Luton Town": 2,
  "Athletic Bilbao": 2,
  "Osasuna": 2,
  "Getafe": 2,
  "Celta Vigo": 2,
  "Mallorca": 2,
  "Las Palmas": 2,
  "Cadiz": 2,
  "Alaves": 2,
  "Granada": 2,
  "Torino": 2,
  "Genoa": 2,
  "Udinese": 2,
  "Empoli": 2,
  "Sassuolo": 2,
  "Verona": 2,
  "Salernitana": 2,
  "Cagliari": 2,
  "Frosinone": 2,
  "Lecce": 2,
  "Union Berlin": 2,
  "Augsburg": 2,
  "Hoffenheim": 2,
  "Freiburg": 2,
  "Mainz": 2,
  "Bochum": 2,
  "Cologne": 2,
  "Heidenheim": 2,
  "Darmstadt": 2,
  "Brest": 2,
  "Montpellier": 2,
  "Nantes": 2,
  "Toulouse": 2,
  "Strasbourg": 2,
  "Reims": 2,
  "Lorient": 2,
  "Le Havre": 2,
  "Metz": 2,
  "Clermont": 2,
  "FC Twente": 2,
  "FC Utrecht": 2,
  "Vitesse": 2,
  "Heerenveen": 2,
  "Sparta Rotterdam": 2,
  "NEC Nijmegen": 2,
  "Go Ahead Eagles": 2,
  "Fortuna Sittard": 2,
  "RKC Waalwijk": 2,
  "Excelsior": 2,
  "Volendam": 2,
  "Almere City": 2,
};

// Top clubs configuration for derby detection
// Used to identify "Top Game" matches where both teams are from this list
// Match exact competition names from Scorebat API
export const TOP_CLUBS: Record<string, string[]> = {
  "ENGLAND: Premier League": [
    "Arsenal",
    "Chelsea",
    "Liverpool",
    "Manchester City",
    "Manchester United",
  ],
  "UEFA: Champions League": [
    "Real Madrid",
    "Barcelona",
    "Bayern Munich",
    "Manchester City",
    "Paris Saint-Germain",
    "Liverpool",
    "AC Milan",
    "Inter Milan",
    "Juventus",
    "Atletico Madrid",
    "Borussia Dortmund",
    "Arsenal",
    "Chelsea",
  ],
  "SPAIN: La Liga": [
    "Real Madrid",
    "Barcelona",
    "Atletico Madrid",
    "Sevilla",
  ],
  "ITALY: Serie A": [
    "Juventus",
    "AC Milan",
    "Inter Milan",
    "Napoli",
    "Roma",
    "Lazio",
  ],
  "GERMANY: Bundesliga": [
    "Bayern Munich",
    "Borussia Dortmund",
    "RB Leipzig",
    "Bayer Leverkusen",
  ],
  "FRANCE: Ligue 1": [
    "Paris Saint-Germain",
    "Marseille",
    "Monaco",
  ],
  "NETHERLANDS: Eredivisie": [
    "Ajax",
    "PSV",
    "Feyenoord",
    "AZ Alkmaar",
  ],
};

// Top competitions configuration
// Based on ScoreBat standings page: https://www.scorebat.com/standings/

// Top priority competitions - these will appear first in the league selector
// Sorted by priority and typical update schedule
export const TOP_COMPETITIONS = [
  // UEFA competitions (highest priority, typically updated during weekdays)
  "UEFA: Champions League",
  "UEFA: Europa League", 
  "UEFA: Conference League",
  
  // Major European leagues (updated primarily on weekends)
  "ENGLAND: Premier League",
  "SPAIN: La Liga",
  "ITALY: Serie A",
  "GERMANY: Bundesliga",
  "FRANCE: Ligue 1",
  "NETHERLANDS: Eredivisie",
  
  // International competitions
  "FIFA: World Cup",
  "UEFA: European Championship",
  "UEFA: Nations League",
  "FIFA: World Cup Qualifiers",
  "UEFA: European Championship Qualifiers",
] as const;

// Competition IDs mapping for ScoreBat API
// These IDs correspond to the competition endpoints on ScoreBat
export const COMPETITION_IDS: Record<string, string> = {
  "ENGLAND: Premier League": "england-premier-league",
  "SPAIN: La Liga": "spain-la-liga",
  "ITALY: Serie A": "italy-serie-a",
  "GERMANY: Bundesliga": "germany-bundesliga",
  "FRANCE: Ligue 1": "france-ligue-1",
  "NETHERLANDS: Eredivisie": "netherlands-eredivisie",
  "UEFA: Champions League": "europe-champions-league-league-stage",
  "UEFA: Europa League": "europe-europa-league-league-stage",
//   "UEFA: Conference League": "uefa-conference-league",
//   "FIFA: World Cup": "fifa-world-cup",
//   "UEFA: European Championship": "uefa-european-championship",
//   "UEFA: Nations League": "uefa-nations-league",
//   "FIFA: World Cup Qualifiers": "fifa-world-cup-qualifiers",
//   "UEFA: European Championship Qualifiers": "uefa-european-championship-qualifiers",
};

// Competition priority weights for ranking
export const COMPETITION_WEIGHTS: Record<string, number> = {
  "UEFA: Champions League": 3,
  "UEFA: Europa League": 2.5,
  "UEFA: Conference League": 2,
  "ENGLAND: Premier League": 2.5,
  "SPAIN: La Liga": 2,
  "ITALY: Serie A": 2,
  "GERMANY: Bundesliga": 2,
  "FRANCE: Ligue 1": 1.5,
  "NETHERLANDS: Eredivisie": 1.5,
  "FIFA: World Cup": 3,
  "UEFA: European Championship": 3,
  "UEFA: Nations League": 2,
  "FIFA: World Cup Qualifiers": 2,
  "UEFA: European Championship Qualifiers": 2,
};

export type TopCompetition = typeof TOP_COMPETITIONS[number];

// Get club weight (default 0 if not found)
export function getClubWeight(clubName: string): number {
  return CLUB_WEIGHTS[clubName] || 0;
}

// Get combined weight for a match (sum of both teams' weights)
export function getMatchWeight(homeTeam: string, awayTeam: string): number {
  return getClubWeight(homeTeam) + getClubWeight(awayTeam);
}

// Check if a match is a derby (both teams in top clubs list)
export function isDerby(competition: string, homeTeam: string, awayTeam: string): boolean {
  const topClubs = TOP_CLUBS[competition];
  if (!topClubs) return false;
  
  return topClubs.includes(homeTeam) && topClubs.includes(awayTeam);
}

// Get competition weight
export function getCompetitionWeight(competition: string): number {
  return COMPETITION_WEIGHTS[competition] || 0;
}

// Get competition ID for API calls
export function getCompetitionId(competition: string): string | null {
  return COMPETITION_IDS[competition] || null;
}

// Check if competition is a top competition
export function isTopCompetition(competition: string): boolean {
  // Direct match with expected names
  if (TOP_COMPETITIONS.includes(competition as TopCompetition)) {
    return true;
  }
  
  // Handle actual API names that differ from expected names
  const apiNameMappings: Record<string, string> = {
    "EUROPE: Champions League, League Stage": "UEFA: Champions League",
    "EUROPE: Europa League, League Stage": "UEFA: Europa League",
    "EUROPE: Conference League, League Stage": "UEFA: Conference League",
    "SPAIN: La Liga": "SPAIN: La Liga",
    "ITALY: Serie A": "ITALY: Serie A",
    "GERMANY: Bundesliga": "GERMANY: Bundesliga",
    "FRANCE: Ligue 1": "FRANCE: Ligue 1",
    "NETHERLANDS: Eredivisie": "NETHERLANDS: Eredivisie",
    "ENGLAND: Premier League": "ENGLAND: Premier League",
  };
  
  const mappedName = apiNameMappings[competition];
  if (mappedName && TOP_COMPETITIONS.includes(mappedName as TopCompetition)) {
    return true;
  }
  
  return false;
}
