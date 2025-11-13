// Cloudflare Worker for Scorebat API proxy with CORS and caching
const SCOREBAT_API_URL = 'https://www.scorebat.com/video-api/v3/';
const SCOREBAT_TOKEN = 'MjQ0NzkzXzE3NjE2NjY4NThfZGQ0YjgzNjA4N2VlMzY4NTg2MWNiZThiOWEyOGIzNmI4NzFkNDRjZA==';
const SCOREBAT_EMBED_TOKEN = 'MjQ0NzkzXzE3NjE2ODAzMzhfMDlmOTA0MTQ0N2YyZWM1ZjU3ZWU3ZDk0M2U0Y2I2YWMzMDJjNGM5Nw==';
const CACHE_TTL = 60 * 60 * 24 * 10; // 1 hour in seconds -> 10 days, to save on API calls

// Top competitions to fetch
const TOP_COMPETITIONS = [
  'england-premier-league',
  'spain-la-liga', 
  'italy-serie-a',
  'germany-bundesliga',
  'france-ligue-1',
  'netherlands-eredivisie',
  'europe-champions-league-league-stage',
  'europe-europa-league-league-stage',
  // 'uefa-conference-league',
  // 'fifa-world-cup',
  // 'uefa-european-championship',
  // 'uefa-nations-league',
  // 'fifa-world-cup-qualifiers',
  // 'uefa-european-championship-qualifiers',
];

