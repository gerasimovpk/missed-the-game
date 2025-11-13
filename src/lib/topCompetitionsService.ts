import { TOP_COMPETITIONS, COMPETITION_IDS } from './topClubs';
import { scorebatApi, Highlight } from '@/redux/services/scorebatApi';
import { store } from '@/redux/store';

export interface CompetitionData {
  id: string;
  name: string;
  latestUpdate: string;
  highlights: Highlight[];
  isTopCompetition: boolean;
}

// Pre-fetch top competitions data
export async function preFetchTopCompetitions(): Promise<CompetitionData[]> {
  const topCompetitionsData: CompetitionData[] = [];
  
  // Pre-fetch each top competition
  for (const competitionName of TOP_COMPETITIONS) {
    const competitionId = COMPETITION_IDS[competitionName];
    if (!competitionId) continue;
    
    try {
      // Dispatch the query to fetch competition data
      const result = await store.dispatch(
        scorebatApi.endpoints.getHighlightsByCompetition.initiate(competitionId)
      );
      
      if (result.data) {
        topCompetitionsData.push({
          id: competitionId,
          name: competitionName,
          latestUpdate: getLatestUpdateFromHighlights(result.data),
          highlights: result.data,
          isTopCompetition: true,
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch data for ${competitionName}:`, error);
    }
  }
  
  return topCompetitionsData;
}

// Get latest update date from highlights
function getLatestUpdateFromHighlights(highlights: Highlight[]): string {
  if (!highlights || highlights.length === 0) {
    return new Date().toISOString();
  }
  
  const dates = highlights.map(h => new Date(h.dateUTC).getTime());
  const latestDate = new Date(Math.max(...dates));
  return latestDate.toISOString();
}

// Sort competitions chronologically by latest update
export function sortCompetitionsByLatestUpdate(competitions: CompetitionData[]): CompetitionData[] {
  return competitions.sort((a, b) => {
    const dateA = new Date(a.latestUpdate).getTime();
    const dateB = new Date(b.latestUpdate).getTime();
    return dateB - dateA; // Most recent first
  });
}

// Get top competitions sorted by latest update
export function getTopCompetitionsSorted(competitions: CompetitionData[]): CompetitionData[] {
  const topComps = competitions.filter(comp => comp.isTopCompetition);
  return sortCompetitionsByLatestUpdate(topComps);
}

// Get other competitions (non-top)
export function getOtherCompetitions(competitions: CompetitionData[]): CompetitionData[] {
  return competitions.filter(comp => !comp.isTopCompetition);
}

// Check if competition should be prioritized based on current date
export function shouldPrioritizeCompetition(competitionName: string): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // UEFA competitions (Champions League, Europa League, Conference League) 
  // are typically played on weekdays (Tuesday-Wednesday)
  const uefaCompetitions = [
    "UEFA: Champions League",
    "UEFA: Europa League", 
    "UEFA: Conference League"
  ];
  
  // National leagues are typically played on weekends
  const nationalLeagues = [
    "ENGLAND: Premier League",
    "SPAIN: La Liga",
    "ITALY: Serie A",
    "GERMANY: Bundesliga",
    "FRANCE: Ligue 1",
    "NETHERLANDS: Eredivisie"
  ];
  
  // During weekdays (Monday-Friday), prioritize UEFA competitions
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return uefaCompetitions.includes(competitionName);
  }
  
  // During weekends (Saturday-Sunday), prioritize national leagues
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return nationalLeagues.includes(competitionName);
  }
  
  return false;
}
