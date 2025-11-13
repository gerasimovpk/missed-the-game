# 🚀 Quick Start: Deploy Your App in 30 Minutes

This is a condensed version. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Step 1: Push to GitHub (5 min)

```bash
# 1. Create a new repository on GitHub.com (don't initialize it)

# 2. In your terminal:
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/missed-the-game.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Cloudflare Worker (5 min)

```bash
npm install -g wrangler
wrangler login
cd cloudflare-worker
wrangler deploy
# Copy the URL it gives you (e.g., https://missed-the-game-proxy.xxx.workers.dev)
```

## Step 3: Deploy to Vercel (10 min)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Add New Project** → Import your `missed-the-game` repo
3. **Before clicking Deploy**, add all environment variables:

   Open `.env.example` (or see list below) and add each variable in Vercel's Environment Variables section.

4. Click **Deploy**
5. Wait 2-3 minutes → You'll get a URL like `missed-the-game.vercel.app`

## Step 4: Add Custom Domain (10 min)

1. Buy domain from Namecheap/Google Domains/etc.
2. In Vercel: **Settings** → **Domains** → Add your domain
3. Follow Vercel's DNS instructions at your registrar
4. Wait 1-2 hours for DNS to propagate
5. Update `NEXT_PUBLIC_DONATION_RETURN_URL` in Vercel with your domain

## Required Environment Variables

Add these in Vercel **Settings → Environment Variables**:

```
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SCOREBAT_PROXY_URL=https://your-worker.workers.dev
NEXT_PUBLIC_TOP_COMPETITIONS=["Premier League","UEFA Champions League","La Liga","Serie A","Bundesliga"]
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
MAILCHIMP_API_KEY=your_key
MAILCHIMP_SERVER_PREFIX=us10
MAILCHIMP_AUDIENCE_ID=your_id
NEXT_PUBLIC_BMAC_PROFILE=your_handle
NEXT_PUBLIC_DONATION_RETURN_URL=https://yourdomain.com/thanks
```

## That's It! 🎉

Your app is now live. See [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting and advanced configuration.