export default {
  async fetch(request: Request): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const url = new URL(request.url);
      const endpoint = url.pathname.substring(1); // Remove leading slash
      
              // Handle aggregated highlights endpoint
              if (endpoint === 'highlights') {
                return await handleAggregatedHighlights(request);
              }
              
              // Handle video URL generation with embed token
              if (endpoint === 'video-url') {
                return await handleVideoUrl(request);
              }
              
              // Debug endpoint to test individual competitions
              if (endpoint === 'debug') {
                return await handleDebugEndpoint(request);
              }
      
      // Handle individual competition endpoints (for backward compatibility)
      if (endpoint.startsWith('competition/')) {
        return await handleCompetitionEndpoint(request, endpoint);
      }
      
      return new Response('Endpoint not found', { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal server error', { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};

async function handleAggregatedHighlights(request: Request): Promise<Response> {
  const cache = caches.default;
  
  // Check for cache busting parameter
  const url = new URL(request.url);
  const cacheBust = url.searchParams.get('cache_bust');
  
  // Create cache key with optional cache busting
  const cacheKeyUrl = cacheBust ? 
    `${SCOREBAT_API_URL}highlights?v=${cacheBust}` : 
    `${SCOREBAT_API_URL}highlights`;
  const cacheKey = new Request(cacheKeyUrl, request);
  
  // Check cache first
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    console.log('Returning cached aggregated highlights');
    return new Response(cachedResponse.body, {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers: {
        ...cachedResponse.headers,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, max-age=${CACHE_TTL}`,
      },
    });
  }

  console.log('Fetching fresh aggregated highlights');
  
  // Fetch data from all top competitions
  const allHighlights = [];
  const competitionData = [];
  
  for (const competitionId of TOP_COMPETITIONS) {
    try {
      console.log(`🔄 Fetching ${competitionId}...`);
      const apiUrl = `${SCOREBAT_API_URL}competition/${competitionId}/?token=${SCOREBAT_TOKEN}`;
      const response = await fetch(apiUrl);
      
      console.log(`📊 ${competitionId} - Status: ${response.status}, OK: ${response.ok}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`📈 ${competitionId} - Raw highlights: ${data.response?.length || 0}`);
        
        if (data.response && data.response.length > 0) {
          // Normalize highlights
          const normalizedHighlights = data.response.map(item => normalizeHighlight(item)).flat();
          console.log(`✨ ${competitionId} - Normalized highlights: ${normalizedHighlights.length}`);
          
          // Only add if we have normalized highlights
          if (normalizedHighlights.length > 0) {
            allHighlights.push(...normalizedHighlights);
            
            // Store competition metadata
            const competitionName = data.response[0]?.competition || competitionId;
            competitionData.push({
              id: competitionId,
              name: competitionName,
              latestUpdate: getLatestUpdateFromHighlights(normalizedHighlights),
              highlightCount: normalizedHighlights.length,
            });
            
            console.log(`✅ Added ${competitionId} (${competitionName}) with ${normalizedHighlights.length} highlights`);
          } else {
            console.log(`⚠️ ${competitionId} - No normalized highlights, skipping`);
          }
        } else {
          console.log(`❌ ${competitionId} - No response data or empty response`);
        }
      } else {
        console.log(`🚫 ${competitionId} - HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`💥 Failed to fetch ${competitionId}:`, error);
    }
  }
  
  // Remove duplicates based on video ID
  const uniqueHighlights = allHighlights.filter((highlight, index, self) => 
    index === self.findIndex(h => h.id === highlight.id)
  );
  
  // Sort by date (most recent first)
  uniqueHighlights.sort((a, b) => new Date(b.dateUTC).getTime() - new Date(a.dateUTC).getTime());
  
  console.log(`🎯 FINAL RESULT:`);
  console.log(`   📊 Competitions: ${competitionData.length}`);
  console.log(`   🎬 Total Highlights: ${uniqueHighlights.length}`);
  console.log(`   🏆 Competition Names:`, competitionData.map(c => c.name));
  
  const responseData = {
    response: uniqueHighlights,
    competitions: competitionData,
    totalHighlights: uniqueHighlights.length,
    lastUpdated: new Date().toISOString(),
  };
  
  const response = new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `public, max-age=${CACHE_TTL}`,
    },
  });
  
  // Cache the response
  await cache.put(cacheKey, response.clone());
  
  return response;
}

async function handleVideoUrl(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const videoId = url.searchParams.get('videoId');
  const autoplay = url.searchParams.get('autoplay') === 'true';
  
  if (!videoId) {
    return new Response('Missing videoId parameter', { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  
  const autoplayParam = autoplay ? '&autoplay=1' : '';
  const videoUrl = `https://www.scorebat.com/embed/v/${videoId}/?token=${SCOREBAT_EMBED_TOKEN}&utm_source=api&utm_medium=video&utm_campaign=dffd${autoplayParam}`;
  
  return new Response(JSON.stringify({ videoUrl }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function handleDebugEndpoint(request: Request): Promise<Response> {
  const results = [];
  
  for (const competitionId of TOP_COMPETITIONS) {
    try {
      const apiUrl = `${SCOREBAT_API_URL}competition/${competitionId}/?token=${SCOREBAT_TOKEN}`;
      const response = await fetch(apiUrl);
      
      const result = {
        competitionId,
        status: response.status,
        ok: response.ok,
        highlights: 0,
        competitionName: null
      };
      
      if (response.ok) {
        const data = await response.json();
        result.highlights = data.response?.length || 0;
        result.competitionName = data.response?.[0]?.competition || null;
      }
      
      results.push(result);
    } catch (error) {
      results.push({
        competitionId,
        status: 'error',
        ok: false,
        highlights: 0,
        competitionName: null,
        error: error.message
      });
    }
  }
  
  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function handleCompetitionEndpoint(request: Request, endpoint: string): Promise<Response> {
  const cache = caches.default;
  const apiUrl = `${SCOREBAT_API_URL}${endpoint}/?token=${SCOREBAT_TOKEN}`;
  const cacheKey = new Request(apiUrl, request);
  
  // Check cache first
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return new Response(cachedResponse.body, {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers: {
        ...cachedResponse.headers,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, max-age=${CACHE_TTL}`,
      },
    });
  }

  // Fetch from Scorebat API
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'MissedTheGame/1.0',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    return new Response('Failed to fetch data', { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Clone response for caching
  const responseClone = response.clone();
  
  // Cache the response
  const cacheResponse = new Response(responseClone.body, {
    status: responseClone.status,
    statusText: responseClone.statusText,
    headers: {
      ...responseClone.headers,
      'Cache-Control': `public, max-age=${CACHE_TTL}`,
    },
  });
  
  await cache.put(cacheKey, cacheResponse);

  // Return response with CORS headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...response.headers,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `public, max-age=${CACHE_TTL}`,
    },
  });
}

// Helper function to normalize highlights (same logic as frontend)
function normalizeHighlight(item: any): any[] {
  const video = item.videos[0];
  if (!video || !video.embed) return [];

  // Extract teams from main title
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

  return [{
    id: video.id,
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
}

// Helper function to get latest update from highlights
function getLatestUpdateFromHighlights(highlights: any[]): string {
  if (!highlights || highlights.length === 0) {
    return new Date().toISOString();
  }
  
  const dates = highlights.map(h => new Date(h.dateUTC).getTime());
  const latestDate = new Date(Math.max(...dates));
  return latestDate.toISOString();
}
