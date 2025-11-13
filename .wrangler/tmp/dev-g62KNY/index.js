var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-ttsyLU/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// cloudflare-worker/index.ts
var SCOREBAT_API_URL = "https://www.scorebat.com/video-api/v3/";
var SCOREBAT_TOKEN = "MjQ0NzkzXzE3NjE2NjY4NThfZGQ0YjgzNjA4N2VlMzY4NTg2MWNiZThiOWEyOGIzNmI4NzFkNDRjZA==";
var SCOREBAT_EMBED_TOKEN = "MjQ0NzkzXzE3NjE2ODAzMzhfMDlmOTA0MTQ0N2YyZWM1ZjU3ZWU3ZDk0M2U0Y2I2YWMzMDJjNGM5Nw==";
var CACHE_TTL = 60 * 60 * 24 * 10;
var TOP_COMPETITIONS = [
  "england-premier-league",
  "spain-la-liga",
  "italy-serie-a",
  "germany-bundesliga",
  "france-ligue-1",
  "netherlands-eredivisie",
  "europe-champions-league-league-stage",
  "europe-europa-league-league-stage"
  // 'uefa-conference-league',
  // 'fifa-world-cup',
  // 'uefa-european-championship',
  // 'uefa-nations-league',
  // 'fifa-world-cup-qualifiers',
  // 'uefa-european-championship-qualifiers',
];
var cloudflare_worker_default = {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400"
        }
      });
    }
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }
    try {
      const url = new URL(request.url);
      const endpoint = url.pathname.substring(1);
      if (endpoint === "highlights") {
        return await handleAggregatedHighlights(request);
      }
      if (endpoint === "video-url") {
        return await handleVideoUrl(request);
      }
      if (endpoint === "debug") {
        return await handleDebugEndpoint(request);
      }
      if (endpoint.startsWith("competition/")) {
        return await handleCompetitionEndpoint(request, endpoint);
      }
      return new Response("Endpoint not found", {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response("Internal server error", {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};
async function handleAggregatedHighlights(request) {
  const cache = caches.default;
  const url = new URL(request.url);
  const cacheBust = url.searchParams.get("cache_bust");
  const cacheKeyUrl = cacheBust ? `${SCOREBAT_API_URL}highlights?v=${cacheBust}` : `${SCOREBAT_API_URL}highlights`;
  const cacheKey = new Request(cacheKeyUrl, request);
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    console.log("Returning cached aggregated highlights");
    return new Response(cachedResponse.body, {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers: {
        ...cachedResponse.headers,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": `public, max-age=${CACHE_TTL}`
      }
    });
  }
  console.log("Fetching fresh aggregated highlights");
  const allHighlights = [];
  const competitionData = [];
  for (const competitionId of TOP_COMPETITIONS) {
    try {
      console.log(`\u{1F504} Fetching ${competitionId}...`);
      const apiUrl = `${SCOREBAT_API_URL}competition/${competitionId}/?token=${SCOREBAT_TOKEN}`;
      const response2 = await fetch(apiUrl);
      console.log(`\u{1F4CA} ${competitionId} - Status: ${response2.status}, OK: ${response2.ok}`);
      if (response2.ok) {
        const data = await response2.json();
        console.log(`\u{1F4C8} ${competitionId} - Raw highlights: ${data.response?.length || 0}`);
        if (data.response && data.response.length > 0) {
          const normalizedHighlights = data.response.map((item) => normalizeHighlight(item)).flat();
          console.log(`\u2728 ${competitionId} - Normalized highlights: ${normalizedHighlights.length}`);
          if (normalizedHighlights.length > 0) {
            allHighlights.push(...normalizedHighlights);
            const competitionName = data.response[0]?.competition || competitionId;
            competitionData.push({
              id: competitionId,
              name: competitionName,
              latestUpdate: getLatestUpdateFromHighlights(normalizedHighlights),
              highlightCount: normalizedHighlights.length
            });
            console.log(`\u2705 Added ${competitionId} (${competitionName}) with ${normalizedHighlights.length} highlights`);
          } else {
            console.log(`\u26A0\uFE0F ${competitionId} - No normalized highlights, skipping`);
          }
        } else {
          console.log(`\u274C ${competitionId} - No response data or empty response`);
        }
      } else {
        console.log(`\u{1F6AB} ${competitionId} - HTTP ${response2.status}: ${response2.statusText}`);
      }
    } catch (error) {
      console.error(`\u{1F4A5} Failed to fetch ${competitionId}:`, error);
    }
  }
  const uniqueHighlights = allHighlights.filter(
    (highlight, index, self) => index === self.findIndex((h) => h.id === highlight.id)
  );
  uniqueHighlights.sort((a, b) => new Date(b.dateUTC).getTime() - new Date(a.dateUTC).getTime());
  console.log(`\u{1F3AF} FINAL RESULT:`);
  console.log(`   \u{1F4CA} Competitions: ${competitionData.length}`);
  console.log(`   \u{1F3AC} Total Highlights: ${uniqueHighlights.length}`);
  console.log(`   \u{1F3C6} Competition Names:`, competitionData.map((c) => c.name));
  const responseData = {
    response: uniqueHighlights,
    competitions: competitionData,
    totalHighlights: uniqueHighlights.length,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
  const response = new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": `public, max-age=${CACHE_TTL}`
    }
  });
  await cache.put(cacheKey, response.clone());
  return response;
}
__name(handleAggregatedHighlights, "handleAggregatedHighlights");
async function handleVideoUrl(request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get("videoId");
  const autoplay = url.searchParams.get("autoplay") === "true";
  if (!videoId) {
    return new Response("Missing videoId parameter", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  const autoplayParam = autoplay ? "&autoplay=1" : "";
  const videoUrl = `https://www.scorebat.com/embed/v/${videoId}/?token=${SCOREBAT_EMBED_TOKEN}&utm_source=api&utm_medium=video&utm_campaign=dffd${autoplayParam}`;
  return new Response(JSON.stringify({ videoUrl }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(handleVideoUrl, "handleVideoUrl");
async function handleDebugEndpoint(request) {
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
        status: "error",
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
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(handleDebugEndpoint, "handleDebugEndpoint");
async function handleCompetitionEndpoint(request, endpoint) {
  const cache = caches.default;
  const apiUrl = `${SCOREBAT_API_URL}${endpoint}/?token=${SCOREBAT_TOKEN}`;
  const cacheKey = new Request(apiUrl, request);
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return new Response(cachedResponse.body, {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers: {
        ...cachedResponse.headers,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": `public, max-age=${CACHE_TTL}`
      }
    });
  }
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "User-Agent": "MissedTheGame/1.0",
      "Accept": "application/json"
    }
  });
  if (!response.ok) {
    return new Response("Failed to fetch data", {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  const responseClone = response.clone();
  const cacheResponse = new Response(responseClone.body, {
    status: responseClone.status,
    statusText: responseClone.statusText,
    headers: {
      ...responseClone.headers,
      "Cache-Control": `public, max-age=${CACHE_TTL}`
    }
  });
  await cache.put(cacheKey, cacheResponse);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...response.headers,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": `public, max-age=${CACHE_TTL}`
    }
  });
}
__name(handleCompetitionEndpoint, "handleCompetitionEndpoint");
function normalizeHighlight(item) {
  const video = item.videos[0];
  if (!video || !video.embed) return [];
  let homeTeam = "Home Team";
  let awayTeam = "Away Team";
  const dashMatch = item.title.match(/^(.+?)\s+-\s+(.+?)$/);
  const vsMatch = item.title.match(/^(.+?)\s+vs?\s+(.+?)$/i);
  if (dashMatch) {
    homeTeam = dashMatch[1].trim();
    awayTeam = dashMatch[2].trim();
  } else if (vsMatch) {
    homeTeam = vsMatch[1].trim();
    awayTeam = vsMatch[2].trim();
  }
  const scoreMatch = video.title.match(/(\d+[-:]\d+)/);
  const score = scoreMatch ? scoreMatch[1] : void 0;
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
    isHighScore: totalGoals >= 3
  }];
}
__name(normalizeHighlight, "normalizeHighlight");
function getLatestUpdateFromHighlights(highlights) {
  if (!highlights || highlights.length === 0) {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  const dates = highlights.map((h) => new Date(h.dateUTC).getTime());
  const latestDate = new Date(Math.max(...dates));
  return latestDate.toISOString();
}
__name(getLatestUpdateFromHighlights, "getLatestUpdateFromHighlights");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-ttsyLU/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = cloudflare_worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-ttsyLU/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
