import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types
export interface Highlight {
  id: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  dateUTC: string;
  score?: string;
  embedCode: string; // Scorebat embed HTML
  matchviewUrl: string; // Scorebat matchview URL (fallback)
  thumbnailUrl: string;
  title: string;
  description?: string;
  duration?: number;
  isTopGame?: boolean;
  isHighScore?: boolean;
  totalGoals?: number;
}

export interface ScorebatResponse {
  response: Array<{
    title: string;
    competition: string;
    matchviewUrl: string;
    competitionUrl: string;
    thumbnail: string;
    date: string;
    videos: Array<{
      id: string;
      title: string;
      embed: string;
    }>;
  }>;
}

// Normalize Scorebat data to our Highlight type
const normalizeHighlight = (item: ScorebatResponse['response'][0]): Highlight[] => {
  // Get the first video (usually the main highlight video)
  const video = item.videos[0];
  if (!video || !video.embed) return [];

  // Extract teams from main title (e.g., "Bristol City - Southampton")
  // Try both " - " and " vs " separators
  let homeTeam = 'Home Team';
  let awayTeam = 'Away Team';
  
  const dashMatch = item.title.match(/^(.+?)\s+-\s+(.+?)$/);
  const vsMatch = item.title.match(/^(.+?)\s+vs?\s+(.+?)$/i);
  
  if (dashMatch) {
    homeTeam = dashMatch[1].trim();
    awayTeam = dashMatch[2].trim();
  } else if (vsMatch) {
    homeTeam = vsMatch[1].trim();
    awayTeam = vsMatch[2].trim();
  }

  // Extract score from video title
  const scoreMatch = video.title.match(/(\d+[-:]\d+)/);
  const score = scoreMatch ? scoreMatch[1] : undefined;

  // Calculate total goals
  const totalGoals = score ? score.split(/[-:]/).reduce((sum, goals) => sum + parseInt(goals, 10), 0) : 0;

  // Use the video ID as the unique identifier
  const videoId = video.id;

  return [{
    id: videoId,
    competition: item.competition,
    homeTeam,
    awayTeam,
    dateUTC: item.date,
    score,
    embedCode: video.embed,
    matchviewUrl: item.matchviewUrl,
    thumbnailUrl: item.thumbnail,
    title: video.title,
    totalGoals,
    isHighScore: totalGoals >= 3,
  }];
};

export const scorebatApi = createApi({
  reducerPath: 'scorebatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: typeof window !== 'undefined' ? `${window.location.origin.replace(':3000', ':8787')}/` : 'http://localhost:8787/',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Highlight', 'Competition'],
  endpoints: (builder) => ({
    getAggregatedHighlights: builder.query<{
      response: Highlight[],
      competitions: Array<{id: string, name: string, latestUpdate: string, highlightCount: number}>,
      totalHighlights: number,
      lastUpdated: string
    }, { cacheBust?: string } | void>({
      query: (params) => {
        const cacheBust = typeof params === 'object' && params?.cacheBust;
        return cacheBust ? `highlights?cache_bust=${cacheBust}` : 'highlights';
      },
      providesTags: ['Highlight'],
    }),
    getHighlightsByCompetition: builder.query<Highlight[], string>({
      query: (competitionId) => `competition/${competitionId}`,
      transformResponse: (response: ScorebatResponse): Highlight[] => {
        const highlights = response.response.flatMap(normalizeHighlight);
        return highlights.sort((a, b) => new Date(b.dateUTC).getTime() - new Date(a.dateUTC).getTime());
      },
      providesTags: ['Highlight'],
    }),
  }),
});

export const { useGetAggregatedHighlightsQuery, useGetHighlightsByCompetitionQuery } = scorebatApi;
