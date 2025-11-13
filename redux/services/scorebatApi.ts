import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types
export interface Highlight {
  id: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  dateUTC: string;
  score?: string;
  youtubeId: string;
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

// Extract YouTube ID from embed URL
const extractYouTubeId = (embedUrl: string): string | null => {
  const match = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

// Normalize Scorebat data to our Highlight type
const normalizeHighlight = (item: ScorebatResponse['response'][0]): Highlight[] => {
  return item.videos.map((video, index) => {
    const youtubeId = extractYouTubeId(video.embed);
    if (!youtubeId) return null;

    // Extract teams from main title (e.g., "Ulsan - Sanfrecce Hiroshima")
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

    return {
      id: `${youtubeId}-${item.date}-${index}`,
      competition: item.competition,
      homeTeam,
      awayTeam,
      dateUTC: item.date,
      score,
      youtubeId,
      thumbnailUrl: item.thumbnail,
      title: video.title,
      totalGoals,
      isHighScore: totalGoals >= 3,
    };
  }).filter(Boolean) as Highlight[];
};

export const scorebatApi = createApi({
  reducerPath: 'scorebatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SCOREBAT_PROXY_URL || 'https://www.scorebat.com/video-api/v3/',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Highlight'],
  endpoints: (builder) => ({
    getHighlights: builder.query<Highlight[], void>({
      query: () => '',
      transformResponse: (response: ScorebatResponse): Highlight[] => {
        const highlights = response.response.flatMap(normalizeHighlight);
        return highlights.sort((a, b) => new Date(b.dateUTC).getTime() - new Date(a.dateUTC).getTime());
      },
      providesTags: ['Highlight'],
    }),
    getHighlightsByCompetition: builder.query<Highlight[], string>({
      query: (competition) => '',
      transformResponse: (response: ScorebatResponse, _, competition): Highlight[] => {
        const highlights = response.response
          .filter(item => item.competition === competition)
          .flatMap(normalizeHighlight);
        return highlights.sort((a, b) => new Date(b.dateUTC).getTime() - new Date(a.dateUTC).getTime());
      },
      providesTags: ['Highlight'],
    }),
  }),
});

export const { useGetHighlightsQuery, useGetHighlightsByCompetitionQuery } = scorebatApi;
