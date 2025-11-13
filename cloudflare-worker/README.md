# Cloudflare Worker - Scorebat API Proxy

This Cloudflare Worker acts as a proxy between your Next.js app and the Scorebat API, handling CORS, caching, and keeping API tokens secure.

## Setup

### 1. Install Dependencies

From the project root:
```bash
npm install
```

### 2. Configure Environment Variables

#### For Local Development

Create a `.dev.vars` file in this directory (it's gitignored):

```bash
cp .dev.vars.example .dev.vars
# Then edit .dev.vars with your actual tokens
```

Or create it manually:
```bash
SCOREBAT_TOKEN=your_token_here
SCOREBAT_EMBED_TOKEN=your_embed_token_here
```

#### For Production (Cloudflare)

Set secrets using Wrangler CLI:

```bash
# Login to Cloudflare (first time only)
npx wrangler login

# Set secrets
npx wrangler secret put SCOREBAT_TOKEN
# Paste your token when prompted

npx wrangler secret put SCOREBAT_EMBED_TOKEN
# Paste your embed token when prompted
```

**Important:** Secrets are encrypted and stored securely by Cloudflare. They're not visible in your code or logs.

## Development

Run the worker locally:

```bash
npm run worker:dev
```

This starts the worker on `http://localhost:8787` and uses tokens from `.dev.vars`.

## Deployment

Deploy to Cloudflare:

```bash
npm run worker:deploy
```

Or from this directory:

```bash
npx wrangler deploy
```

After deployment, you'll get a URL like:
```
https://missed-the-game-proxy.your-username.workers.dev
```

**Copy this URL** and add it to your Vercel environment variables as `NEXT_PUBLIC_SCOREBAT_PROXY_URL`.

## Endpoints

- `GET /highlights` - Aggregated highlights from top competitions
- `GET /competition/{id}` - Highlights for a specific competition
- `GET /video-url?videoId={id}&autoplay=true` - Generate video embed URL
- `GET /debug` - Debug endpoint to test all competitions

## Security Notes

- ✅ Tokens are stored as encrypted secrets in Cloudflare
- ✅ Tokens are never exposed to the browser
- ✅ `.dev.vars` is gitignored (never commit tokens!)
- ✅ All API calls go through this proxy (no direct Scorebat calls from frontend)

